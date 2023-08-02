export function randomArray(length, max) {
  return Array.apply(null, Array(length)).map(function () {
    return Math.random() * max;
  });
}