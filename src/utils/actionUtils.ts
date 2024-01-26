import * as core from '@actions/core'
import path from 'path'
import { Log } from './logUtils'

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

export const getVars = () => {
  const options = {
    path: core.getInput('path'),
    action: core.getInput('action'),
    cacheKey: core.getInput('cache-key') || 'no-key',
    cacheDir: core.getInput('cache-dir'),
    workingDir: core.getInput('working-directory') || process.cwd()
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

  const cacheDir = path.join(options.cacheDir)
  Log.info(`Cache Dir: ${cacheDir}`)
  const cachePath = path.join(cacheDir, options.cacheKey)
  Log.info(`Cache Path: ${cachePath}`)
  const targetDir = path.join(options.workingDir, options.path)
  Log.info(`Target Dir: ${targetDir}`)

  return {
    cachePath,
    cacheDir,
    options,
    targetDir
  }
}
