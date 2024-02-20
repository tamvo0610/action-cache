export enum Inputs {
  Path = 'path',
  Action = 'action',
  CacheKey = 'cache-key',
  CacheDir = 'cache-dir',
  WorkingDir = 'working-directory'
}

export enum State {
  CachePath = 'CACHE_PATH',
  CacheDir = 'CACHE_DIR',
  TargetPath = 'TARGET_PATH',
  TargetDir = 'TARGET_DIR',
  WorkingDir = 'WORKING_DIR',
  Action = 'ACTION',
  Options = 'OPTIONS',
  PrimaryKey = 'PRIMARY_KEY'
}

export enum Outputs {
  CacheHit = 'cache-hit', // Output from cache, restore action
  CachePrimaryKey = 'cache-primary-key', // Output from restore action
  CacheMatchedKey = 'cache-matched-key' // Output from restore action
}
