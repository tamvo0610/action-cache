import * as core from '@actions/core'
import {
  checkDirExist,
  getVars,
  isErrorLike,
  runExec
} from './utils/actionUtils'
import { mkdirP, mv, cp } from '@actions/io/'
import { Log } from './utils/logUtils'

export async function save() {
  try {
    const { cachePath, targetPath } = getVars()
    const isCacheExist = await checkDirExist(cachePath)
    if (isCacheExist) return Log.info('Cache exist, skip save')
    Log.info('Cache not exist, save cache')
    await mkdirP(cachePath)
    await runExec(`mkdir -p ${cachePath}`)
    Log.info('Create cache folder')
    await runExec(`rsync -a ${targetPath}/ ${cachePath}`)
    Log.info('Cache save success')
  } catch (error: any) {
    const errorMessage = isErrorLike(error) ? error.message : error
    core.setFailed(Log.error(errorMessage))
  }
}

void save()
