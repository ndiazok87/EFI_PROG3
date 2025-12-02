import authorize from './authorize.js';
export default function checkRole(...roles) {
  return authorize(...roles);
}
