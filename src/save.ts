import * as core from '@actions/core'
import { exists } from '@actions/io/lib/io-util'
import { execSync } from 'child_process'
import { getVars, isErrorLike } from './utils/actionUtils'
import { Log } from './utils/logUtils'

async function save() {
  try {
    const { cachePath, targetPath } = getVars()
    const isCacheExist = await exists(cachePath)
    if (isCacheExist) return
    execSync(`mkdir -p ${cachePath}`)
    Log.info(`Create Cache Folder ${cachePath}`)
    execSync(`rsync -a ${targetPath}/ ${cachePath}`)
    Log.info(`Sync Cache Folder ${targetPath} to ${cachePath}`)
  } catch (error: any) {
    const errorMessage = isErrorLike(error) ? error.message : error
    core.setFailed(Log.error(errorMessage))
  }
}

void save()
