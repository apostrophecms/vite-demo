export { formatTime, formatDuration } from './formatter.js';

export function greet(name) {
  return `Hello, ${name}!`;
}

export function calculateStats(count) {
  return {
    count,
    doubled: count * 2,
    squared: count ** 2,
    isEven: count % 2 === 0
  };
}
