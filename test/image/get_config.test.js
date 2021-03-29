const assert = require('assert');
const default_config = require('../../src/default_config');
const Image = require('../../src/image');
const lib = require('../../src/lib');

describe('Image', () => {
    describe('get_config', () => {
        it('missing key', () => {
            const image = Image({}, {});
            assert.deepStrictEqual(image.get_config(), default_config);
        });
        it('null key', () => {
            const image = Image(null, {
                key: 'value',
            });

            assert.deepStrictEqual(image.get_config(null), lib.merge_config(default_config, { key: 'value' }));
        });
        it('existing key', () => {
            const image = Image(null, {
                key: 'value',
            });

            assert.strictEqual(image.get_config('key'), 'value');
        });
        it('nonexisting key', () => {
            const image = Image(null, {
                key: 'value',
            });
            assert.strictEqual(image.get_config('key1'), null);
        });
    });
});
