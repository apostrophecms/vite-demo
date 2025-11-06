# @vite-demo/utils

Shared utilities package for the vite-demo workspace.

## Features

- Utility functions for calculations and greetings
- Time formatting using `pretty-ms` (transient dependency example)

## Usage

```javascript
import { greet, calculateStats, formatTime } from '@vite-demo/utils';

console.log(greet('World'));
console.log(calculateStats(5));
console.log(formatTime(Date.now() - 5000));
```

## Dependencies

This package uses `pretty-ms` as a dependency, which is NOT available in:
- apostrophe core
- @apostrophecms/vite module
- any other modules in the project

This demonstrates the pnpm resolve plugin's ability to handle transient dependencies in workspace packages.
