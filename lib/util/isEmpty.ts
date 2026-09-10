// export const isObject = (input: any): boolean => input instanceof Object && !Array.isArray(input);
function isObject(value: any) {
    const type = typeof value;
    return value != null && (type == 'object' || type == 'function');
}
export const isArray = Array.isArray;
// export const isArray = (input: any): boolean => Array.isArray(input)
export const isEmpty = (input: any): boolean => {
    if (input == null) return true;
    if (isObject(input)) return Object.keys(input as object).length === 0;
    if (isArray(input)) return (input as unknown[]).length === 0;
    if (typeof input === "string") return input.trim().length === 0;
    return false;
}
