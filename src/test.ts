import * as io_util from '@actions/io/lib/io-util.js'
import { execSync } from 'child_process'
import path from 'path'
import * as cache from '@actions/cache'

const test = async () => {
  const options = {
    path: 'ios/Pods',
    key: 'node-modules-056dc512a4de9e5976f0b76ae21024aae4801d1bd54a4fd9ff7ce8233325b237',
    cacheDir: '$HOME/actions-runner/_workdir/cache/liberty-exchange/customer'
  }
  const execCacheDir = execSync(`echo ${options.cacheDir}`, {
    encoding: 'utf-8'
  })
  console.log('execCacheDir', execCacheDir)
  const cacheDir = path.join(execCacheDir, options.key)
  console.log('cacheDir', path.parse(cacheDir).dir)
  const cachePath = path.join(cacheDir)
  console.log('cachePath', cachePath)
  const isCacheExist = await io_util.exists(cachePath)
  console.log('isCacheExist', isCacheExist)
}

test()
