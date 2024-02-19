import * as core from '@actions/core'
import * as ultils from './utils/actionUtils'
import * as io from '@actions/io/'
import { exists } from '@actions/io/lib/io-util.js'
import { Log } from './utils/logUtils'
import { Outputs, State } from './constants'

async function restoreImpl() {
  try {
    const {
      cachePath,
      targetPath,
      options,
      isCacheExist: test
    } = await ultils.getVars()
    const isCacheExist = await ultils.checkDirExist(cachePath)
    console.log('isCacheExist', isCacheExist)
    // const test = exists(cachePath)
    console.log('isCacheExist Test', test)
    if (isCacheExist) {
      Log.info('Cache exist, restore cache')
      // await io.mkdirP(targetPath)
      await ultils.runExec(`mkdir -p ${targetPath}`)
      Log.info('Create target folder')
      await ultils.runExec(`rsync -a ${cachePath}/ ${targetPath}`)
      // await io.cp(cachePath, targetPath, { recursive: true })
      Log.info('Cache restore success')
      return core.setOutput(Outputs.CacheHit, true)
    }
    Log.info('Cache not exist, skip restore')
    if (!!options?.action) {
      await ultils.runExec(`cd ${options.workingDir} && ${options.action}`)
    }
    core.setOutput(Outputs.CacheHit, false)
  } catch (error: any) {
    const errorMessage = ultils.isErrorLike(error) ? error.message : error
    core.setFailed(Log.error(errorMessage))
  }
}

export async function restoreRun() {
  restoreImpl()
}
