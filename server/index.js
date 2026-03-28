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

  // #region agent log
  fetch('http://127.0.0.1:7316/ingest/70f095ac-22c5-4dce-af96-a83c9dce107e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'76fb6e'},body:JSON.stringify({sessionId:'76fb6e',runId:'initial',hypothesisId:'H5',location:'server/index.js:19',message:'Backend request received',data:{hasBody:request.body != null,isValidGmail:gmailPattern.test(email),emailDomain:email.split('@')[1] ?? null,bodyKeys:Object.keys(request.body ?? {})},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

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
    // #region agent log
    fetch('http://127.0.0.1:7316/ingest/70f095ac-22c5-4dce-af96-a83c9dce107e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'76fb6e'},body:JSON.stringify({sessionId:'76fb6e',runId:'initial',hypothesisId:error instanceof ConfigError ? 'H2' : 'H1',location:'server/index.js:36',message:'Backend request failed',data:{errorName:error instanceof Error ? error.name : typeof error,errorCode:error?.code ?? null,errorStatus:error?.status ?? error?.response?.status ?? null,errorMessage:error instanceof Error ? error.message : String(error)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

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
