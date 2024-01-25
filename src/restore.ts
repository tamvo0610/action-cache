import * as core from '@actions/core'
import * as io_util from '@actions/io/lib/io-util.js'
import { execSync } from 'child_process'

import { getVars, isErrorLike, getMessage } from './utils/actionUltis'

async function restore() {
  try {
    const { cachePath, targetDir, options } = await getVars()
    const isCacheExist = await io_util.exists(cachePath)
    if (isCacheExist) {
      console.log(getMessage('INFO', 'Cache exist at ' + cachePath))
      execSync(`mkdir -p "${targetDir}"`)
      execSync(`rsync -a "${cachePath}" "${targetDir}"`, {
        stdio: 'inherit',
        shell: 'true'
      })
      console.log(getMessage('INFO', 'Cache restore success'))
      core.setOutput('cache-hit', true)
    } else {
      console.log(getMessage('INFO', 'Cache not found at ' + cachePath))
      if (!!options?.action) {
        execSync(`cd ${options.workingDir} && ${options.action}`, {
          stdio: 'inherit',
          shell: 'true'
        })
        core.setOutput('action-hit', true)
      }
      core.setOutput('cache-hit', false)
    }
  } catch (error: any) {
    const errorMessage = isErrorLike(error) ? error.message : error
    core.setFailed(getMessage('ERROR', errorMessage))
  }
}

void restore()
