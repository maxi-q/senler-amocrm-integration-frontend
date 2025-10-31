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

// Функция для глубокого сравнения объектов
export const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true
  if (obj1 == null || obj2 == null) return obj1 === obj2
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false
  
  // Обработка массивов
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) return false
    }
    return true
  }
  
  // Если один массив, а другой нет
  if (Array.isArray(obj1) || Array.isArray(obj2)) return false
  
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  
  if (keys1.length !== keys2.length) return false
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false
    if (!deepEqual(obj1[key], obj2[key])) return false
  }
  
  return true
}