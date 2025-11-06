import prettyMs from 'pretty-ms';

/**
 * Format a timestamp to a readable time string
 * This uses the pretty-ms package which is a transient dependency
 * not available elsewhere in the project
 */
export function formatTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  return prettyMs(diff, { compact: true });
}

/**
 * Format a duration in milliseconds to a human-readable string
 */
export function formatDuration(ms) {
  return prettyMs(ms, { verbose: true });
}
