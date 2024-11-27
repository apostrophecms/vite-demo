import { parse } from './player.js';
import './tailwind.css';

export default () => {
  // Demonstrating how to pass helper functions to be used by other modules
  // apart from a direct import via aliasing.
  apos.util.parsePlayerData = parse;
};
