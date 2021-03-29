const assert = require('assert');
const lib = require('../../src/lib');

describe('Lib', () => {
    describe('normalized_param_value', () => {
        it('missing', () => {
            lib.set_config(null, require('../../src/default_config'));
            assert.deepStrictEqual(lib.normalized_param_value(null, null), null);
            assert.deepStrictEqual(lib.normalized_param_value(null, 'value'), 'value');
            assert.deepStrictEqual(lib.normalized_param_value('w', null), null);
            assert.deepStrictEqual(lib.normalized_param_value('test', null), null);
        });
        describe('(w)idth', () => {
            lib.set_config(null, require('../../src/default_config'));
            it('invalid values', () => {
                assert.deepStrictEqual(lib.normalized_param_value('w', null), null);
                assert.deepStrictEqual(lib.normalized_param_value('w', 'a'), null);
                assert.deepStrictEqual(lib.normalized_param_value('w', true), null);
            });
            it('valid values', () => {
                assert.deepStrictEqual(lib.normalized_param_value('w', '100'), 100);
                assert.deepStrictEqual(lib.normalized_param_value('w', '100.0'), 100);
                assert.deepStrictEqual(lib.normalized_param_value('w', '100.5'), 100);
            });
        });
        describe('(h)eight', () => {
            lib.set_config(null, require('../../src/default_config'));
            it('invalid values', () => {
                assert.deepStrictEqual(lib.normalized_param_value('h', null), null);
                assert.deepStrictEqual(lib.normalized_param_value('h', 'a'), null);
                assert.deepStrictEqual(lib.normalized_param_value('h', true), null);
            });
            it('valid values', () => {
                assert.deepStrictEqual(lib.normalized_param_value('h', '100'), 100);
                assert.deepStrictEqual(lib.normalized_param_value('h', '100.0'), 100);
                assert.deepStrictEqual(lib.normalized_param_value('h', '100.5'), 100);
            });
        });
        describe('(q)uality', () => {
            lib.set_config(null, require('../../src/default_config'));
            const default_quality = lib.get_config('default_quality');
            it('invalid values', () => {
                assert.deepStrictEqual(lib.normalized_param_value('q', null), default_quality);
                assert.deepStrictEqual(lib.normalized_param_value('q', 'a'), default_quality);
                assert.deepStrictEqual(lib.normalized_param_value('q', true), default_quality);
            });
            it('valid values', () => {
                assert.deepStrictEqual(lib.normalized_param_value('q', '100'), 100);
                assert.deepStrictEqual(lib.normalized_param_value('q', '100.0'), 100);
                assert.deepStrictEqual(lib.normalized_param_value('q', '100.5'), 100);
            });
            it('limit values', () => {
                assert.deepStrictEqual(lib.normalized_param_value('q', '500'), 100);
                assert.deepStrictEqual(lib.normalized_param_value('q', 500), 100);
                assert.deepStrictEqual(lib.normalized_param_value('q', '-500'), 1);
                assert.deepStrictEqual(lib.normalized_param_value('q', -500), 1);
            });
        });
        describe('(m)ode', () => {
            lib.set_config(null, require('../../src/default_config'));
            const default_mode = lib.get_config('default_mode');
            it('invalid values', () => {
                assert.deepStrictEqual(lib.normalized_param_value('m', null), default_mode);
                assert.deepStrictEqual(lib.normalized_param_value('m', '100'), default_mode);
                assert.deepStrictEqual(lib.normalized_param_value('m', 100), default_mode);
                assert.deepStrictEqual(lib.normalized_param_value('m', false), default_mode);
                assert.deepStrictEqual(lib.normalized_param_value('m', '   '), default_mode);
                assert.deepStrictEqual(lib.normalized_param_value('m', 'test'), default_mode);
            });
            it('valid values', () => {
                assert.deepStrictEqual(lib.normalized_param_value('m', 'contain'), 'contain');
                assert.deepStrictEqual(lib.normalized_param_value('m', 'cover'), 'cover');
                assert.deepStrictEqual(lib.normalized_param_value('m', 'Cover'), 'cover');
            });
            it('alias value', () => {
                assert.deepStrictEqual(lib.normalized_param_value('m', 'crop'), 'cover');
            });
            it('broken alias value', () => {
                lib.set_config(null, require('../../src/default_config'));
                lib.set_config('alias_modes', { crop: { is: false } });
                assert.deepStrictEqual(lib.normalized_param_value('m', 'crop'), 'contain');
            });
        });
        describe('(p)osition', () => {
            const default_postion = lib.get_config('default_position');
            it('invalid values', () => {
                lib.set_config(null, require('../../src/default_config'));
                assert.deepStrictEqual(lib.normalized_param_value('p', null), default_postion);
                assert.deepStrictEqual(lib.normalized_param_value('p', 'a'), default_postion);
                assert.deepStrictEqual(lib.normalized_param_value('p', true), default_postion);
                assert.deepStrictEqual(lib.normalized_param_value('p', 100), default_postion);
                assert.deepStrictEqual(lib.normalized_param_value('p', []), default_postion);
                assert.deepStrictEqual(lib.normalized_param_value('p', 'left,top,bottom'), ['left', 'top']);
            });
            it('values spaces', () => {
                lib.set_config(null, require('../../src/default_config'));
                assert.deepStrictEqual(lib.normalized_param_value('p', ' left  \t ,   top '), ['left', 'top']);
            });
            it('values with X & Y coordinates correction', () => {
                lib.set_config(null, require('../../src/default_config'));
                assert.deepStrictEqual(lib.normalized_param_value('p', 'top, left'), ['left', 'top']);
                assert.deepStrictEqual(lib.normalized_param_value('p', 'left, top'), ['left', 'top']);
                assert.deepStrictEqual(lib.normalized_param_value('p', 'bottom, right'), ['right', 'bottom']);
                assert.deepStrictEqual(lib.normalized_param_value('p', 'right, bottom'), ['right', 'bottom']);
            });
            it('missing X coordinate', () => {
                lib.set_config(null, require('../../src/default_config'));
                assert.deepStrictEqual(lib.normalized_param_value('p', 'top'), ['center', 'top']);
                assert.deepStrictEqual(lib.normalized_param_value('p', 'bottom'), ['center', 'bottom']);
                assert.deepStrictEqual(lib.normalized_param_value('p', 'middle'), ['center', 'middle']);
            });
            it('missing Y coordinate', () => {
                lib.set_config(null, require('../../src/default_config'));
                assert.deepStrictEqual(lib.normalized_param_value('p', 'right'), ['right', 'middle']);
                assert.deepStrictEqual(lib.normalized_param_value('p', 'left'), ['left', 'middle']);
                assert.deepStrictEqual(lib.normalized_param_value('p', 'center'), ['center', 'middle']);
            });
            it('center & middle correction', () => {
                lib.set_config(null, require('../../src/default_config'));
                lib.set_config('default_position', ['left', 'top']);
                assert.deepStrictEqual(lib.normalized_param_value('p', 'middle, middle'), ['center', 'middle']);
                assert.deepStrictEqual(lib.normalized_param_value('p', 'middle,middle'), ['center', 'middle']);
                assert.deepStrictEqual(lib.normalized_param_value('p', 'center, center'), ['center', 'middle']);
            });
        });
        describe('(t)ype', () => {
            lib.set_config(null, require('../../src/default_config'));
            it('invalid values', () => {
                assert.deepStrictEqual(lib.normalized_param_value('t', null), null);
                assert.deepStrictEqual(lib.normalized_param_value('t', 'a'), null);
                assert.deepStrictEqual(lib.normalized_param_value('t', '    '), null);
                assert.deepStrictEqual(lib.normalized_param_value('t', true), null);
                assert.deepStrictEqual(lib.normalized_param_value('t', 100), null);
            });
            it('valid values', () => {
                assert.deepStrictEqual(lib.normalized_param_value('t', 'JPEG'), 'jpeg');
                assert.deepStrictEqual(lib.normalized_param_value('t', 'PNG'), 'png');
                assert.deepStrictEqual(lib.normalized_param_value('t', 'WebP'), 'webp');
                assert.deepStrictEqual(lib.normalized_param_value('t', 'GIF'), 'gif');
            });
            it('extention with dot', () => {
                assert.deepStrictEqual(lib.normalized_param_value('t', '.jpeg'), 'jpeg');
                assert.deepStrictEqual(lib.normalized_param_value('t', '.png'), 'png');
                assert.deepStrictEqual(lib.normalized_param_value('t', '.webp'), 'webp');
                assert.deepStrictEqual(lib.normalized_param_value('t', '.gif'), 'gif');
            });
            it('correct jpg', () => {
                assert.deepStrictEqual(lib.normalized_param_value('t', 'jpg'), 'jpeg');
            });
            it('with spaces', () => {
                assert.deepStrictEqual(lib.normalized_param_value('t', ' . jpg'), 'jpeg');
                assert.deepStrictEqual(lib.normalized_param_value('t', ' jpeg '), 'jpeg');
                assert.deepStrictEqual(lib.normalized_param_value('t', '\tpng '), 'png');
                assert.deepStrictEqual(lib.normalized_param_value('t', '\twebp\n'), 'webp');
            });
        });
        describe('(f)ilter', () => {
            lib.set_config(null, require('../../src/default_config'));
            it('invalid values', () => {
                assert.deepStrictEqual(lib.normalized_param_value('f', null), null);
                assert.deepStrictEqual(lib.normalized_param_value('f', 'a'), null);
                assert.deepStrictEqual(lib.normalized_param_value('f', true), null);
                assert.deepStrictEqual(lib.normalized_param_value('f', 100), null);
                assert.deepStrictEqual(lib.normalized_param_value('f', 'test:10'), null);
                assert.deepStrictEqual(lib.normalized_param_value('f', 'blur:a'), { blur: false });
                assert.deepStrictEqual(lib.normalized_param_value('f', ','), null);
            });
            it('valid values', () => {
                assert.deepStrictEqual(lib.normalized_param_value('f', 'blur:10'), { blur: 10 });
                assert.deepStrictEqual(lib.normalized_param_value('f', 'blur:10.5'), { blur: 10.5 });
                assert.deepStrictEqual(lib.normalized_param_value('f', 'blur:10.5,'), { blur: 10.5 });
                assert.deepStrictEqual(lib.normalized_param_value('f', ' blur :\n10\t '), { blur: 10 });
                assert.deepStrictEqual(lib.normalized_param_value('f', 'blur'), { blur: true });
            });
            it('multiple values', () => {
                assert.deepStrictEqual(lib.normalized_param_value('f', 'blur:10,rotate:90,negate'), { blur: 10, rotate: 90, negate: true });
            });
        });
    });
});
