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

  // #region agent log
  fetch('http://127.0.0.1:7316/ingest/70f095ac-22c5-4dce-af96-a83c9dce107e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'76fb6e'},body:JSON.stringify({sessionId:'76fb6e',runId:'initial',hypothesisId:'H2',location:'server/googleWorkspace.js:63',message:'Workspace config resolved',data:{hasGroupEmail:Boolean(config.groupEmail),hasImpersonatedAdmin:Boolean(config.impersonatedAdminEmail),hasClientEmail:Boolean(config.clientEmail),privateKeyLength:config.privateKey.length,groupDomain:config.groupEmail.split('@')[1] ?? null,adminDomain:config.impersonatedAdminEmail.split('@')[1] ?? null,clientEmailDomain:config.clientEmail.split('@')[1] ?? null},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  const auth = new google.auth.JWT({
    email: config.clientEmail,
    key: config.privateKey,
    scopes: [GOOGLE_GROUP_MEMBER_SCOPE],
    subject: config.impersonatedAdminEmail,
  })

  // #region agent log
  fetch('http://127.0.0.1:7316/ingest/70f095ac-22c5-4dce-af96-a83c9dce107e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'76fb6e'},body:JSON.stringify({sessionId:'76fb6e',runId:'initial',hypothesisId:'H1',location:'server/googleWorkspace.js:74',message:'JWT auth prepared',data:{scope:GOOGLE_GROUP_MEMBER_SCOPE,hasSubject:Boolean(config.impersonatedAdminEmail),subjectMatchesGroupDomain:(config.impersonatedAdminEmail.split('@')[1] ?? null)===(config.groupEmail.split('@')[1] ?? null)},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

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

    // #region agent log
    fetch('http://127.0.0.1:7316/ingest/70f095ac-22c5-4dce-af96-a83c9dce107e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'76fb6e'},body:JSON.stringify({sessionId:'76fb6e',runId:'initial',hypothesisId:status===401?'H1':status===404?'H3':'H4',location:'server/googleWorkspace.js:94',message:'Google API add member failed',data:{status,error:error instanceof Error ? error.message : String(error),responseError:error?.response?.data?.error ?? null,responseDescription:error?.response?.data?.error_description ?? null},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

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
