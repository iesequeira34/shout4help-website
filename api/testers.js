import 'dotenv/config'

import { processTesterSignup } from '../server/testerSignup.js'

function getEmailFromRequest(request) {
  if (typeof request.body === 'string') {
    try {
      const parsed = JSON.parse(request.body)
      return parsed?.email
    } catch {
      return ''
    }
  }

  return request.body?.email
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    response.status(405).json({
      code: 'method_not_allowed',
      message: 'Use POST /api/testers to submit a Gmail address.',
    })
    return
  }

  const result = await processTesterSignup(getEmailFromRequest(request))
  response.status(result.statusCode).json(result.body)
}
