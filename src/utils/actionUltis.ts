import * as core from '@actions/core'
import { execSync } from 'child_process'
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

export const getVars = async () => {
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
  console.log(getMessage('INFO', `Path: ${options.path}`))
  if (!options.cacheKey) {
    core.setFailed(
      getMessage('ERROR', 'cache-key is required but was not provided.')
    )
  }
  console.log(getMessage('INFO', `Cache Key: ${options.cacheKey}`))
  if (!options.cacheDir) {
    core.setFailed(
      getMessage('ERROR', 'cache-dir is required but was not provided.')
    )
  }
  console.log(getMessage('INFO', `Cache Dir: ${options.cacheDir}`))

  const execCacheDir = execSync(`echo ${options.cacheDir}`, {
    encoding: 'utf-8'
  })
  const cachePath = path.join(execCacheDir, options.cacheKey)
  const targetPath = path.resolve(options.workingDir, options.path)
  const targetDir = path.parse(targetPath).dir

  return {
    cachePath,
    options,
    targetDir,
    targetPath
  }
}
