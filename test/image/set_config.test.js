const assert = require('assert');
const Image = require('../../src/image');
const lib = require('../../src/lib');

describe('Image', () => {
    describe('set_config', () => {
        it('avoid setting whole config', () => {
            const image = Image();
            assert.strictEqual(image.set_config(null, {}), false);
        });
        it('avoid null config', () => {
            const image = Image();
            assert.strictEqual(image.set_config(null, null), false);
        });
        it('avoid empty config', () => {
            const image = Image();
            assert.strictEqual(image.set_config(' ', {}), false);
        });
        it('create key', () => {
            const image = Image();
            assert.strictEqual(image.set_config('key', 'value'), true);
            assert.strictEqual(image.get_config('key', 'value'), 'value');
        });
        it('update key', () => {
            const image = Image();
            assert.strictEqual(image.set_config('default_quality', 80), true);
            assert.strictEqual(image.get_config('default_quality', 80), 80);
        });
    });
});
