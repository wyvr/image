module.exports = {
    /**
     * Checks if the given value is a string and has a value
     * @param {any} value
     * @returns boolean
     */
    is_filled_string(value) {
        if (typeof value !== 'string' || value.trim() == '') {
            return false;
        }
        return true;
    },
};
