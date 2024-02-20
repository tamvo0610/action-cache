import * as core from '@actions/core'
import path from 'path'
import { Inputs } from 'src/constants/enum'
import { Log } from './log.ultis'

const has = <T extends Object>(obj: T, prop?: any) =>
  Object.prototype.hasOwnProperty.call(obj, prop)

export const isErrorLike = (err: any) => {
  if (err instanceof Error) {
    return true
  }

  if (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    has(err, 'message') &&
    typeof err.message === 'string'
  ) {
    return true
  }

  return false
}

export const getInputs = () => {
  const options = {
    path: core.getInput(Inputs.Path),
    action: core.getInput(Inputs.Action),
    cacheKey: core.getInput(Inputs.CacheKey) || 'no-key',
    cacheDir: core.getInput(Inputs.CacheDir),
    workingDir: core.getInput(Inputs.WorkingDir) || process.cwd()
  }

  if (!options.path) {
    core.setFailed(Log.error('path is required but was not provided.'))
  }

  if (!options.cacheKey) {
    core.setFailed(Log.error('cache-key is required but was not provided.'))
  }

  if (!options.cacheDir) {
    core.setFailed(Log.error('cache-dir is required but was not provided.'))
  }

  const cachePath = path.join(options.cacheDir, options.cacheKey)
  Log.info(`Cache Path: ${cachePath}`)
  const { dir: cacheDir } = path.parse(cachePath)
  Log.info(`Cache Dir: ${cacheDir}`)
  const targetPath = path.join(options.workingDir, options.path)
  Log.info(`Target Path: ${targetPath}`)
  const { dir: targetDir } = path.parse(targetPath)
  Log.info(`Target Dir: ${targetDir}`)

  return {
    cachePath,
    cacheDir,
    targetPath,
    targetDir,
    workingDir: options.workingDir,
    targetAction: options.action
  }
}

export const setOutput = (name: string, value: any) => {
  return core.setOutput(name, value)
}

export const setFailed = (message: string) => {
  core.setFailed(Log.error(message))
}
