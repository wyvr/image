const assert = require('assert');
const lib = require('./../../src/lib');
const fs = require('fs');

describe('Lib', () => {
    describe('get_mime_type', () => {
        const default_config = require('./../../src/default_config');
        it('null', () => {
            lib.set_config(null, default_config);
            assert.strictEqual(lib.get_mime_type(null), null);
        });
        it('empty', () => {
            lib.set_config(null, default_config);
            assert.strictEqual(lib.get_mime_type(''), null);
        });
        it('empty spaces', () => {
            lib.set_config(null, default_config);
            assert.strictEqual(lib.get_mime_type('   \t'), null);
        });
        it('allowed extension', () => {
            lib.set_config(null, default_config);
            assert.strictEqual(lib.get_mime_type('gif'), 'image/gif');
        });
        it('unknown extension', () => {
            lib.set_config(null, default_config);
            assert.strictEqual(lib.get_mime_type('xyz'), null);
        });
        it('allowed extension with dot', () => {
            lib.set_config(null, default_config);
            assert.strictEqual(lib.get_mime_type('.gif'), 'image/gif');
        });
        it('unknown extension with dot', () => {
            lib.set_config(null, default_config);
            assert.strictEqual(lib.get_mime_type('.xyz'), null);
        });
        it('jpg', () => {
            lib.set_config(null, default_config);
            assert.strictEqual(lib.get_mime_type('.jpg'), 'image/jpeg');
        });        
    });
});
