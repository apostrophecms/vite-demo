import { parse } from './player.js';

export default () => {
  // Demonstrating how one can pass helper functions to be used by other modules
  // apart from a direct import via aliasing.
  apos.util.parsePlayerData = parse;
};
