import { Outputs } from './constants/enum'
import * as _action from './utils/action.utils'
import * as _exec from './utils/exec.utils'
import { Log } from './utils/log.ultis'

async function checkCacheExist() {
  const { cachePath } = _action.getInputs()
  const isCacheExist = await _exec.exists(cachePath)
  if (!isCacheExist) {
    Log.info('Cache not exist')
    _action.setOutput(Outputs.CacheHit, false)
    return false
  }
  Log.info('Cache exist')
  _action.setOutput(Outputs.CacheHit, true)
  return true
}

void checkCacheExist()
