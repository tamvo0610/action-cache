// import { setFailed } from '@actions/core'
// import { exists } from '@actions/io/lib/io-util.js'
// import { execSync } from 'child_process'

// import { getVars } from './lib/getVars.js'
// import { isErrorLike } from './lib/isErrorLike.js'

// async function save() {
//   try {
//     const { cacheDir, targetPath, cachePath } = getVars()
//     if (await exists(cachePath)) return
//     execSync(`mkdir -p "${cacheDir}"`)
//     execSync(`rsync -a "${targetPath}" "${cacheDir}"`, {
//       stdio: 'inherit',
//       shell: true
//     })
//   } catch (error) {
//     setFailed(isErrorLike(error) ? error.message : `unknown error: ${error}`)
//     console.log(error)
//   }
// }

// void save()