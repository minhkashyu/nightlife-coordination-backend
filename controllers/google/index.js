require('es6-promise').polyfill();
import superagentPromisePlugin from 'superagent-promise-plugin';
import superagent from 'superagent';
let request = superagentPromisePlugin.patch(superagent);

import config from './../../config/main';

export default {
    getBars: (req, res, next) => {
        let query = req.params.query;
        let min = 3;
        if (!query || query === 'undefined' || query === 'null') {
            return res.status(400).json({ error: 'Please enter a search keyword.' });
        }
        if (query.length < min) {
            return res.status(400).json({ error: `Search Keyword must be ${min} characters or more` })
        }

        let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&type=bar&key=${config.google_api_key}`;
        request.get(url)
            .end((err, response) => {
                if (err) {
                    return next(err);
                }

                res.status(200).json({ results: response.body.results });
            });
    }
};