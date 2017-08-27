require('es6-promise').polyfill();
import superagentPromisePlugin from 'superagent-promise-plugin';
import superagent from 'superagent';
let request = superagentPromisePlugin.patch(superagent);

import config from './../../config/main';

export default {
    getBars: (req, res, next) => {
        let placeId = req.params.placeId;
        if (!placeId || placeId === 'undefined' || placeId === 'null') {
            return res.status(400).json({ error: 'Place ID is needed.' });
        }

        let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${placeId}&type=bar&key=${config.google_api_key}`;
        request.get(url)
            .end((err, response) => {
                if (err) {
                    return next(err);
                }

                res.status(200).json({ results: response.body.results });
            });
    }
};