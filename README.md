# Local Cache Self-Hosted

## Cache dependencies and build outputs to improve workflow execution time on self hosted machine.

## Usage

```yml
build:
  name: Build
  runs-on: [self-hosted]
  steps:
    - name: Check out Git repository
      uses: actions/checkout@v3

    - name: Cache Pods
      uses: tamvo0610/action-cache@v1
      with:
        path: 'ios/Podfile.lock'
        cache-key : pods-${{ hashFiles('ios/Podfile.lock') }}
        cache-dir: $HOME/actions-runner/_workdir/cache
```

## Inputs Variable

Set input variable in secrets of your repository as below:
| Input variable | Description | Example |
|--------------------------|-----------------------------------------------------|-----------------------|
| path | File or folder to be cached | ios/Podfile.lock |
| cache-key | Explicit key for versioning the cache | pods-${{ hashFiles('ios/Podfile.lock') }} |
| cache-dir | Path dir will cache | actions_runnder/_workdir/cache |
