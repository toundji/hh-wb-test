export function camelToSnake(obj: Record<string, any>): Record<string, any> {
    return Object.fromEntries(Object.entries(obj)
    .map(([key, value]) => [key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`), value]));
}