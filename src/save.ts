import * as core from '@actions/core'
import * as io_util from '@actions/io/lib/io-util.js'
import { execSync } from 'child_process'
import { getVars, isErrorLike } from './utils/actionUtils'
import { Log } from './utils/logUtils'

async function save() {
  try {
    const { cachePath, cacheDir, targetDir } = getVars()
    const isCacheExist = await io_util.exists(cachePath)
    if (isCacheExist) return
    execSync(`mkdir -p "${cacheDir}"`)
    execSync(`rsync -a "${targetDir}/" "${cachePath}"`, {
      stdio: 'inherit',
      shell: 'true'
    })
  } catch (error: any) {
    const errorMessage = isErrorLike(error) ? error.message : error
    core.setFailed(Log.error(errorMessage))
  }
}

void save()
