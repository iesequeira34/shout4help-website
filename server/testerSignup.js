import { addGroupMember, ConfigError } from './googleWorkspace.js'

const gmailPattern = /^[a-z0-9._%+-]+@gmail\.com$/i

export async function processTesterSignup(rawEmail) {
  const email = typeof rawEmail === 'string' ? rawEmail.trim() : ''

  if (!gmailPattern.test(email)) {
    return {
      statusCode: 400,
      body: {
        code: 'invalid_email',
        message: 'Please enter a valid Gmail address ending in @gmail.com.',
      },
    }
  }

  try {
    const result = await addGroupMember(email)

    return {
      statusCode: result.code === 'added' ? 201 : 200,
      body: result,
    }
  } catch (error) {
    if (error instanceof ConfigError) {
      return {
        statusCode: 500,
        body: {
          code: 'configuration_error',
          message:
            'Signup is not configured yet. Add the required Google Workspace credentials to the server environment.',
          details: error.missingVariables,
        },
      }
    }

    console.error('Failed to add tester to Google Workspace group.', error)

    return {
      statusCode: 502,
      body: {
        code: 'google_api_error',
        message: 'We could not add your Gmail right now. Please try again later.',
      },
    }
  }
}
