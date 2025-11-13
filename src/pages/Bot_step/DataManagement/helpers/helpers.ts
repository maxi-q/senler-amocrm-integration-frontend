export const transformDataToListMessage = (senlerGroupId: string) => {
  const id = Date.now() + Math.round(Math.random() * 9999);
  const data = {
    id,
    request: {
      type: "CallApiMethod",
      method: `/vars/list?group_id=${senlerGroupId}`,
    },
    time: Date.now(),
  };

  return data
}

export const deepEqual = (obj1: any, obj2: any): boolean => {
  const aStack = new WeakMap<object, object>()

  const equal = (a: any, b: any): boolean => {
    if (Object.is(a, b)) return true
    if (a == null || b == null) return a === b
    if (typeof a !== 'object' || typeof b !== 'object') return false

    const mapped = aStack.get(a)
    if (mapped && mapped === b) return true
    aStack.set(a, b)

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false
      for (let i = 0; i < a.length; i++) {
        if (!equal(a[i], b[i])) return false
      }
      return true
    }

    if (Array.isArray(a) || Array.isArray(b)) return false

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) return false

    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false
      if (!equal(a[key], b[key])) return false
    }

    return true
  }

  return equal(obj1, obj2)
}