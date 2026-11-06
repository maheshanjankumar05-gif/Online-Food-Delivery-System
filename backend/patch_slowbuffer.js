import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'node_modules', 'buffer-equal-constant-time', 'index.js');
if (fs.existsSync(file)) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('var origSlowBufEqual = SlowBuffer.prototype.equal;')) {
      content = content.replace(
        'var origSlowBufEqual = SlowBuffer.prototype.equal;',
        'var origSlowBufEqual = (typeof SlowBuffer !== "undefined" && SlowBuffer && SlowBuffer.prototype) ? SlowBuffer.prototype.equal : undefined;'
      );
      content = content.replace(
        'Buffer.prototype.equal = SlowBuffer.prototype.equal = function equal(that) {',
        'Buffer.prototype.equal = function equal(that) { return bufferEq(this, that); }; if (typeof SlowBuffer !== "undefined" && SlowBuffer && SlowBuffer.prototype) SlowBuffer.prototype.equal = function equal(that) {'
      );
      content = content.replace(
        'SlowBuffer.prototype.equal = origSlowBufEqual;',
        'if (typeof SlowBuffer !== "undefined" && SlowBuffer && SlowBuffer.prototype) SlowBuffer.prototype.equal = origSlowBufEqual;'
      );
      fs.writeFileSync(file, content);
      console.log('Successfully patched buffer-equal-constant-time for modern Node');
    }
  } catch (err) {
    console.warn('Note on patch_slowbuffer:', err.message);
  }
}

