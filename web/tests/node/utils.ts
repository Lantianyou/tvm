export function randomArray(length, max) {
  return Array.from({ length }, () => Math.random() * max);
}