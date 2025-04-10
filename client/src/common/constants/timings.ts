// the cache time is represented in seconds
const minute = 60;
const hour = minute * 60;

// the default time for RTK is 60s (https://redux-toolkit.js.org/rtk-query/usage/cache-behavior#default-cache-behavior)
export const cacheTimings = Object.freeze({
  noCache: 0,
  fast: 30,
  moderate: minute * 5,
  slow: minute * 10,
  moderateSlow: minute * 30,
  extraSlow: hour * 2,
  superSlow: hour * 4,
});

// polling time is expressed in ms (https://redux-toolkit.js.org/rtk-query/usage/polling)
const ms = 1000;
export const pollingTimings = Object.freeze({
  superFast: ms * 30,
  veryFast: ms * 60,
  fast: ms * 60 * 5,
  moderate: ms * 60 * 10,
  slow: ms * 60 * 20,
});

export const timeout = Object.freeze({
  default: ms * 6,
});
