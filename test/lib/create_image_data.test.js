const assert = require('assert');
const lib = require('./../../src/lib');
const fs = require('fs');

describe('Lib', () => {
    describe('create_image_data', () => {
        const default_config = require('./../../src/default_config');
        const small_buffer = fs.readFileSync('./test/local_files/small.jpg');
        it('no params', async () => {
            lib.set_config(null, default_config);
            const result = await lib.create_image_data(null, null);
            assert.strictEqual(result, null);
        });
        it('missing buffer', async () => {
            lib.set_config(null, default_config);
            const result = await lib.create_image_data(null, default_config);
            assert.strictEqual(result, null);
        });
        it('missing config', async () => {
            lib.set_config(null, default_config);
            const result = await lib.create_image_data(small_buffer, null);
            assert.notStrictEqual(result, null);
        });
        it('has result', async () => {
            lib.set_config(null, default_config);
            const result = await lib.create_image_data(small_buffer, default_config);
            assert.notStrictEqual(result, null);
        });
    });
});
