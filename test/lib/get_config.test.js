const assert = require('assert');
const lib = require('./../../src/lib');

describe('Lib', () => {
    describe('get_config', () => {
        it('missing key', () => {
            lib.set_config(null, {
                key: 'value',
            });
            assert.deepStrictEqual(lib.get_config(), { key: 'value' });
        });
        it('null key', () => {
            lib.set_config(null, {
                key: 'value',
            });
            assert.deepStrictEqual(lib.get_config(null), { key: 'value' });
        });
        it('existing key', () => {
            lib.set_config(null, {
                key: 'value',
            });
            assert.strictEqual(lib.get_config('key'), 'value');
        });
        it('nonexisting key', () => {
            lib.set_config(null, {
                key: 'value',
            });
            assert.strictEqual(lib.get_config('key1'), null);
        });
    });
});
