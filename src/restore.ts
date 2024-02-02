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
    const { cachePath, targetPath, options } = getVars()
    const isCacheExist = await checkDirExist(cachePath)
    if (isCacheExist) {
      Log.info('Cache exist, restore cache')
      await runExec(`mkdir -p ${targetPath}`)
      Log.info('Create target folder')
      await runExec(`rsync -a ${cachePath}/ ${targetPath}`)
      Log.info('Cache restore success')
      return core.setOutput('cache-hit', true)
    }
    Log.info('Cache not exist, skip restore')
    if (!!options?.action) {
      await runExec(`cd ${options.workingDir} && ${options.action}`)
    }
    core.setOutput('cache-hit', false)
  } catch (error: any) {
    const errorMessage = isErrorLike(error) ? error.message : error
    core.setFailed(Log.error(errorMessage))
  }
}

void restore()
