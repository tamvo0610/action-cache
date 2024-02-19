import { exec as execCP } from 'child_process'

class Exec {
  constructor() {}

  public run = async (str: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      execCP(str, (error, stdout) => {
        if (error) {
          return reject(error.message)
        }
        resolve(stdout.trim())
      })
    })
  }

  public mkdir = async (path: string): Promise<string> => {
    return await this.run(`mkdir -p ${path}`)
  }

  public rsync = async (source: string, dest: string): Promise<string> => {
    return await this.run(`rsync -a ${source}/ ${dest}`)
  }

  public exists = async (path: string): Promise<boolean> => {
    const res = await this.run(
      `if [ -d "${path}" ]; then 
            echo "1"; 
        else 
            echo "0"; 
        fi`
    )
    return res === '1'
  }
}

export const _exec = new Exec()
