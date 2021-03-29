const assert = require('assert');
const lib = require('./../../src/lib');

describe('Lib', () => {
    describe('get_default_image_result', () => {
        const test_config = require('./../../src/default_config');
        it('default image config', () => {
            lib.set_config(null, lib.merge_config(test_config, { default_image: null }));
            assert.deepStrictEqual(lib.get_default_image_result({ test: true }), { test: true });
        });
    });
});
