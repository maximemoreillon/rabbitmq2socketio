import amqplib from 'amqplib'
import dotenv from 'dotenv'
import { getIo } from './io'

dotenv.config()

const {
    RABBITMQ_URL = 'amqp://localhost',
    RABBITMQ_QUEUE = 'defaultQueue'
} = process.env







const consumeCallback = (message: any) => {
    const messageString = message.content.toString()
    const {topic, data} = JSON.parse(messageString)
    getIo().emit(topic, data)
}


export default {
    init: async () => {
        const connection = await amqplib.connect(RABBITMQ_URL)
        console.log('[RabbitMQ] connected')
        const channel = await connection.createChannel()
        console.log('[RabbitMQ] Channel created')
        await channel.assertQueue(RABBITMQ_QUEUE, { durable: false });
        const consumeOptions = { noAck: true }
        channel.consume(RABBITMQ_QUEUE, consumeCallback, consumeOptions)
    }
}