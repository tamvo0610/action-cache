import * as core from '@actions/core'
import * as io from '@actions/io'
import { exists } from '@actions/io/lib/io-util'
import { getVars, isErrorLike } from './utils/actionUtils'
import * as fs from 'fs'
import { Log } from './utils/logUtils'
import path from 'path'
import { execSync, exec } from 'child_process'

async function save() {
  try {
    const { cacheDir, cachePath, targetPath } = getVars()
    const isCacheExist = await exists(cachePath)
    if (isCacheExist) return
    await io.mkdirP(cacheDir)
    await io.rmRF(cachePath)
    await io.cp(targetPath, cachePath, {
      copySourceDirectory: true,
      recursive: true
    })
    // execSync(`mkdir -p ${cachePath}`)
    // Log.info(`Create Cache Folder ${cachePath}`)
    // execSync(`rsync -a ${targetPath}/ ${cachePath}`)
    // Log.info(`Sync Cache Folder ${targetPath} to ${cachePath}`)
  } catch (error: any) {
    const errorMessage = isErrorLike(error) ? error.message : error
    core.setFailed(Log.error(errorMessage))
  }
}

void save()
