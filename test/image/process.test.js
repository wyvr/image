const assert = require('assert');
const default_config = require('../../src/default_config');
const Image = require('../../src/image');
const lib = require('../../src/lib');
const fs = require('fs');

describe('Image', () => {
    describe('process', () => {
        const test_config = {
            systems: {
                local: './test/local_files/',
                http: 'https://wyvr.dev/image/dummy',
            },
            default_image: './test/local_files/default_image.png',
        };
        const resulting_test_config = lib.merge_config(default_config, test_config);
        const uncached_test_config = lib.merge_config(test_config, { cache_result: false });
        const uncached_resulting_test_config = lib.merge_config(default_config, test_config, { cache_result: false });
        const original = fs.readFileSync('./test/local_files/original.jpg');
        const original_resized_100 = fs.readFileSync('./test/local_files/original_resized_100.jpg');
        const small = fs.readFileSync('./test/local_files/small.jpg');
        const default_image = fs.readFileSync('./test/local_files/default_image.png');
        describe('missing params', async () => {
            const image = Image(
                {
                    query: {
                        w: 100,
                    },
                },
                test_config
            );
            const result = await image.process();
            it('missing params success', () => {
                assert.strictEqual(result.success, false);
            });
            it('missing params is_default_image', () => {
                assert.strictEqual(result.is_default_image, true);
            });
            it('missing params type', () => {
                assert.strictEqual(result.type, 'image/png');
            });
            it('missing params config', () => {
                assert.deepStrictEqual(result.config, resulting_test_config);
            });
        });
        describe('default image', async () => {
            const image = Image(
                {
                    query: {
                        w: 100,
                    },
                },
                test_config
            );
            const result = await image.process('local', 'asdf.jpg');
            it('default image success', () => {
                assert.strictEqual(result.success, false);
            });
            it('default image is_default_image', () => {
                assert.strictEqual(result.is_default_image, true);
            });
            it('default image type', () => {
                assert.strictEqual(result.type, 'image/png');
            });
            it('default image config', () => {
                assert.deepStrictEqual(result.config, resulting_test_config);
            });
        });
        describe('unchanged image', async () => {
            const image = Image(null, test_config);
            const result = await image.process('local', 'small.jpg');
            it('unchanged image success', () => {
                assert.strictEqual(result.success, true);
            });
            it('unchanged image is_default_image', () => {
                assert.strictEqual(result.is_default_image, false);
            });
            it('unchanged image type', () => {
                assert.strictEqual(result.type, 'image/jpeg');
            });
            it('unchanged image config', () => {
                assert.deepStrictEqual(result.config, resulting_test_config);
            });
        });
        describe('uncached image', async () => {
            const image = Image(null, uncached_test_config);
            const result = await image.process('local', 'small.jpg');
            it('uncached image success', () => {
                assert.strictEqual(result.success, true);
            });
            it('uncached image is_default_image', () => {
                assert.strictEqual(result.is_default_image, false);
            });
            it('uncached image type', () => {
                assert.strictEqual(result.type, 'image/jpeg');
            });
            it('uncached image config', () => {
                assert.deepStrictEqual(result.config, uncached_resulting_test_config);
            });
        });
        describe('uncached image with type', async () => {
            const image = Image(
                {
                    query: {
                        t: 'gif',
                    },
                },
                uncached_test_config
            );
            const result = await image.process('local', 'small.jpg');
            it('uncached image with type success', () => {
                assert.strictEqual(result.success, true);
            });
            it('uncached image with type is_default_image', () => {
                assert.strictEqual(result.is_default_image, false);
            });
            it('uncached image with type type', () => {
                assert.strictEqual(result.type, 'image/gif');
            });
            it('uncached image with type config', () => {
                assert.deepStrictEqual(result.config, uncached_resulting_test_config);
            });
        });
        // describe('resized image', async () => {
        //     const image = Image(
        //         {
        //             query: {
        //                 w: 100,
        //             },
        //         },
        //         test_config
        //     );
        //     const result = await image.process('local', 'original.jpg');
        //     it('unchanged image success', () => {
        //         assert.strictEqual(result.success, true);
        //     });
        //     it('unchanged image is_default_image', () => {
        //         assert.strictEqual(result.is_default_image, false);
        //     });
        //     it('unchanged image type', () => {
        //         assert.strictEqual(result.type, 'image/jpeg');
        //     });
        //     it('unchanged image config', () => {
        //         assert.deepStrictEqual(result.config, resulting_test_config);
        //     });
        // });
    });
});
