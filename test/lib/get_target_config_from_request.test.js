const assert = require('assert');
const lib = require('./../../src/lib');

describe('Lib', () => {
    describe('get_target_config_from_request', () => {
        it('missing request', () => {
            assert.deepStrictEqual(lib.get_target_config_from_request(), {
                params: {},
                accept: {
                    webp: false,
                },
            });
        });
        it('null request', () => {
            assert.deepStrictEqual(lib.get_target_config_from_request(null), {
                params: {},
                accept: {
                    webp: false,
                },
            });
        });
        describe('hapi', () => {
            it('request with webp beginning', () => {
                assert.deepStrictEqual(
                    lib.get_target_config_from_request({
                        headers: {
                            accept: 'image/webp,*/*',
                        },
                    }),
                    {
                        params: {
                            t: 'webp',
                        },
                        accept: {
                            webp: true,
                        },
                    }
                );
            });
            it('request with webp contain', () => {
                assert.deepStrictEqual(
                    lib.get_target_config_from_request({
                        headers: {
                            accept: 'text/html,image/webp,*/*',
                        },
                    }),
                    {
                        params: {
                            t: 'webp',
                        },
                        accept: {
                            webp: true,
                        },
                    }
                );
            });
            it('request with webp ending', () => {
                assert.deepStrictEqual(
                    lib.get_target_config_from_request({
                        headers: {
                            accept: '*/*,image/webp',
                        },
                    }),
                    {
                        params: {
                            t: 'webp',
                        },
                        accept: {
                            webp: true,
                        },
                    }
                );
            });
            it('request without webp', () => {
                assert.deepStrictEqual(
                    lib.get_target_config_from_request({
                        headers: {
                            accept: '*/*',
                        },
                    }),
                    {
                        params: {},
                        accept: {
                            webp: false,
                        },
                    }
                );
            });
            it('request with query parameters', () => {
                assert.deepStrictEqual(
                    lib.get_target_config_from_request({
                        query: {
                            w: '100',
                            test: 'true',
                        },
                    }),
                    {
                        params: {
                            w: 100,
                        },
                        accept: {
                            webp: false,
                        },
                    }
                );
            });
            it('request without query parameters', () => {
                assert.deepStrictEqual(
                    lib.get_target_config_from_request({
                        headers: {},
                    }),
                    {
                        params: {},
                        accept: {
                            webp: false,
                        },
                    }
                );
            });
        });
    });
});
