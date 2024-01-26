import * as core from '@actions/core'
import { mkdirP, mv, cp, rmRF } from '@actions/io'
import { exists } from '@actions/io/lib/io-util'
import { getVars, isErrorLike } from './utils/actionUtils'
import * as fs from 'fs'
import { Log } from './utils/logUtils'
import path from 'path'
import { execSync } from 'child_process'

async function save() {
  try {
    const { cachePath, targetPath } = getVars()
    const isCacheExist = await exists(cachePath)
    if (isCacheExist) return
    execSync(`mkdir -p "${cachePath}"`)
    Log.info(`Create Cache Folder ${cachePath}`)
    await cp(targetPath, cachePath, {
      copySourceDirectory: true,
      recursive: true
    })

    Log.info(`Sync Cache Folder ${targetPath} to ${cachePath}`)
  } catch (error: any) {
    const errorMessage = isErrorLike(error) ? error.message : error
    core.setFailed(Log.error(errorMessage))
  }
}

void save()
