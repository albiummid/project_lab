export const DebounceHandler = (fn = () => {}, delay = 500) => {
  let timerInstance
  return (...rest) => {
    clearTimeout(timerInstance)
    timerInstance = setTimeout(() => {
      fn(...rest)
    }, delay)
  }
}

export const isEmpty = (data) => {
  let value = false
  if (data === null || data === false || data === undefined || data === 0) {
    value = true
  } else if (typeof data === 'object') {
    if (Array.isArray(data)) {
      value = data?.length === 0
    } else {
      value = Object?.keys(data).length === 0
    }
  } else if (typeof data === 'string') {
    value = data.length === 0
  }
  return value
}

export class Utils {
  constructor(data) {
    this.data = data
  }
  isEmpty() {
    let d = this.data
    let value = false
    if (d === null || d === false || d === undefined || d === 0) {
      value = true
    } else if (typeof d === 'object') {
      if (Array.isArray(d)) {
        value = d?.length === 0
      } else {
        console.log(JSON.stringify(d))
        value = Object?.keys(d).length === 0
      }
    } else if (typeof d === 'string') {
      value = d.length === 0
    }
    return value
  }
}

export const JSONComparer = (value1, value2) => {
  console.log(value1, value2)
  return JSON.stringify(value1) === JSON.stringify(value2)
}

export const fieldsComparer = (firstObj = {}, secondObj = {}) => {
  let obj1 = JSON.parse(JSON.stringify(firstObj))
  let obj2 = JSON.parse(JSON.stringify(secondObj))

  let result = {}
  let allKeys = Object.keys({ ...obj1, ...obj2 }).map((key) => key)
  console.log(allKeys, 'keys')
  allKeys.forEach((key) => {
    if (obj1[key] === undefined || obj2[key] === undefined) {
      result[key] = null
    } else if (JSONComparer(obj1[key], obj2[key])) {
      result[key] = false
    } else {
      result[key] = true
    }
  })

  return result
}
