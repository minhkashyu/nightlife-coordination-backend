require('es6-promise').polyfill();
import superagentPromisePlugin from 'superagent-promise-plugin';
import superagent from 'superagent';
let request = superagentPromisePlugin.patch(superagent);

import config from './../../config/main';
import helpers from './../bar/helpers';

export default (req, res, next) => {
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
            if (req.user) {
                helpers.fetchGoingBars(req.user.id, (err, goingBars) => {
                    if (err) {
                        res.status(err.status).send({ error: err.message });
                        return next();
                    }

                    helpers.goingTotals((err, goingTotals) => {
                        if (err) {
                            res.status(err.status).send({ error: err.message });
                            return next();
                        }

                        return res.status(200).json({
                            bars: response.body.results,
                            goingBars: goingBars,
                            goingTotals: goingTotals
                        });
                    });
                });
            }
            else {
                helpers.goingTotals((err, goingTotals) => {
                    if (err) {
                        res.status(err.status).send({error: err.message});
                        return next();
                    }

                    return res.status(200).json({
                        bars: response.body.results,
                        goingBars: [],
                        goingTotals: goingTotals
                    });
                });
            }
        });
};