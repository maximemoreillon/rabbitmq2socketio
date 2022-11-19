import express from 'express'
import http from 'http'
import dotenv from 'dotenv'
import cors from 'cors'
import rabbitmq from './rabbitmq'
import { ioInit } from './io'

dotenv.config()

const {
    PORT = 80
} = process.env


const app = express()
app.use(cors())

const server = http.createServer(app)


ioInit(server)
rabbitmq.init()

// TODO: root route for app info

server.listen(PORT, () => {
    console.log(`[HTTP server] Listening on port ${PORT}`);
})









