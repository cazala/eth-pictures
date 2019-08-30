import { future, IFuture } from 'fp-future'

const THROTTLE = 1000

type Task = {
  args: any[]
  fn: (...args: any[]) => Promise<any>
  promise: IFuture<any>
}

let paused = true

const queue: Task[] = []

function exec(task: Task) {
  queue.push(task)
  if (paused) {
    tick()
  }
}

async function tick() {
  const task = queue.pop()
  if (task) {
    paused = false
    try {
      const result = await task.fn(...task.args)
      task.promise.resolve(result)
    } catch (e) {
      task.promise.reject(e.message)
    }
  }
  if (queue.length > 0) {
    setTimeout(tick, THROTTLE)
  } else {
    paused = true
  }
}

export const throttle = <T>(fn: (...args: any[]) => Promise<T>) => {
  return async (...args: any[]) => {
    const promise = future<T>()
    exec({
      args,
      fn,
      promise
    })
    return promise
  }
}
