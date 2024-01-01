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

/**
 * Endpoint to register all feeding info
 * @param {object} req request object containing payload as below
 * {
 *      date, 
 *      time, 
 *      feeding, 
 *      quantity,
 *      pee,
 *      poop
 * }
 */
router.post('/events/feeding', async (req, res) => { 
    try{
        const now = new Date()
        let payload  = JSON.parse(req.body)

        if(!payload?.time){
            payload['time'] = now.toLocaleTimeString()
        }

        if(!payload?.date){
            payload['date'] = now.toLocaleDateString()
        }

        // Ensure final payload is in order
        let resourcePayload = {
            date: payload?.date, 
            time: payload?.time,
            feeding: payload?.type || "Formula" , 
            quantity: payload?.quantity || "Unknown",
            pee: payload?.pee ?? 0,
            poop: payload?.poop ?? 0 
        }

        const values = [Object.values(resourcePayload)]
        const request = {
            spreadsheetId: process.env.SHEET_ID,
            range: 'Sheet1!A:F',
            valueInputOption: 'USER_ENTERED',
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

router.get('/feedings', async (req, res)=>{
    const request = {
        spreadsheetId: process.env.SHEET_ID,
        range: "Sheet1!A:F",
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