const assert = require('assert');
const lib = require('./../../src/lib');

describe('Lib', () => {
    describe('get_system', () => {
        it('missing system config', () => {
            lib.set_config(null, {});
            assert.deepStrictEqual(lib.get_system('local'), null);
        });
        it('null system config', () => {
            lib.set_config(null, {
                systems: null,
            });
            assert.deepStrictEqual(lib.get_system(null), null);
            assert.deepStrictEqual(lib.get_system(undefined), null);
            assert.deepStrictEqual(lib.get_system(' '), null);
            assert.deepStrictEqual(lib.get_system(1), null);
            assert.deepStrictEqual(lib.get_system(true), null);
            assert.deepStrictEqual(lib.get_system(new Date()), null);
            assert.deepStrictEqual(lib.get_system(['a']), null);
            assert.deepStrictEqual(lib.get_system('local'), null);
        });
        it('invalid config', () => {
            lib.set_config(null, {
                systems: {
                    local: 1,
                },
            });
            assert.deepStrictEqual(lib.get_system('local'), null);
        });
        it('wrong types', () => {
            lib.set_config(null, {
                systems: {
                    local: './local/',
                },
            });
            assert.deepStrictEqual(lib.get_system(null), null);
            assert.deepStrictEqual(lib.get_system(undefined), null);
            assert.deepStrictEqual(lib.get_system(' '), null);
            assert.deepStrictEqual(lib.get_system(1), null);
            assert.deepStrictEqual(lib.get_system(true), null);
            assert.deepStrictEqual(lib.get_system(new Date()), null);
            assert.deepStrictEqual(lib.get_system(['a']), null);
        });
        it('valid types', () => {
            lib.set_config(null, {
                systems: {
                    local: './local/',
                },
            });
            assert.deepStrictEqual(lib.get_system('local'), './local');
            assert.deepStrictEqual(lib.get_system('test'), null);
        });
    });
});
