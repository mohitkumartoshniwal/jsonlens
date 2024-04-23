/* eslint-disable @typescript-eslint/no-explicit-any */

export const isArray = <T extends any[]>(v: unknown): v is T => {
  return Array.isArray(v);
};

export const isObject = (v: unknown): v is object => {
  return v !== null && !isArray(v) && typeof v === "object";
};

export const isString = (v: unknown): v is string => {
  return typeof v === "string";
};

export const isNumber = (v: unknown): v is number => {
  return typeof v === "number";
};

export const isBoolean = (v: unknown): v is boolean => {
  return typeof v === "boolean";
};

export const isNull = (v: unknown): v is null => {
  return v === null;
};

export const isEmptyObject = (obj: object): boolean =>
  Object.keys(obj).length < 1;

export const isEmptyArray = <T extends any[]>(array: T): boolean =>
  array.length < 1;

export const debounce = <F extends (...args: any[]) => void>(
  func: F,
  delay: number
): ((...args: Parameters<F>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<F>): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
