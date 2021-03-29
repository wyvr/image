const assert = require('assert');
const lib = require('./../../src/lib');

describe('Lib', () => {
    describe('normalize_extension', () => {
        it('empty extension', () => {
            assert.strictEqual(lib.normalize_extension(''), '');
        });
        it('null extension', () => {
            assert.strictEqual(lib.normalize_extension(null), '');
            assert.strictEqual(lib.normalize_extension(undefined), '');
        });
        it('multipl spaces extension', () => {
            assert.strictEqual(lib.normalize_extension('    '), '');
        });
        it('wrong types extension', () => {
            assert.strictEqual(lib.normalize_extension(1), '');
            assert.strictEqual(lib.normalize_extension(true), '');
            assert.strictEqual(lib.normalize_extension(false), '');
            assert.strictEqual(lib.normalize_extension([]), '');
            assert.strictEqual(lib.normalize_extension(['a', 'b']), '');
            assert.strictEqual(lib.normalize_extension({ a: 'b' }), '');
            assert.strictEqual(lib.normalize_extension([{ a: 'b' }, { c: 'd' }]), '');
            assert.strictEqual(lib.normalize_extension(new Date()), '');
            assert.strictEqual(
                lib.normalize_extension((a) => {
                    return a + '';
                }),
                ''
            );
        });
        it('multipl spaces extension', () => {
            assert.strictEqual(lib.normalize_extension('    '), '');
        });
        it('Uppercase extension', () => {
            assert.strictEqual(lib.normalize_extension('Jpeg'), 'jpeg');
            assert.strictEqual(lib.normalize_extension('JPEG'), 'jpeg');
            assert.strictEqual(lib.normalize_extension('PNG'), 'png');
            assert.strictEqual(lib.normalize_extension('WebP'), 'webp');
            assert.strictEqual(lib.normalize_extension('WEBP'), 'webp');
        });
        it('extension starting with "."', () => {
            assert.strictEqual(lib.normalize_extension('.jpeg'), 'jpeg');
            assert.strictEqual(lib.normalize_extension('.png'), 'png');
            assert.strictEqual(lib.normalize_extension('.gif'), 'gif');
            assert.strictEqual(lib.normalize_extension('.webp'), 'webp');
        });
    });
});
