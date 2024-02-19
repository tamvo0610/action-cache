import * as core from '@actions/core'
import * as ultils from './utils/actionUtils'
import { Log } from './utils/logUtils'
import { Outputs } from './constants'
import { _exec } from './utils/execUtils'

async function restoreImpl() {
  try {
    const { cachePath, targetPath, options } = await ultils.getInputs()
    const isCacheExist = await _exec.exists(cachePath)
    if (isCacheExist) {
      Log.info('Cache exist, restore cache')
      await _exec.mkdir(targetPath)
      Log.info('Create target folder')
      await _exec.rsync(cachePath, targetPath)
      Log.info('Cache restore success')
      return core.setOutput(Outputs.CacheHit, true)
    }
    Log.info('Cache not exist, skip restore')
    if (!!options?.action) {
      await _exec.run(`cd ${options.workingDir} && ${options.action}`)
    }
    core.setOutput(Outputs.CacheHit, false)
  } catch (error: any) {
    const errorMessage = ultils.isErrorLike(error) ? error.message : error
    core.setFailed(Log.error(errorMessage))
  }
}

export async function restoreRun() {
  restoreImpl()
}
