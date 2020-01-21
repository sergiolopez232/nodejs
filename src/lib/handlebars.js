const { format } = require('timeago.js');

const helpers = {};

helpers.timeago = (created_at) => {
    return format(created_at);
};

module.exports = helpers;