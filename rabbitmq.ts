import amqplib from "amqplib"
import dotenv from "dotenv"
import { io } from "."

dotenv.config()

const { RABBITMQ_URL = "amqp://localhost", RABBITMQ_QUEUES = "" } = process.env

const queues = RABBITMQ_QUEUES.split(",")

const messageCallback = (message: any) => {
  const queue = message.fields.routingKey
  const messageString = message.content.toString()
  const messageJson = JSON.parse(messageString)
  io.emit(queue, messageJson)
}

const connectionErrorCallback = (error: any) => {
  console.log(`[RabbitMQ] Connection lost`)
  init()
}

const channelErrorCallback = (error: any) => {
  console.log(error)
  init()
}

const init = async () => {
  try {
    console.log(`[RabbitMQ] Connecting to ${RABBITMQ_URL} ...`)
    const connection = await amqplib.connect(RABBITMQ_URL)
    console.log("[RabbitMQ] connected")

    connection.on("error", connectionErrorCallback)

    const channel = await connection.createChannel()
    console.log("[RabbitMQ] Channel created")

    channel.on("error", channelErrorCallback)

    const consumeOptions = { noAck: false }

    for await (const queue of queues) {
      // AssertQueue will create the queue if it does not exist
      await channel.assertQueue(queue, { durable: false })
      channel.consume(queue, messageCallback, consumeOptions)
    }
  } catch (error) {
    console.log("[RabbitMQ] Init failed, retrying in 5s...")
    setTimeout(init, 5000)
  }
}

export { init, RABBITMQ_URL as url, queues as queues }
