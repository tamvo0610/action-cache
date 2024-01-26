import * as core from '@actions/core'
import { exists } from '@actions/io/lib/io-util'
import { execSync } from 'child_process'
import { getVars, isErrorLike } from './utils/actionUtils'
import { Log } from './utils/logUtils'

export async function save() {
  try {
    const { cachePath, targetPath } = getVars()
    const isCacheExist = await exists(cachePath)
    if (isCacheExist) return Log.info('Cache exist, skip save')
    Log.info('Cache not exist, save cache')
    execSync(`mkdir -p ${cachePath}`)
    Log.info('Create cache folder')
    execSync(`rsync -a ${targetPath}/ ${cachePath}`)
    Log.info('Cache save success')
  } catch (error: any) {
    const errorMessage = isErrorLike(error) ? error.message : error
    core.setFailed(Log.error(errorMessage))
  }
}

void save()
