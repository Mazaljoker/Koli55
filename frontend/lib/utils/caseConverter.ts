export function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  } else if (obj !== null && typeof obj === "object") {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const snakeKey = key.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
      acc[snakeKey] = toSnakeCase(value);
      return acc;
    }, {} as Record<string, any>);
  }
  return obj;
}

export function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj !== null && typeof obj === "object") {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const camelKey = key.replace(/_([a-z0-9])/g, (_match, letter) =>
        letter.toUpperCase()
      );
      acc[camelKey] = toCamelCase(value);
      return acc;
    }, {} as Record<string, any>);
  }
  return obj;
}
