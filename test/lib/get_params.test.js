const assert = require('assert');
const lib = require('./../../src/lib');

describe('Lib', () => {
    describe('get_params', () => {
        it('missing params', () => {
            lib.set_config(null, require('./../../src/default_config'));
            assert.deepStrictEqual(lib.get_params(null), {});
            assert.deepStrictEqual(lib.get_params(undefined), {});
        });
        it('missing config', () => {
            lib.set_config(null, {});
            assert.deepStrictEqual(
                lib.get_params({
                    w: '100',
                    h: '100',
                    test: 'true',
                }),
                {}
            );
        });
        // it('valid params', () => {
        //     lib.set_config(null, require('./../../src/default_config'));
        //     assert.deepStrictEqual(
        //         lib.get_params({
        //             w: '100',
        //             h: '100',
        //             q: '60',
        //             m: 'contain',
        //             p: 'center, middle',
        //             t: 'jpg',
        //             f: 'blur(10)',
        //         }),
        //         {
        //             w: 100,
        //             h: 100,
        //             q: 60,
        //             m: 'contain',
        //             p: ['center', 'middle'],
        //             t: 'jpg',
        //             f: {
        //                 blur: 10,
        //             },
        //         }
        //     );
        // });
        it('invalid params', () => {
            lib.set_config(null, require('./../../src/default_config'));
            assert.deepStrictEqual(
                lib.get_params({
                    test: 'true',
                }),
                {}
            );
        });
    });
});
