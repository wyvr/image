const assert = require('assert');
const lib = require('./../../src/lib');

describe('Lib', () => {
    describe('get_file_path', () => {
        it('missing parameters', () => {
            lib.set_config(null, {
                systems: {
                    local: './test/local_files/',
                },
            });
            assert.deepStrictEqual(lib.get_file_path(), null);
            assert.deepStrictEqual(lib.get_file_path('local'), null);
            assert.deepStrictEqual(lib.get_file_path(null, 'file'), null);
            assert.deepStrictEqual(lib.get_file_path(null, null), null);
        });
        it('unknown system', () => {
            lib.set_config(null, {
                systems: {
                    local: './test/local_files/',
                },
            });
            assert.deepStrictEqual(lib.get_file_path(), null);
            assert.deepStrictEqual(lib.get_file_path('local'), null);
            assert.deepStrictEqual(lib.get_file_path(null, 'file'), null);
            assert.deepStrictEqual(lib.get_file_path(null, null, { w: 100 }), null);
        });
        it('local file', () => {
            lib.set_config(null, {
                systems: {
                    local: './test/local_files/',
                },
            });
            assert.deepStrictEqual(lib.get_file_path('local', 'test.jpg', { w: 100 }), './test/local_files/test.jpg');
            assert.deepStrictEqual(lib.get_file_path('local', '/test.jpg', { w: 100 }), './test/local_files/test.jpg');
        });
        it('remote file', () => {
            lib.set_config(null, {
                systems: {
                    remote: 'https://domain.com/files/',
                },
            });
            assert.deepStrictEqual(lib.get_file_path('remote', 'test.jpg', { w: 100 }), 'https://domain.com/files/test.jpg');
            assert.deepStrictEqual(lib.get_file_path('remote', '/test.jpg', { w: 100 }), 'https://domain.com/files/test.jpg');
        });
    });
});
