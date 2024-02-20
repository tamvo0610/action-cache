import * as core from '@actions/core'
import { TState } from './types/state.type'

class StateProvider {
  cacheDir = ''
  cachePath = ''
  targetDir = ''
  targetPath = ''
  workingDir = ''
  targetAction = ''
  constructor(state: TState) {
    this.cacheDir = state.cacheDir
    this.cacheDir = state.cachePath
    this.cacheDir = state.targetDir
    this.cacheDir = state.targetPath
    this.cacheDir = state.workingDir
    this.cacheDir = state.targetAction
    this
  }
}
