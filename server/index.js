import 'dotenv/config'
import express from 'express'

import { addGroupMember, ConfigError } from './googleWorkspace.js'

const app = express()
const port = Number(process.env.PORT ?? 8787)
const gmailPattern = /^[a-z0-9._%+-]+@gmail\.com$/i

app.use(express.json({ limit: '10kb' }))

app.get('/api/health', (_request, response) => {
  response.json({ ok: true })
})

app.post('/api/testers', async (request, response) => {
  const email = typeof request.body?.email === 'string' ? request.body.email.trim() : ''

  if (!gmailPattern.test(email)) {
    response.status(400).json({
      code: 'invalid_email',
      message: 'Please enter a valid Gmail address ending in @gmail.com.',
    })
    return
  }

  try {
    const result = await addGroupMember(email)
    const statusCode = result.code === 'added' ? 201 : 200

    response.status(statusCode).json(result)
  } catch (error) {
    if (error instanceof ConfigError) {
      response.status(500).json({
        code: 'configuration_error',
        message:
          'Signup is not configured yet. Add the required Google Workspace credentials to the server environment.',
        details: error.missingVariables,
      })
      return
    }

    console.error('Failed to add tester to Google Workspace group.', error)

    response.status(502).json({
      code: 'google_api_error',
      message: 'We could not add your Gmail right now. Please try again later.',
    })
  }
})

app.listen(port, () => {
  console.log(`Shout4Help signup API listening on http://localhost:${port}`)
})
