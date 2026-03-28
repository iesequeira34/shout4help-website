import 'dotenv/config'
import express from 'express'

import { processTesterSignup } from './testerSignup.js'

const app = express()
const port = Number(process.env.PORT ?? 8787)

app.use(express.json({ limit: '10kb' }))

app.get('/api/health', (_request, response) => {
  response.json({ ok: true })
})

app.post('/api/testers', async (request, response) => {
  const result = await processTesterSignup(request.body?.email)
  response.status(result.statusCode).json(result.body)
})

app.listen(port, () => {
  console.log(`Shout4Help signup API listening on http://localhost:${port}`)
})
