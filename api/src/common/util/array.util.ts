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

/**
 * Groups array items into a Record where each key maps to an array of values.
 */
export function groupByKey<T, K extends keyof any>(
  array: T[],
  key: (item: T) => K,
): Record<K, T[]> {
  return array.reduce(
    (result, item) => {
      const k = key(item);
      if (!result[k]) {
        result[k] = [];
      }
      result[k].push(item);
      return result;
    },
    {} as Record<K, T[]>,
  );
}
