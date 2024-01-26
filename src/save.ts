import * as core from '@actions/core'
import * as io_util from '@actions/io/lib/io-util.js'
import { getVars, isErrorLike } from './utils/actionUtils'
import * as fs from 'fs'
import { Log } from './utils/logUtils'
import path from 'path'

async function save() {
  try {
    const { cachePath, cacheDir, targetDir, options } = getVars()
    const isCacheExist = await io_util.exists(cachePath)
    Log.info(`isCacheExist: ${isCacheExist}`)
    if (isCacheExist) return
    fs.mkdirSync(cachePath, {
      recursive: true
    })
    Log.info(`Create Cache Folder ${cachePath}`)
    fs.cpSync(targetDir, cachePath, {
      recursive: true
    })
    // await io_util.copyFile(targetDir, path.join(cacheDir, options.cacheKey))
    Log.info(`Sync Cache Folder ${targetDir} to ${cachePath}`)
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
