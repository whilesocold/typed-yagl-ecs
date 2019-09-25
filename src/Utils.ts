export function fastBind(thisArg: any, methodFunc: Function): Function {
  return function() {
    methodFunc.apply(thisArg, arguments)
  }
}

export function fastSplice(array: any, startIndex: number, removeCount: number): void {
  let len = array.length
  let removeLen = 0

  if (startIndex >= len || removeCount === 0) {
    return
  }

  removeCount = startIndex + removeCount > len ? (len - startIndex) : removeCount
  removeLen = len - removeCount

  for (let i = startIndex; i < len; i += 1) {
    array[i] = array[i + removeCount]
  }

  array.length = removeLen
}