module.exports = {
    allowed_config_properties: ['w', 'h', 'q', 'm', 'p', 't', 'f'],
    allowed_modes: ['cover', 'contain'],
    alias_modes: {
        'crop': 'cover'
    },
    allowed_horizontal_positions: ['right', 'center', 'left'],
    allowed_vertical_positions: ['top', 'middle', 'bottom'],
    allowed_extensions: ['jpeg', 'png', 'svg', 'webp', 'tiff', 'avif', 'gif'],
    alias_extensions: {
        'jpg': 'jpeg'
    },
    allowed_filter: ['blur', 'rotate', 'negate'],
    default_quality: 90,
    default_mode: 'contain',
    default_position: ['center', 'middle'],
    background: { r: 255, g: 255, b: 255, alpha: 0 }, // @see https://www.npmjs.com/package/color
    cache_result: true,
    cache_duration: 3600, // 1h cache duration in seconds
    cache_remote_files: true,
    cache_remote_duration: 86400, // 1d cache duration in seconds
    enlarge_image: false, // avoid upscaling of images when given size is bigger then current image size
    systems: {},
};
