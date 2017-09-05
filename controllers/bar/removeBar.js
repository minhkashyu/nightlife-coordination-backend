import Bar from './../../models/bar';
import helpers from './helpers';

export default (req, res, next) => {
    let barId = req.params.barId;
    if (!barId || barId === 'undefined' || barId === 'null') {
        return callback({
            status: 400,
            message: 'Bar ID is needed.'
        });
    }
    if (!req.user) {
        res.status(500).send({ error: 'Logged-in user cannot be found.' });
        return next();
    }
    Bar.findOne({ _id: barId })
        .exec((err, bar) => {
            if (err) {
                res.status(err.status).send({ error: err.message });
                return next();
            }

            bar.remove(err => {
                if (err) {
                    res.send({ error: err });
                    return next(err);
                }

                helpers.fetchGoingBars(req.user.id, (err, goingBars) => {
                    if (err) {
                        res.status(err.status).send({ error: err.message });
                        return next();
                    }

                    helpers.goingTotals((err, goingTotals) => {
                        if (err) {
                            res.status(err.status).send({error: err.message});
                            return next();
                        }

                        return res.status(200).json({
                            bar: {},
                            goingBars: goingBars,
                            goingTotals: goingTotals
                        });
                    });
                });
            });
    });
};