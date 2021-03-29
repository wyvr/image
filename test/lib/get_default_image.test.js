const assert = require('assert');
const lib = require('./../../src/lib');
const fs = require('fs');

describe('Lib', () => {
    describe('get_default_image', () => {
        const default_image_path = './test/local_files/default_image.png';
        const default_image_buffer = fs.readFileSync(default_image_path);
        const default_config = require('./../../src/default_config');
        it('missing config', () => {
            lib.set_config(null, {});
            assert.strictEqual(lib.get_default_image(), null);
        });
        it('existing file', async () => {
            lib.set_config(
                null,
                lib.merge_config(default_config, {
                    default_image: default_image_path,
                })
            );

            assert.deepStrictEqual(lib.get_default_image(), {
                buffer: default_image_buffer,
                type: 'image/png',
            });
        });
        it('not existing file', async () => {
            lib.set_config(
                null,
                lib.merge_config(default_config, {
                    default_image: './test/asdf.jpg',
                })
            );
            assert.strictEqual(lib.get_default_image(), null);
        });
    });
});
