const assert = require('assert');
const lib = require('./../../src/lib');
const fs = require('fs');
const default_config = require('./../../src/default_config');

describe('Lib', () => {
    describe('load_file', () => {
        const test_config = lib.merge_config(default_config, {
            systems: {
                local: './test/local_files/',
                remote: 'http://localhost:8080/',
                http: 'https://placeimg.com/'
            },
        });
        const original = fs.readFileSync('./test/local_files/original.jpg');
        const small = fs.readFileSync('./test/local_files/small.jpg');
        it('missing parameters', async () => {
            lib.set_config(null, test_config);
            assert.strictEqual(await lib.load_file(), null);
            assert.strictEqual(await lib.load_file('local'), null);
            assert.strictEqual(await lib.load_file(null), null);
            assert.strictEqual(await lib.load_file(undefined), null);
            assert.strictEqual(await lib.load_file(1), null);
            assert.strictEqual(await lib.load_file([1, 2, 3]), null);
            assert.strictEqual(await lib.load_file(new Date()), null);
            assert.strictEqual(await lib.load_file({ a: true }), null);
        });
        it('local file', async () => {
            lib.set_config(null, test_config);
            const result = await lib.load_file(lib.get_file_path('local', 'small.jpg'));
            assert.strictEqual(result.type, 'image/jpeg');
            assert.strictEqual(result.buffer.length, small.length);
        });
        it('non existing local file', async () => {
            lib.set_config(null, test_config);
            const result = await lib.load_file(lib.get_file_path('local', 'original1.jpg'));
            assert.strictEqual(result, null);
        });
        it('remote file', async () => {
            lib.set_config(null, test_config);
            const result = await lib.load_file(lib.get_file_path('remote', '/local_files/small.jpg'));
            assert.strictEqual(result.type, 'image/jpeg');
        });
        it('non existing remote file', async () => {
            lib.set_config(null, test_config);
            const result = await lib.load_file(lib.get_file_path('remote', 'local_files/asdf.jpeg'));
            assert.strictEqual(result, null);
        });
        it('remote file without extension', async () => {
            lib.set_config(null, test_config);
            const result = await lib.load_file(lib.get_file_path('http', '640/480/tech'));
            assert.strictEqual(result.type, 'image/jpeg');
        });
        it('remote file without extension and slash at the end', async () => {
            lib.set_config(null, test_config);
            const result = await lib.load_file(lib.get_file_path('http', '640/480/tech/'));
            assert.strictEqual(result.type, 'image/jpeg');
        });
    });
});
