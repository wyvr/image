const assert = require('assert');

describe('Lib', () => {
    describe('set_config', () => {
        it('set whole config', () => {
            const lib = require('./../../src/lib');
            assert.strictEqual(
                lib.set_config(null, {
                    key: 'null',
                }),
                true
            );
            assert.deepStrictEqual(lib.get_config(), { key: 'null' });
        });
        it('avoid null config', () => {
            const lib = require('./../../src/lib');
            assert.strictEqual(lib.set_config(null, null), false);
            assert.deepStrictEqual(lib.get_config(), { key: 'null' });
        });
        it('clear config', () => {
            const lib = require('./../../src/lib');
            assert.strictEqual(lib.set_config(null, {}), true);
            assert.deepStrictEqual(lib.get_config(), {});
        });
        it('set whole config with undefined', () => {
            const lib = require('./../../src/lib');
            assert.strictEqual(
                lib.set_config(undefined, {
                    key: 'undefined',
                }),
                true
            );
            assert.deepStrictEqual(lib.get_config(), { key: 'undefined' });
        });
        it('create key', () => {
            const lib = require('./../../src/lib');
            lib.set_config(null, {});
            assert.strictEqual(lib.set_config('new', 'newVal'), true);
            assert.deepStrictEqual(lib.get_config(), { new: 'newVal' });
        });
        it('update key', () => {
            const lib = require('./../../src/lib');
            lib.set_config(null, {
                key: 'value'
            });
            assert.strictEqual(lib.set_config('key', 'newVal'), true);
            assert.deepStrictEqual(lib.get_config(), { key: 'newVal' });
        });
    });
});
