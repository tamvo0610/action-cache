import { Outputs } from './constants/enum'
import * as _action from './utils/action.utils'
import * as _exec from './utils/exec.utils'
import { Log } from './utils/log.ultis'

export async function restoreImpl() {
  try {
    const { cachePath, targetPath, options } = _action.getInputs()
    const isCacheExist = await _exec.exists(cachePath)
    if (!isCacheExist) {
      Log.info('Cache not exist, skip restore')
      if (!!options.action) {
        await _exec.run(options.action)
      }
      return _action.setOutput(Outputs.CacheHit, false)
    }
    Log.info('Cache exist')
    if (options.saveOnly) {
      Log.info('Save only, skip restore')
      return _action.setOutput(Outputs.CacheHit, true)
    }
    Log.info('Restore cache')
    await _exec.mkdir(targetPath)
    Log.info('Create target folder')
    await _exec.rsync(cachePath, targetPath)
    Log.info('Cache restore success')
    _action.setOutput(Outputs.CacheHit, true)
  } catch (error: any) {
    const errorMessage = _action.isErrorLike(error) ? error.message : error
    _action.setFailed(Log.error(errorMessage))
    process.exit(1)
  }
  process.exit(0)
}
