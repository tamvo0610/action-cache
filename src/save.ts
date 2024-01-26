import * as core from '@actions/core'
import * as io_util from '@actions/io/lib/io-util.js'
import { execSync } from 'child_process'
import { getVars, isErrorLike } from './utils/actionUtils'
import { Log } from './utils/logUtils'
import path from 'path'

async function save() {
  try {
    const { cachePath, cacheDir, targetDir, options } = getVars()
    const isCacheExist = await io_util.exists(cachePath)
    Log.info(`isCacheExist: ${isCacheExist}`)
    if (isCacheExist) return
    Log.info('Create Cache Folder')
    await io_util.mkdir(path.join(cacheDir, options.cacheDir))
    Log.info('Sync Cache Folder')
    await io_util.copyFile(targetDir, path.join(cacheDir, options.cacheDir))
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
