import amqplib from 'amqplib'
import dotenv from 'dotenv'
import { getIo } from './io'

dotenv.config()

const {
    RABBITMQ_URL = 'amqp://localhost',
    RABBITMQ_QUEUES = '',
} = process.env

const queues = RABBITMQ_QUEUES.split(',')


const messageCallback = (message: any) => {
    const queue = message.routingKey
    const messageString = message.content.toString()
    const messageJson = JSON.parse(messageString)
    getIo().emit(queue, messageJson)
}

const init = async () => {

    const connection = await amqplib.connect(RABBITMQ_URL)
    console.log('[RabbitMQ] connected')

    const channel = await connection.createChannel()
    console.log('[RabbitMQ] Channel created')

    const consumeOptions = { noAck: false }

    for await (const queue of queues) {
        // AssertQueue will create the queue if it does not exist
        await channel.assertQueue(queue, { durable: false })
        channel.consume(queue, messageCallback, consumeOptions)
    }
}


export {
    init,
    RABBITMQ_URL as url,
    queues as queues,
}