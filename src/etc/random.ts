export const random = (v1: number, v2?: number): number => {
  if (v2) {
    return v1 + Math.floor(Math.random() * v2 - v1)
  }

  return Math.floor(Math.random() * v1)
}
