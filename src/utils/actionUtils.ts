import * as core from '@actions/core'
import path from 'path'
import { Log } from './logUtils'
import { execSync } from 'child_process'

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

const checkCacheExist = (path: string) => {
  const dqwdqw = execSync(
    `if [ -d "${path}" ]; then echo "1"; else echo "0"; fi`,
    { encoding: 'utf8' }
  )
  console.log('dqwdqw', dqwdqw)
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

  const cachePath = path.join(options.cacheDir, options.cacheKey)
  Log.info(`Cache Path: ${cachePath}`)
  const { dir: cacheDir } = path.parse(cachePath)
  Log.info(`Cache Dir: ${cacheDir}`)
  const targetPath = path.join(options.workingDir, options.path)
  Log.info(`Target Path: ${targetPath}`)
  const { dir: targetDir } = path.parse(targetPath)
  Log.info(`Target Dir: ${targetDir}`)

  checkCacheExist(cachePath)

  return {
    options,
    cachePath,
    cacheDir,
    targetPath,
    targetDir
  }
}
