const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');

const Image = require('../src/image');
const path = require('path');
const fs = require('fs');

const init = async () => {
    const server = Hapi.server({
        port: 8080,
        host: 'localhost',
        routes: {
            files: {
                relativeTo: path.join(__dirname, 'test/local_files'),
            },
        },
        debug: { request: ['error'] },
    });
    await server.register(Inert);

    server.route({
        method: 'GET',
        path: '/image/{system}/{url*}',
        handler: async (request, h) => {
            const start = process.hrtime();
            const system = request.params.system ?? null;

            const url = request.params.url ?? null;
            if (!url) {
                return null;
            }
            console.log('get', system, url);
            const image = Image(request, {
                systems: {
                    local: './test/local_files/',
                    http: 'https://placeimg.com/',
                },
            });
            const result = await image.process(system, url);

            if (result.error.length > 0) {
                result.error.forEach((error)=>{
                    console.log(`x ${error}`);
                })
            }
            if (result.from_remote_cache) {
                console.log('- from remote cache');
            }
            if (result.from_cache) {
                console.log('- from cache');
            }
            if (!result.success) {
                console.log('> error');
                return h.response(`failed generating image for ${system}  => ${url}`);
            }
            if (result.is_default_image) {
                console.log('> is default image');
                // default image is set
                return h.response('default image will be used');
            }
            const execution_time = process.hrtime(start);
            const execution_ms = Math.round((execution_time[0] + execution_time[1] / 1000000000) * 1000);
            console.log('> done', execution_ms, 'ms');
            fs.writeFileSync('./test.jpg', result.buffer);
            return h.response(result.buffer).type(result.type);
            // return `${system} => ${url} ${JSON.stringify(request.query)}\n${JSON.stringify(request.response)} ${Object.keys(h).join('\n')}`;
        },
    });
    server.route({
        method: 'GET',
        path: '/local_files/{file*}',
        handler: function (request, h) {
            return h.file(request.params.file);
        },
    });
    server.route({
        method: 'GET',
        path: '/test',
        handler: function (request, h) {
            return h.response('<img src="http://localhost:8080/image/local/original.jpg?w=100" style="max-width:200px;">');
        },
    });
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
