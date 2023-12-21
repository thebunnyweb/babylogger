import express, { Router } from 'express'
import ServerlessHttp from 'serverless-http'
import { google } from 'googleapis'
import 'dotenv/config'

const api = express()
const router = Router()

api.use('/api/', router)
api.use(express.json())

const auth = new google.auth.GoogleAuth({
    credentials: {
      //@ts-ignore
      "type": process.env.GOOGLE_AUTH_TYPE,
      "project_id": process.env.GOOGLE_PROJECT_ID,
      "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
      "private_key": process.env.GOOGLE_PRIVATE_KEY,
      "client_email": process.env.GOOGLE_CLIENT_EMAIL,
      "client_id": process.env.GOOGLE_CLIENT_ID,
      "auth_uri": process.env.GOOGLE_AUTH_URI,
      "token_uri": process.env.GOOGLE_TOKEN_URI,
      "auth_provider_x509_cert_url": process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
      "client_x509_cert_url": process.env.GOOGLE_CLIENT_X509_CERT_URL,
      "universe_domain": process.env.GOOGLE_UNIVERSE_DOMAIN
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
})

const sheets = google.sheets({ version: 'v4', auth })

router.post('/diaper/events', async (req, res) => { 
    try{
        const now = new Date()
        let payload  = JSON.parse(req.body)

        if(!payload?.time){
            payload['time'] = now.toTimeString()
        }

        if(!payload?.date){
            payload['date'] = now.toDateString()
        }

        // Ensure final payload is in order
        let resourcePayload = {
            date: payload?.date, 
            time: payload?.time,
            urination: payload?.urination,
            defecation: payload?.defecation,
        }

        const values = [Object.values(resourcePayload)]
        const request = {
            spreadsheetId: process.env.SHEET_ID,
            range: 'Sheet1!A:D',
            valueInputOption: 'RAW',
            resource: { values },
        }

        const response = await sheets.spreadsheets.values.append(request) 
        res.status(200).json({
            message: "success",
            response: response.data
        })
    }catch(e){
        res.status(500).json({
            message: "error",
            response: null
        })
    }
})


router.post('/sleep/events', async (req, res) => { 
    try{
        const now = new Date()
        let payload  = JSON.parse(req.body)

        if(!payload?.time){
            payload['time'] = now.toTimeString()
        }

        if(!payload?.date){
            payload['date'] = now.toDateString()
        }

        // Ensure final payload is in order
        let resourcePayload = {
            date: payload?.date, 
            time: payload?.time,
            sleepstart: payload?.sleepstart,
            sleepend: payload?.sleepend,
        }

        const values = [Object.values(resourcePayload)]
        const request = {
            spreadsheetId: process.env.SHEET_ID,
            range: 'Sheet2!A:D',
            valueInputOption: 'RAW',
            resource: { values },
        }

        const response = await sheets.spreadsheets.values.append(request) 
        res.status(200).json({
            message: "success",
            response: response.data
        })
    }catch(e){
        res.status(500).json({
            message: "error",
            response: null
        })
    }
})


router.post('/feed/events', async (req, res) => { 
    try{
        const now = new Date()
        let payload  = JSON.parse(req.body)

        if(!payload?.time){
            payload['time'] = now.toTimeString()
        }

        if(!payload?.date){
            payload['date'] = now.toDateString()
        }

        // Ensure final payload is in order
        let resourcePayload = {
            date: payload?.date, 
            time: payload?.time,
        }

        const values = [Object.values(resourcePayload)]
        const request = {
            spreadsheetId: process.env.SHEET_ID,
            range: 'Sheet3!A:B',
            valueInputOption: 'RAW',
            resource: { values },
        }

        const response = await sheets.spreadsheets.values.append(request) 
        res.status(200).json({
            message: "success",
            response: response.data
        })
    }catch(e){
        res.status(500).json({
            message: "error",
            response: null
        })
    }
})

router.get('/diaper/events', async (req, res)=>{
    const request = {
        spreadsheetId: process.env.SHEET_ID,
        range: "Sheet1!A:D",
    }
    const response = await sheets.spreadsheets.values.get(request) 
    const values = response.data.values
    res.status(200).json({
        message: "success",
        values
    })
})


router.get('/sleep/events', async (req, res)=>{
    const request = {
        spreadsheetId: process.env.SHEET_ID,
        range: "Sheet2!A:D",
    }
    const response = await sheets.spreadsheets.values.get(request) 
    const values = response.data.values
    res.status(200).json({
        message: "success",
        values
    })
})

router.get('/feed/events', async (req, res)=>{
    const request = {
        spreadsheetId: process.env.SHEET_ID,
        range: "Sheet3!A:B",
    }
    const response = await sheets.spreadsheets.values.get(request) 
    const values = response.data.values
    res.status(200).json({
        message: "success",
        values
    })
})


router.get('/ping', (req, res)=> {
    res.status(200).json({
        status: "alive"
    })
})



export const handler = ServerlessHttp(api)