import express from 'express'
import http from 'http'
import dotenv from 'dotenv'
import cors from 'cors'
import { 
    init as rabbitMqInit,
    url as rabbitMqUrl,
    queue as rabbitMqQueue
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

// TODO: root route for app info


app.get('/', (req, res) => {
    res.send({
        application_name: 'rabbitmq2socketio',
        rabbitMq: {
            url: rabbitMqUrl,
            queue: rabbitMqQueue
        }
    })
})

server.listen(PORT, () => {
    console.log(`[HTTP server] Listening on port ${PORT}`);
})









