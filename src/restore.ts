import * as core from '@actions/core'
import * as io_util from '@actions/io/lib/io-util.js'
import { execSync } from 'child_process'

import { getVars, isErrorLike, getMessage } from './utils/actionUltis'

async function restore() {
  try {
    const { cachePath, cacheDir, targetDir, targetPath, options } =
      await getVars()
    const isCacheExist = await io_util.exists(cachePath)
    // if (isCacheExist) {
    //   console.log(`===== INFO: Cache Exist in ${options.path}`)
    //   execSync(`mkdir -p "${targetDir}"`)
    //   execSync(`rsync -a "${cachePath}" "${targetDir}"`, {
    //     stdio: 'inherit',
    //     shell: 'true'
    //   })
    //   setOutput('cache-hit', true)
    // } else {
    //   setOutput('cache-hit', false)
    //   if (!!options?.action) {
    //     execSync(
    //       `cd ${options.workingDir} && export LANG=en_US.UTF-8 && ${options.action}`,
    //       { stdio: 'inherit', shell: 'true' }
    //     )
    //     console.log(`===== INFO: Missing action`)
    //   }
    //   console.log(`===== INFO: Cache not found in ${options.path}.`)
    // }
  } catch (error: any) {
    const errorMessage = isErrorLike(error) ? error.message : error
    core.setFailed(getMessage('ERROR', errorMessage))
  }
}

void restore()
