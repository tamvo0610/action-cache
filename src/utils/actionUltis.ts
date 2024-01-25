import * as core from '@actions/core'
import path from 'path'

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

export const getMessage = (type: 'INFO' | 'ERROR', message: string) => {
  return `===== ${type}: ${message}`
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
    core.setFailed(
      getMessage('ERROR', 'path is required but was not provided.')
    )
  }

  if (!options.cacheKey) {
    core.setFailed(
      getMessage('ERROR', 'cache-key is required but was not provided.')
    )
  }

  if (!options.cacheDir) {
    core.setFailed(
      getMessage('ERROR', 'cache-dir is required but was not provided.')
    )
  }

  const cacheDir = path.join(options.cacheDir)
  console.log(getMessage('INFO', `Cache Dir: ${cacheDir}`))
  const cachePath = path.join(cacheDir, options.cacheKey)
  console.log(getMessage('INFO', `Cache Path: ${cachePath}`))
  const targetDir = path.join(options.workingDir, options.path)
  console.log(getMessage('INFO', `Target Dir: ${targetDir}`))

  return {
    cachePath,
    cacheDir,
    options,
    targetDir
  }
}
