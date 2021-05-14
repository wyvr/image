const valid = require('./valid');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const md5 = require('md5');
const normalize_param_value = require('./lib/normalize_param_value');
const cwd = process.cwd();
const color = require('color');

module.exports = {
    config: null,
    /**
     * Normalizes the given extension
     * @param {string} extension
     * @returns string
     */
    normalize_extension(extension) {
        if (!extension || typeof extension !== 'string' || !extension.trim()) {
            return '';
        }
        return extension.trim().toLowerCase().replace(/^\./, '').trim();
    },
    /**
     * Returns the image mime type of an extension
     * @param {string} extension e.g. .jpg, png, .webp
     * @returns
     */
    get_mime_type(extension) {
        const ext = this.normalize_extension(extension);
        if (!ext) {
            return null;
        }
        const ext_allowed = normalize_param_value.string_allowed(ext, null, this.get_config('allowed_extensions'), this.get_config('alias_extensions'));
        if (!ext_allowed) {
            return null;
        }
        return `image/${ext_allowed}`;
    },
    /**
     * Merge multiple configs together
     * @param  {...any} configs
     * @returns any
     */
    merge_config(...configs) {
        if (!configs || configs.length == 0) {
            return {};
        }
        const filtered_configs = configs.filter(Boolean).filter((config) => {
            return typeof config == 'object' && !Array.isArray(config) && !(config instanceof Date);
        });
        if (filtered_configs.length == 0) {
            return {};
        }

        const config = {};
        filtered_configs.forEach((filtered_config) => {
            Object.keys(filtered_config).forEach((key) => {
                config[key] = filtered_config[key];
            });
        });

        return config;
    },
    /**
     * Return the value of the given key
     * or when called with null
     * everything will returned
     * @param {string|null} key
     * @returns any
     */
    get_config(key) {
        // empty returns whole config
        if (!key) {
            return this.config;
        }

        if (!this.config || !this.config[key]) {
            return null;
        }
        return this.normalized_param_value(key, this.config[key]);
    },
    /**
     * Set a value for the given key
     * or when key is null and value is set
     * the whole config will be replaced
     * @param {string\null} key
     * @param {any} value
     * @returns boolean
     */
    set_config(key, value) {
        // update whole config
        if (key == null && !value) {
            return false;
        }
        if (key == null && value != null) {
            this.config = value;
            return true;
        }
        this.config[key] = value;

        return true;
    },
    /**
     * Get the values out of the request object
     * @param {any} request
     * @returns
     */
    get_target_config_from_request(request) {
        const values = {
            params: {},
            accept: {
                webp: false,
            },
        };
        if (!request) {
            return values;
        }
        // hapi
        if (request.headers) {
            if (request.headers.accept) {
                const accepts = request.headers.accept
                    .split(',')
                    .map((value) => {
                        return value.trim();
                    })
                    .filter(Boolean);
                const webp_accepted = accepts.indexOf('image/webp') > -1;
                values.accept.webp = webp_accepted;
            }
        }
        if (request.query) {
            values.params = this.get_params(request.query);
        }
        // when another extension should be used use the new extension
        const target_extension = this.get_target_extension(values);
        if (target_extension) {
            values.params.t = target_extension;
        }
        return values;
    },
    /**
     * Gets the valid image configs from the query object
     * @param {any} query
     * @returns
     */
    get_params(query) {
        const allowed_config = {};
        if (!query) {
            return {};
        }
        const allowed_properties = this.get_config('allowed_config_properties');
        if (!allowed_properties) {
            return {};
        }
        allowed_properties.forEach((key) => {
            if (!query[key]) {
                return;
            }
            allowed_config[key] = this.normalized_param_value(key, query[key]);
        });

        return allowed_config;
    },
    /**
     * Get the normalized and corrected options for the image conversion
     * @param {string} key
     * @param {string|number} value
     * @returns
     */
    normalized_param_value(key, value) {
        switch (key) {
            case 'w':
            case 'h':
                return normalize_param_value.number(value, null);
            case 'q':
                return normalize_param_value.number_between(value, this.get_config('default_quality'), 1, 100);
            case 'm':
                return normalize_param_value.string_allowed(
                    value,
                    this.get_config('default_mode'),
                    this.get_config('allowed_modes'),
                    this.get_config('alias_modes')
                );
            case 'p':
                return normalize_param_value.position_value(
                    value,
                    this.get_config('default_position'),
                    this.get_config('allowed_horizontal_positions'),
                    this.get_config('allowed_vertical_positions')
                );

            case 't':
                // nomalize extension
                const extension = this.normalize_extension(value);
                return normalize_param_value.string_allowed(extension, null, this.get_config('allowed_extensions'), this.get_config('alias_extensions'));
            case 'f':
                return normalize_param_value.split_string_to_object(value, null, this.get_config('allowed_filter'));
        }
        return value;
    },
    /**
     * Returns the system value from the config
     * @param {string} system
     * @returns string|null
     */
    get_system(system) {
        if (!valid.is_filled_string(system)) {
            return null;
        }
        // check if system exists in config
        system = system.trim();
        const systems = this.get_config('systems');
        if (!systems || !systems[system]) {
            return null;
        }
        // validate system config
        if (typeof systems[system] != 'string') {
            return null;
        }
        // remove / at the end
        return systems[system].replace(/\/$/, '');
    },
    /**
     * Get the path to the file based on the system
     * @param {string} system
     * @param {string} file
     * @returns string|null
     */
    get_file_path(system, file) {
        if (!valid.is_filled_string(system) || !valid.is_filled_string(file)) {
            return null;
        }
        const system_target = this.get_system(system);
        const file_target = '/' + file.replace(/^\//, '');
        return `${system_target}${file_target}`;
    },
    /**
     * Returns the image to load as string with type info or null
     * @param {string} file_path
     * @returns the image as buffer and the type or null
     */
    async load_file(file_path) {
        if (!valid.is_filled_string(file_path)) {
            return null;
        }
        const clean_file_path = file_path.trim();
        const data = {
            buffer: null,
            type: this.get_mime_type(path.extname(clean_file_path)),
        };
        // when path starts with http then it should be an external source, so load it
        if (clean_file_path.indexOf('http') == 0) {
            let res = null;
            try {
                res = await axios({
                    url: clean_file_path,
                    method: 'GET',
                    responseType: 'arraybuffer',
                });
                // add type from the request, when not set
                if (!data.type && res.headers && res.headers['content-type']) {
                    data.type = res.headers['content-type'];
                }
            } catch (err) {
                // @TODO implement logging
                // console.log(err);
                return null;
            }
            data.buffer = Buffer.from(res.data);
            return data;
        }
        // when file local exists it must be a local file
        if (!fs.existsSync(clean_file_path)) {
            return null;
        }
        data.buffer = fs.readFileSync(clean_file_path);
        return data;
    },
    /**
     * Returns the defaul image with type info or null
     * @returns default image buffer or null
     */
    get_default_image() {
        const default_image_path = this.get_config('default_image');
        if (!valid.is_filled_string(default_image_path)) {
            return null;
        }
        if (!fs.existsSync(default_image_path)) {
            // @TODO logging that default image is not existing
            return null;
        }
        const data = {
            buffer: fs.readFileSync(default_image_path),
            type: this.get_mime_type(path.extname(default_image_path)),
        };
        return data;
    },
    /**
     * Transforms the process result to handle the default image
     * @param {any} result
     * @returns the modified result
     */
    get_default_image_result(result) {
        const default_image = this.get_default_image();
        if (default_image) {
            const default_image_result = Object.assign({}, result);
            default_image_result.is_default_image = true;
            default_image_result.buffer = default_image.buffer;
            default_image_result.type = default_image.type;
            return default_image_result;
        }
        return result;
    },
    /**
     * Returns the file extension for the target file
     * @param {any} target_config
     * @returns
     */
    get_target_extension(target_config) {
        if (!target_config) {
            return null;
        }
        if (target_config && target_config.accept && target_config.accept.webp) {
            return 'webp';
        }
        return normalize_param_value.string_allowed(target_config && target_config.params && target_config.params.t ? target_config.params.t : null, null, this.get_config('allowed_extensions'), this.get_config('alias_extensions'));
    },
    async create_image_data(buffer, target_config) {
        try {
            let sharp_instance = await sharp(buffer);
            if (target_config && target_config.params && target_config.params.t) {
                const outputOptions = this.get_image_data_output_options(target_config);
                return sharp_instance.toFormat(target_config.params.t, outputOptions);
            }
            return sharp_instance;
        } catch (e) {
            // @TODO add logging
            // console.log(e)
        }
        return null;
    },
    get_image_data_output_options(target_config) {
        const options = {};
        // gif has no quality
        if (target_config && target_config.params && target_config.params.q && target_config && target_config.params && target_config.params.t && target_config.params.t != 'gif') {
            options.quality = parseInt(target_config && target_config.params && target_config.params.q ? target_config.params.q+'' : '', 10);
        }
        return options;
    },
    async apply_transformations(data, type, target_config, config) {
        if ((target_config && target_config.params && target_config.params.w && target_config.params.w != null) || (target_config && target_config.params && target_config.params.h && target_config.params.h != null)) {
            // fill with white background color when jpg otherwise transparent
            let background = color(config.background);
            if (type && type == 'image/jpeg') {
                background = background.alpha(1);
            }
            let resize = {};
            // (W)idth
            if (target_config && target_config.params && target_config.params.w && target_config.params.w != null) {
                resize.width = target_config.params.w;
            }
            // (H)eight
            if (target_config && target_config.params && target_config.params.h && target_config.params.h != null) {
                resize.height = target_config.params.h;
            }
            // (M)ode
            if (target_config && target_config.params && target_config.params.m && target_config.params.m != null) {
                resize.fit = target_config.params.m;
                resize.background = background;
            }
            // check if image is smaller then the given sizes and change the width to return propotional correct image
            if ((config && !config.enlarge_image) && resize.width && resize.height && resize.fit == 'contain') {
                const meta_data = await data.metadata();
                resize = this.adjust_resize(resize, meta_data);
            }
            // (P)osition
            if (target_config && target_config.params && target_config.params.p && target_config.params.p != null) {
                // remove center and middle, not allowed in sharp
                // @see https://sharp.pixelplumbing.com/api-resize#resize
                resize.position = target_config.params.p
                    .filter((p) => {
                        return ['center', 'middle'].indexOf(p) == -1;
                    })
                    .join(' ');
            }
            // (Q)uality gets set in the output options

            // (F)ilter
            if (target_config && target_config.params && target_config.params.f && target_config.params.f != null) {
                const filter_keys = Object.keys(target_config.params.f);
                filter_keys.forEach((filter) => {
                    const filter_value = target_config.params.f[filter];
                    switch (filter) {
                        case 'blur':
                            data = data.blur(filter_value);
                            break;
                        case 'rotate':
                            data = data.rotate(filter_value, { background });
                            break;
                        case 'negate':
                            data = data.negate();
                            break;
                    }
                });
            }

            data = data.resize(resize);
        }
        return data.toBuffer();
    },
    adjust_resize(resize, meta_data) {
        const adjusted = Object.assign({}, resize);
        if (!adjusted || !adjusted.width || !adjusted.height || !meta_data.width || !meta_data.height) {
            return adjusted;
        }
        if (adjusted.width <= meta_data.width && adjusted.height <= meta_data.height) {
            return adjusted;
        }
        const ratio = Math.min(meta_data.width / adjusted.width, meta_data.height / adjusted.height);

        adjusted.width = Math.round(adjusted.width * ratio);
        adjusted.height = Math.round(adjusted.height * ratio);

        return adjusted;
    },
    write_buffer_to_result_cache(buffer, system, url, config) {
        if (!this.get_config('cache_result')) {
            return;
        }
        const cache_file = this.get_cache_file_url(system, url, config);
        this.write_buffer_to_cache(buffer, cache_file);
    },
    write_buffer_to_remote_cache(image, system, url) {
        if (!this.get_config('cache_remote_files') || !image || !system || !url) {
            return;
        }
        const cache_file = this.get_cache_remote_file_url(system, url);
        this.write_buffer_to_cache(image.buffer, cache_file);
    },
    write_buffer_to_cache(buffer, file_path) {
        if (!buffer || !file_path) {
            return false;
        }
        const dir_name = path.dirname(file_path);
        fs.mkdirSync(dir_name, { recursive: true });
        if (!fs.existsSync(dir_name)) {
            throw new Error(`dir ${dir_name} does not exist`);
        }
        fs.writeFileSync(file_path, buffer);
        if (!fs.existsSync(file_path)) {
            throw new Error(`file ${file_path} does not exist`);
        }
        return true;
    },
    read_result_cache_file(system, url, config) {
        const cache_file = this.get_cache_file_url(system, url, config);
        const cache = this.read_cache_file(cache_file, this.get_config('cache_result'), this.get_config('cache_duration'));

        return cache;
    },
    async read_remote_cache_file(system, url) {
        const cache_file = this.get_cache_remote_file_url(system, url);
        const cache = this.read_cache_file(cache_file, this.get_config('cache_remote_files'), this.get_config('cache_remote_duration'));
        // type of the cache file can not be extracted, get it with sharp
        if (cache_file.indexOf('/file.cache') > -1 && !cache.type && cache.buffer) {
            try {
                // get the format of the buffer
                const sharp_instance = await sharp(cache.buffer);
                const meta_data = await sharp_instance.metadata();
                if (!meta_data) {
                    return null;
                }
                cache.type = this.get_mime_type(meta_data.format);
            } catch (err) {
                // @TODO Logging
                return null;
            }
        }
        return cache;
    },
    read_cache_file(cache_file, cache_enabled, cache_duration) {
        if (!cache_enabled || !cache_file || !fs.existsSync(cache_file)) {
            return null;
        }
        if (cache_duration) {
            const cache_duration_seconds = parseInt(cache_duration + '', 10) * 1000;
            const stats = fs.statSync(cache_file);
            if (stats) {
                const cache_invalidated = stats.mtimeMs + cache_duration_seconds < new Date().getTime();
                if (cache_invalidated) {
                    return null;
                }
            }
        }
        const data = {
            buffer: fs.readFileSync(cache_file),
            type: this.get_mime_type(path.extname(cache_file)),
        };
        return data;
    },
    get_cache_file_url(system, url, config) {
        let config_params = null;
        if (config.params) {
            config_params = config.params;
        }
        const config_hash = md5(JSON.stringify(config_params));
        const cache_file = path.join(cwd, 'cache', system, config_hash, url);
        return cache_file;
    },
    get_cache_remote_file_url(system, url) {
        const extension = path.extname(url);
        if (!extension) {
            if (!url.match(/\/$/)) {
                url += '/';
            }
            url += 'file.cache';
        }
        const cache_file = path.join(cwd, 'remote_cache', system, url);
        return cache_file;
    },
};
