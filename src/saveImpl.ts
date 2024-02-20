import * as _action from './utils/action.utils'
import * as _exec from './utils/exec.utils'
import { Log } from './utils/log.ultis'

export async function saveImpl() {
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
    if (isCacheExist) {
      Log.info('Cache exist, skip save')
      return process.exit(0)
    }
    Log.info('Cache not exist, save cache')
    await _exec.mkdir(cachePath)
    Log.info('Create cache folder')
    await _exec.rsync(targetPath, cachePath)
    Log.info('Cache save success')
    return process.exit(0)
  } catch (error: any) {
    const errorMessage = _action.isErrorLike(error) ? error.message : error
    _action.setFailed(Log.error(errorMessage))
    process.exit(1)
  }
}
