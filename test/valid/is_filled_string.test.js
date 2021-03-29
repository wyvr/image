const assert = require('assert');
const valid = require('./../../src/valid');

describe('Valid', () => {
    describe('is_filled_string', () => {
        it('missing key', () => {
            assert.deepStrictEqual(valid.is_filled_string(), false);
        });
        it('null key', () => {
            assert.deepStrictEqual(valid.is_filled_string(null), false);
        });
        it('wrong types', () => {
            assert.strictEqual(valid.is_filled_string(1), false);
            assert.strictEqual(valid.is_filled_string({ a: 'a' }), false);
            assert.strictEqual(valid.is_filled_string([1, 2]), false);
            assert.strictEqual(valid.is_filled_string(true), false);
            assert.strictEqual(valid.is_filled_string(new Date()), false);
        });
        it('empty string', () => {
            assert.strictEqual(valid.is_filled_string(''), false);
            assert.strictEqual(valid.is_filled_string('  '), false);
            assert.strictEqual(valid.is_filled_string('\t\n'), false);
        });
        it('filled string', () => {
            assert.strictEqual(valid.is_filled_string('a'), true);
            assert.strictEqual(valid.is_filled_string(' a'), true);
        });
    });
});
