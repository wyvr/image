const valid = require('./../valid');
module.exports = {
    /**
     * Returns the value as number or the default value
     * @param {string} value
     * @param {number} default_value
     * @returns number
     */
    number(value, default_value) {
        if (!valid.is_filled_string(value)) {
            return default_value;
        }
        const intval = parseInt(value + '', 10);
        if (!isNaN(intval)) {
            return intval;
        }
        return default_value;
    },
    /**
     * Returns the value as number between from and to(exklusive the given values) or the default value
     * @param {string} value
     * @param {number} default_value
     * @param {number} from
     * @param {number} to
     * @returns number
     */
    number_between(value, default_value, from, to) {
        const intval = this.number(value + '', default_value);

        if (intval > to) {
            return to;
        }
        if (intval < from) {
            return from;
        }
        return intval;
    },
    /**
     * Returns the given value when contained in the allowed values and replaces aliases or returns the default value
     * @param {string} value
     * @param {any} default_value
     * @param {string[]} allowed_values
     * @param {object} aliases
     * @returns string|any
     */
    string_allowed(value, default_value, allowed_values, aliases) {
        if (!valid.is_filled_string(value)) {
            return default_value;
        }
        let result = value.trim().toLowerCase();

        // allow aliasing
        if (aliases && aliases[result]) {
            result = aliases[result];
        }

        if (!valid.is_filled_string(result)) {
            return default_value;
        }
        // check if value is in the allowed values
        if (!allowed_values || !Array.isArray(allowed_values) || allowed_values.indexOf(result) == -1) {
            return default_value;
        }
        return result;
    },
    /**
     * Returns an object from the value, to extract complex instructions or the default value
     * @param {string} value
     * @param {any} default_value
     * @param {string[]} allowed_values
     * @returns object
     */
    split_string_to_object(value, default_value, allowed_values) {
        if (!value || typeof value != 'string') {
            return default_value;
        }

        let data = null;
        // e.g. blur:10,negate
        value.split(',').forEach((filter) => {
            if (!valid.is_filled_string(filter)) {
                return default_value;
            }
            // e.g. blur:10
            const parts = filter
                .trim()
                .toLowerCase()
                .split(':')
                .map((part) => part.trim().toLowerCase());
            // allow only known filters when available
            if (parts.length == 0 || allowed_values.indexOf(parts[0]) == -1) {
                return;
            }
            // convert to object to contain values
            if (!data) {
                data = {};
            }
            switch (parts.length) {
                case 1:
                    data[parts[0]] = true;
                    return;
                case 2:
                    data[parts[0]] = parseFloat(parts[1]);
                    if (isNaN(data[parts[0]])) {
                        data[parts[0]] = false;
                    }
                    return;
            }
        });
        if (data == null) {
            return default_value;
        }
        return data;
    },
    /**
     * Returns an array of allowed position x and y coordinates, ordered by X@0 Y@1
     * @param {string} value
     * @param {string[2]} default_position
     * @param {string[]} allowed_horizontal_positions
     * @param {string[]} allowed_vertical_positions
     * @returns string[2]
     */
    position_value(value, default_position, allowed_horizontal_positions, allowed_vertical_positions) {
        if (!valid.is_filled_string(value)) {
            return default_position;
        }
        // remove spaces and normalize positions
        const position = value
            .split(',')
            .map((p) => p.trim().toLowerCase())
            .filter(Boolean);
        // correct double names
        const stringified_position = JSON.stringify(position);
        if (JSON.stringify(['center', 'center']) === stringified_position) {
            position[1] = 'middle';
        }
        if (JSON.stringify(['middle', 'middle']) === stringified_position) {
            position[0] = 'center';
        }
        // order the positions
        const ordered_position = [];
        position.forEach((p) => {
            if (allowed_horizontal_positions.indexOf(p) > -1 && !ordered_position[0]) {
                ordered_position[0] = p;
                return;
            }
            if (allowed_vertical_positions.indexOf(p) > -1 && !ordered_position[1]) {
                ordered_position[1] = p;
                return;
            }
        });
        // no values left return default
        if (ordered_position.length == 0) {
            return default_position;
        }
        // fill up with default values
        default_position.map((value, index) => {
            if (!ordered_position[index]) {
                ordered_position[index] = value;
            }
        });

        return ordered_position;
    },
};
