const assert = require('assert');
const lib = require('./../../src/lib');

describe('Lib', () => {
    describe('get_target_extension', () => {
        it('no config', () => {
            assert.deepStrictEqual(lib.get_target_extension(null), null);
        });
        it('empty config', () => {
            assert.deepStrictEqual(lib.get_target_extension({}), null);
        });
        it('wrong type config', () => {
            assert.deepStrictEqual(lib.get_target_extension([1, 2, 3]), null);
            assert.deepStrictEqual(lib.get_target_extension('a'), null);
        });
        it('convert to type', () => {
            assert.deepStrictEqual(
                lib.get_target_extension({
                    params: { t: 'gif' },
                }),
                'gif'
            );
        });
        it('convert to webp', () => {
            assert.deepStrictEqual(
                lib.get_target_extension({
                    accept: { webp: true },
                }),
                'webp'
            );
        });
        it('convert not to webp', () => {
            assert.deepStrictEqual(
                lib.get_target_extension({
                    params: { t: 'gif' },
                    accept: { webp: false },
                }),
                'gif'
            );
        });
        it('force webp', () => {
            assert.deepStrictEqual(
                lib.get_target_extension({
                    params: { t: 'gif' },
                    accept: { webp: true },
                }),
                'webp'
            );
        });
    });
});
