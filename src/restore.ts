import * as core from '@actions/core'
import {
  checkDirExist,
  getVars,
  isErrorLike,
  runExec
} from './utils/actionUtils'
import { Log } from './utils/logUtils'

async function restore() {
  try {
    const { cachePath, targetDir, options } = getVars()
    const isCacheExist = await checkDirExist(cachePath)
    if (isCacheExist) {
      Log.info('Cache exist, restore cache')
      await runExec(`mkdir -p ${targetDir}`)
      Log.info('Create target folder')
      await runExec(`rsync -a ${cachePath}/ ${targetDir}`)
      Log.info('Cache restore success')
      core.setOutput('cache-hit', true)
    } else {
      Log.info('Cache not exist, skip restore')
      if (!!options?.action) {
        await runExec(`cd ${options.workingDir} && ${options.action}`)
      }
      core.setOutput('cache-hit', false)
    }
  } catch (error: any) {
    const errorMessage = isErrorLike(error) ? error.message : error
    core.setFailed(Log.error(errorMessage))
  }
}

void restore()
