import { Outputs } from './constants/enum'
import * as _action from './utils/action.utils'
import * as _exec from './utils/exec.utils'
import { Log } from './utils/log.ultis'

export async function restoreImpl(isSkipSave = false) {
  try {
    const {
      cachePath,
      targetPath,
      cacheDir,
      targetDir,
      targetAction,
      workingDir
    } = await _action.getInputs()
    const isCacheExist = await _exec.exists(cachePath)
    // if (isCacheExist) {
    //   Log.info('Cache exist, restore cache')
    //   await _exec.mkdir(targetPath)
    //   Log.info('Create target folder')
    //   await _exec.rsync(cachePath, targetPath)
    //   Log.info('Cache restore success')
    //   return _action.setOutput(Outputs.CacheHit, true)
    // }
    Log.info('Cache not exist, skip restore')
    if (!isSkipSave && !!targetAction) {
      Log.info('Run Action' + targetAction)
      await _exec.run(targetAction)
    }
    // _action.setOutput(Outputs.CacheHit, false)
  } catch (error: any) {
    const errorMessage = _action.isErrorLike(error) ? error.message : error
    _action.setFailed(Log.error(errorMessage))
  }
}
