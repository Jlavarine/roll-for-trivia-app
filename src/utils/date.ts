export function getDateKey() {
    return new Date().toISOString().split('T')[0]
}