import * as core from '@actions/core'
import { execSync as execSyncCP } from 'child_process'
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

const checkCacheExist = (path: string) => {
  const result = execSync(
    `if [ -d "${path}" ]; then 
        echo "1"; 
      else 
        echo "0"; 
      fi`
  )
  return !!Number(result)
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
  const isCacheExist = checkCacheExist(cachePath)
  Log.info(`Exist: ${isCacheExist}`)

  return {
    options,
    cachePath,
    cacheDir,
    targetPath,
    targetDir,
    isCacheExist
  }
}

export const execSync = (str: string) => {
  return execSyncCP(`mkdir -p ${str}`, {
    stdio: 'inherit',
    shell: 'true',
    encoding: 'utf8'
  })
}
