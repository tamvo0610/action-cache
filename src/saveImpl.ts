import { Outputs } from './constants/enum'
import * as _action from './utils/action.utils'
import * as _exec from './utils/exec.utils'
import { Log } from './utils/log.ultis'

export async function saveImpl(saveOnly = false) {
  try {
    const {
      cachePath,
      targetPath,
      cacheDir,
      targetDir,
      targetAction,
      workingDir
    } = _action.getInputs()
    const isCacheExist = await _exec.exists(cachePath)
    if (isCacheExist) {
      Log.info('Cache exist, skip save')
      return _action.setOutput(Outputs.CacheHit, true)
    }
    Log.info('Cache not exist, save cache')
    await _exec.mkdir(cachePath)
    Log.info('Create cache folder')
    await _exec.rsync(targetPath, cachePath)
    Log.info('Cache save success')
    _action.setOutput(Outputs.CacheHit, false)
  } catch (error: any) {
    const errorMessage = _action.isErrorLike(error) ? error.message : error
    _action.setFailed(Log.error(errorMessage))
    process.exit(1)
  }
  process.exit(0)
}
