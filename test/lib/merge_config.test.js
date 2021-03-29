const assert = require('assert');
const lib = require('./../../src/lib');

describe('Lib', () => {
    describe('merge_config', () => {
        it('missing configs', () => {
            assert.deepStrictEqual(lib.merge_config(), {});
        });
        it('null configs', () => {
            assert.deepStrictEqual(lib.merge_config(null, null), {});
            assert.deepStrictEqual(lib.merge_config({}, null), {});
            assert.deepStrictEqual(lib.merge_config({ a: true }, null), { a: true });
        });
        it('wrong types', () => {
            assert.deepStrictEqual(lib.merge_config('a', 100, true, null, undefined, [1, 2, 3], new Date()), {});
        });
        it('valid types', () => {
            assert.deepStrictEqual(lib.merge_config({ a: true }, { b: true }), { a: true, b: true });
        });
        it('override props', () => {
            assert.deepStrictEqual(lib.merge_config({ a: true }, { a: false }), { a: false });
            assert.deepStrictEqual(lib.merge_config({ a: [1, 2] }, { a: [3, 4] }), { a: [3, 4] });
        });
    });
});
