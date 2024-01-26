import * as core from '@actions/core'
import { execSync } from 'child_process'
import { getVars, isErrorLike } from './utils/actionUtils'
import { Log } from './utils/logUtils'

async function restore() {
  try {
    const { cachePath, targetDir, options, isCacheExist } = getVars()
    if (isCacheExist) {
      Log.info('Cache exist at ' + cachePath)
      execSync(`mkdir -p "${targetDir}"`)
      execSync(`rsync -a "${cachePath}/" "${targetDir}"`, {
        stdio: 'inherit',
        shell: 'true'
      })
      Log.info('Cache restore success')
      core.setOutput('cache-hit', true)
    } else {
      Log.info('Cache not found at ' + cachePath)
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
    core.setFailed(Log.error(errorMessage))
  }
}

void restore()
