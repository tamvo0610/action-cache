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
    const { cachePath, targetDir, targetPath, options } = getVars()
    const isCacheExist = await checkDirExist(cachePath)
    if (isCacheExist) {
      Log.info('Cache exist, restore cache')
      Log.info('Create target folder')
      await runExec(`mkdir -p ${targetDir}`)
      Log.info('Sync cache folder')
      await runExec(`rsync -a ${cachePath}/ ${targetDir}`)
      Log.info('Cache restore success')
      return core.setOutput('cache-hit', true)
    }
    Log.info('Action: ' + options?.action)
    Log.info('Cache not exist, skip restore')
    if (!!options?.action) {
      Log.info('Action cache provided, run action')
      await runExec(`cd ${options.workingDir} && ${options.action}`)
      Log.info('Create cache folder')
      await runExec(`mkdir -p ${cachePath}`)
      Log.info('Sync cache folder')
      await runExec(`rsync -a ${targetPath}/ ${cachePath}`)
      Log.info('Cache save success')
      return core.setOutput('cache-hit', true)
    }
    core.setOutput('cache-hit', false)
  } catch (error: any) {
    const errorMessage = isErrorLike(error) ? error.message : error
    core.setFailed(Log.error(errorMessage))
  }
}

void restore()
