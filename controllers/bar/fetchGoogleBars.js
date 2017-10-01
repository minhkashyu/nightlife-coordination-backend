import async from 'async';
import _ from 'lodash';
import passport from './../../config/passport';

require('es6-promise').polyfill();
import superagentPromisePlugin from 'superagent-promise-plugin';
import superagent from 'superagent';
let request = superagentPromisePlugin.patch(superagent);

import config from './../../config/main';
import helpers from './../bar/helpers';

const validateContext = (context, callback) => {
    let query = context.query;
    let min = 3;
    if (!query || query === 'undefined') {
        return callback({
            status: 400,
            message: 'Please enter a search keyword.'
        });
    }
    if (query.length < min) {
        return callback({
            status: 400,
            message: `Search Keyword must be ${min} characters or more`
        });
    }

    context.query = _.escape(query);
    callback(null, context);
};

const callGoogleApi = (context, callback) => {
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${context.query}&type=bar&key=${config.google_api_key}`;
    request.get(url)
        .end((err, response) => {
            if (err) {
                return callback({
                    status: 422,
                    message: 'Error when connecting to the Google Places API.'
                });
            }

            context.googleBars = response.body.results;
            callback(null, context);
        });
};

const fetchGoingBars = (context, callback) => {
    if (context.user) {
        helpers.fetchGoingBars(context, callback);
    }
    else {
        context.goingBars = [];
        callback(null, context);
    }
};

export default (req, res, next) => {
    async.waterfall([
        async.constant({
            query: req.params.query,
            user: req.user
        }),
        validateContext,
        callGoogleApi,
        fetchGoingBars,
        helpers.fetchGoingTotals
    ], (err, result) => {
        if (err) {
            res.status(err.status).send({ error: err.message });
            return next();
        }

        return res.status(200).json({
            bars: result.googleBars,
            goingBars: result.goingBars,
            goingTotals: result.goingTotals
        });
    });
};