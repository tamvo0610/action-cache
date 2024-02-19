import * as core from '@actions/core'
import {
  checkDirExist,
  getVars,
  isErrorLike,
  runExec
} from './utils/actionUtils'
import * as io from '@actions/io/'
import { Log } from './utils/logUtils'
import { State } from './constants'

async function restore() {
  try {
    const cachePath = core.getState(State.CachePath)
    const targetPath = core.getState(State.TargetPath)
    const options = {
      workingDir: core.getState(State.WorkingDir),
      action: core.getState(State.Action)
    }
    const isCacheExist = await checkDirExist(cachePath)
    console.log('isCacheExist', isCacheExist)
    if (isCacheExist) {
      Log.info('Cache exist, restore cache')
      // await io.mkdirP(targetPath)
      await runExec(`mkdir -p ${targetPath}`)
      Log.info('Create target folder')
      await runExec(`rsync -a ${cachePath}/ ${targetPath}`)
      // await io.cp(cachePath, targetPath, { recursive: true })
      Log.info('Cache restore success')
      return core.setOutput('cache-hit', true)
    }
    Log.info('Cache not exist, skip restore')
    if (!!options?.action) {
      await runExec(`cd ${options.workingDir} && ${options.action}`)
    }
    core.setOutput('cache-hit', false)
  } catch (error: any) {
    const errorMessage = isErrorLike(error) ? error.message : error
    core.setFailed(Log.error(errorMessage))
  }
}

void restore()
