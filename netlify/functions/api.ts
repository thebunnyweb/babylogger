import express, { Router } from 'express'
import ServerlessHttp from 'serverless-http'

const app = express()
const router = Router()

router.get('/hello', (req, res) => {
    res.send('Hello World !!')
})

app.use('/api/', router)

export const handler = ServerlessHttp(app)