import * as core from '@actions/core'
import { exec, execSync as execSyncCP } from 'child_process'
import path from 'path'
import { Log } from './logUtils'
import { Inputs, State } from 'src/constants'

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

export const runExec = async (str: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(str, (error, stdout) => {
      if (error) {
        return reject(error.message)
      }
      resolve(stdout)
    })
  })
}

export const checkDirExist = async (path: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    exec(
      `if [ -d "${path}" ]; then 
          echo "1"; 
        else 
          echo "0"; 
        fi`,
      (error, stdout, stderr) => {
        if (error) {
          return reject(error.message)
        }
        if (stdout.trim() === '1') {
          return resolve(true)
        }
        resolve(false)
      }
    )
  })
}

export const getVars = () => {
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
  core.saveState(State.CachePath, cachePath)
  Log.info(`Cache Path: ${cachePath}`)
  const { dir: cacheDir } = path.parse(cachePath)
  core.saveState(State.CacheDir, cacheDir)
  Log.info(`Cache Dir: ${cacheDir}`)
  const targetPath = path.join(options.workingDir, options.path)
  core.saveState(State.TargetPath, targetPath)
  Log.info(`Target Path: ${targetPath}`)
  const { dir: targetDir } = path.parse(targetPath)
  core.saveState(State.TargetDir, targetDir)
  Log.info(`Target Dir: ${targetDir}`)

  return {
    options,
    cachePath,
    cacheDir,
    targetPath,
    targetDir
  }
}

export const execSync = (str: string) => {
  return execSyncCP(str, {
    shell: 'true',
    // stdio: 'inherit',
    encoding: 'utf-8'
  })
}
