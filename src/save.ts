import * as core from '@actions/core'
import * as io_util from '@actions/io/lib/io-util.js'
import { execSync } from 'child_process'
import { getVars, isErrorLike } from './utils/actionUtils'
import { Log } from './utils/logUtils'

async function save() {
  try {
    const { cachePath, cacheDir, targetDir } = getVars()
    const isCacheExist = await io_util.exists(cachePath)
    Log.info(`isCacheExist: ${isCacheExist}`)
    if (isCacheExist) return
    await io_util.mkdir(cachePath)
    await io_util.copyFile(targetDir, cachePath)
    // execSync(`mkdir -p "${cachePath}"`)
    // execSync(`rsync -a "${targetDir}/" "${cachePath}"`, {
    //   stdio: 'inherit',
    //   shell: 'true'
    // })
    Log.info('Cache save success')
  } catch (error: any) {
    const errorMessage = isErrorLike(error) ? error.message : error
    core.setFailed(Log.error(errorMessage))
  }
}

void save()
