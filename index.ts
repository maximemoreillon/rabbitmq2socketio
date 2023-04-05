import express from "express"
import http from "http"
import { Server, Socket } from "socket.io"
import dotenv from "dotenv"
import cors from "cors"
import { name as application, version, author } from "./package.json"
import {
  init as rabbitMqInit,
  url as rabbitMqUrl,
  queues as rabbitMqQueues,
} from "./rabbitmq"

dotenv.config()

const { PORT = 80 } = process.env

// Express
const app = express()
app.use(cors())
app.get("/", (req, res) => {
  res.send({
    application,
    version,
    author,
    rabbitMq: {
      url: rabbitMqUrl,
      queues: rabbitMqQueues,
    },
  })
})

// HTTP
const httpServer = http.createServer(app)
httpServer.listen(PORT, () => {
  console.log(`[HTTP server] Listening on port ${PORT}`)
})

// Socket.io
const socketio_options = { cors: { origin: "*" } }
export const io = new Server(httpServer, socketio_options)
io.on("connection", (socket: Socket) => {
  console.log(`[Socket.io] Socket ${socket.id} connected`)
})

// RabbitMq
rabbitMqInit()
