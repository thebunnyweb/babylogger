import express, { Router } from 'express'
import ServerlessHttp from 'serverless-http'

const api = express()
const router = Router()

router.get('/hello', (req, res) => {
    res.send('Hello World !!')
})

api.use('/api/', router)

export const handler = ServerlessHttp(api)