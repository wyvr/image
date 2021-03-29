const Image = function () {
    const lib = require('./lib');
    // default config
    lib.set_config(null, require('./default_config'));

    return (request, options) => {
        // merge the options with the config
        lib.set_config(null, lib.merge_config(lib.get_config(), options));
        const target_config = lib.get_target_config_from_request(request);

        // console.log(values);
        return {
            get_config(key) {
                return lib.get_config(key);
            },
            set_config(key, value) {
                if (!key || key == null) {
                    return false;
                }
                // force key to string
                key = key + '';
                if (!key.trim()) {
                    return false;
                }
                return lib.set_config(key, value);
            },
            /**
             *
             * @param {string} system
             * @param {string} url
             * @returns the following object { success: boolean, is_Default_image: boolean, buffer: Buffer, type: string, config: any }
             */
            async process(system, url) {
                const result = {
                    success: false,
                    from_cache: false,
                    from_remote_cache: false,
                    is_default_image: false,
                    buffer: null,
                    type: null,
                    config: lib.get_config(),
                };

                const cached_file = lib.read_result_cache_file(system, url, target_config);
                if (cached_file) {
                    result.success = true;
                    result.from_cache = true;
                    result.type = cached_file.type;
                    const type = lib.get_mime_type(target_config.params?.t);
                    if (type) {
                        result.type = type;
                    }
                    result.buffer = cached_file.buffer;
                    return result;
                }
                const file_path = lib.get_file_path(system, url);
                let image = null;
                // try to load the cached file when loading from remote source
                if (file_path.indexOf('http') == 0) {
                    const remote_cache = await lib.read_remote_cache_file(system, url);
                    if (remote_cache) {
                        image = remote_cache;
                        result.from_remote_cache = true;
                    }
                }
                // load the uncached version of the file
                if (!image) {
                    image = await lib.load_file(file_path);
                    if (!image) {
                        return lib.get_default_image_result(result);
                    }
                    if (file_path.indexOf('http') == 0) {
                        lib.write_buffer_to_remote_cache(image, system, url);
                    }
                    const type = lib.get_mime_type(target_config.params?.t);
                    if (type) {
                        image.type = type;
                    }
                }
                const transformed_image = await this.apply(image, result.config);
                if (!transformed_image) {
                    return lib.get_default_image_result(result);
                }
                // store file in cache
                lib.write_buffer_to_result_cache(transformed_image.buffer, system, url, target_config);
                result.buffer = transformed_image.buffer;
                result.type = transformed_image.type;
                result.success = true;
                return result;
            },
            async apply(image, config) {
                const data = await lib.create_image_data(image.buffer, target_config);
                if (!data) {
                    return image;
                }

                image.buffer = await lib.apply_transformations(data, target_config);

                return image;
            },
            get_image_from_cache(system, url, config) {},
        };
    };
};

module.exports = Image();
