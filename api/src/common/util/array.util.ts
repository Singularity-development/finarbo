/**
 * Converts array to record. Keys must be unique
 *  */
export function toRecord<T, K extends keyof any>(array: T[], key: (i: T) => K) {
  return array.reduce(
    (result, currentValue) => {
      if (result[key(currentValue)]) {
        throw Error(`Keys are not unique: ${String(key(currentValue))}`);
      }
      result[key(currentValue)] = currentValue;
      return result;
    },
    {} as Record<K, T>,
  );
}
