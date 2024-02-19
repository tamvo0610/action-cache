import * as core from '@actions/core'
import * as ultils from './utils/actionUtils'
import { Log } from './utils/logUtils'

export async function save() {
  try {
    const { cachePath, targetPath } = await ultils.getInputs()
    const isCacheExist = await ultils.isCacheDirExist(cachePath)
    if (isCacheExist) return Log.info('Cache exist, skip save')
    Log.info('Cache not exist, save cache')
    await ultils.exec(`mkdir -p ${cachePath}`)
    Log.info('Create cache folder')
    await ultils.exec(`rsync -a ${targetPath}/ ${cachePath}`)
    Log.info('Cache save success')
  } catch (error: any) {
    const errorMessage = ultils.isErrorLike(error) ? error.message : error
    core.setFailed(Log.error(errorMessage))
  }
}

void save()
