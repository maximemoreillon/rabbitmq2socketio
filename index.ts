import express from 'express'
import http from 'http'
import dotenv from 'dotenv'
import cors from 'cors'
import { 
    init as rabbitMqInit,
    url as rabbitMqUrl,
    queues as rabbitMqQueues
} from './rabbitmq'
import { init as ioInit } from './io'

dotenv.config()

const {
    PORT = 80
} = process.env

const app = express()
app.use(cors())

const server = http.createServer(app)

ioInit(server)
rabbitMqInit()


app.get('/', (req, res) => {
    res.send({
        application_name: 'rabbitmq2socketio',
        rabbitMq: {
            url: rabbitMqUrl,
            queues: rabbitMqQueues
        }
    })
})

server.listen(PORT, () => {
    console.log(`[HTTP server] Listening on port ${PORT}`);
})









