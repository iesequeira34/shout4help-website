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

async function verifyGroupMember(directory, groupEmail, email) {
  try {
    const response = await directory.members.get({
      groupKey: groupEmail,
      memberKey: email,
    })

    return typeof response?.data?.email === 'string'
  } catch (error) {
    if (getGoogleErrorStatus(error) === 404) {
      return false
    }

    throw error
  }
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

    const isVerified = await verifyGroupMember(directory, config.groupEmail, email)

    if (!isVerified) {
      return {
        code: 'verification_failed',
        message:
          'We received your request, but could not verify membership in the group yet. Please try again in a moment.',
      }
    }

    return {
      code: 'added',
      message:
        'Success. You were added to Shout4Help Testers group.',
    }
  } catch (error) {
    const status = getGoogleErrorStatus(error)

    if (status === 409) {
      const isVerified = await verifyGroupMember(directory, config.groupEmail, email)

      if (!isVerified) {
        return {
          code: 'verification_failed',
          message:
            'You may already exist on the tester list, but we could not verify membership in the group yet. Please try again in a moment.',
        }
      }

      return {
        code: 'already_member',
        message:
          'You are already a verified member of our group.',
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
