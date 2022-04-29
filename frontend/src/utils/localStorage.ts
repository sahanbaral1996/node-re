/**
 * Generic function to read value from localStorage.
 *
 * @param {String} key
 */
export function readValue<T>(key: string): T | null {
  try {
    const item = window.localStorage.getItem(key);

    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.warn(`Error reading localStorage by "${key}":`, error);

    return null;
  }
}

/**
 * Generic function to set value to localStorage.
 *
 * @param {String} key
 * @param {Any} value
 */
export function setValue<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error setting localStorage key “${key}”:`, error);
  }
}

/**
 * Generic function to clear value from localStorage.
 *
 * @param {String} key
 */
export function clearValue(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Error clearing localStorage key “${key}”:`, error);
  }
}
