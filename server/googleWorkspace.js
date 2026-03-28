import { google } from 'googleapis'

const GOOGLE_GROUP_MEMBER_SCOPE =
  'https://www.googleapis.com/auth/admin.directory.group.member'

export class ConfigError extends Error {
  constructor(message, missingVariables = []) {
    super(message)
    this.name = 'ConfigError'
    this.missingVariables = missingVariables
  }
}

function getRequiredEnv(name) {
  return process.env[name]?.trim() ?? ''
}

function getWorkspaceConfig() {
  const config = {
    groupEmail: getRequiredEnv('GOOGLE_GROUP_EMAIL'),
    impersonatedAdminEmail: getRequiredEnv('GOOGLE_IMPERSONATED_ADMIN_EMAIL'),
    clientEmail: getRequiredEnv('GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL'),
    privateKey: (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? '')
      .replace(/\\n/g, '\n')
      .trim(),
  }

  const missingVariables = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => {
      switch (key) {
        case 'groupEmail':
          return 'GOOGLE_GROUP_EMAIL'
        case 'impersonatedAdminEmail':
          return 'GOOGLE_IMPERSONATED_ADMIN_EMAIL'
        case 'clientEmail':
          return 'GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL'
        case 'privateKey':
          return 'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY'
        default:
          return key
      }
    })

  if (missingVariables.length > 0) {
    throw new ConfigError(
      `Missing required Google Workspace configuration: ${missingVariables.join(', ')}`,
      missingVariables,
    )
  }

  return config
}

function getGoogleErrorStatus(error) {
  return error?.code ?? error?.response?.status ?? error?.status ?? null
}

export async function addGroupMember(email) {
  const config = getWorkspaceConfig()

  const auth = new google.auth.JWT({
    email: config.clientEmail,
    key: config.privateKey,
    scopes: [GOOGLE_GROUP_MEMBER_SCOPE],
    subject: config.impersonatedAdminEmail,
  })

  const directory = google.admin({
    version: 'directory_v1',
    auth,
  })

  try {
    await directory.members.insert({
      groupKey: config.groupEmail,
      requestBody: {
        email,
        role: 'MEMBER',
      },
    })

    return {
      code: 'added',
      message: 'Success. Your Gmail was added to the Shout4Help tester group.',
    }
  } catch (error) {
    const status = getGoogleErrorStatus(error)

    if (status === 409) {
      return {
        code: 'already_member',
        message: 'This Gmail is already in the Shout4Help tester group.',
      }
    }

    if (status === 404) {
      throw new ConfigError(
        'The configured Google Workspace group or admin account could not be found.',
      )
    }

    throw error
  }
}
