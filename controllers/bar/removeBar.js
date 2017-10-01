import async from 'async';
import Bar from './../../models/bar';
import helpers from './helpers';

const validateContext = (context, callback) => {
    let barId = context.barId;
    if (!barId || barId === 'undefined') {
        return callback({
            status: 400,
            message: 'Bar ID is needed.'
        });
    }

    callback(null, context);
};

const removeBar = (context, callback) => {
    let barId = context.barId;
    Bar.findOne({ _id: barId })
        .exec((err, bar) => {
            if (err || !bar) {
                return callback({
                    status: 404,
                    message: `Bar with ID ${barId} cannot be found.`
                });
            }

            bar.remove(err => {
                if (err) {
                    return callback({
                        status: 422,
                        message: `Cannot remove bar with ID ${barId}.`
                    });
                }

                callback(null, context);
            });
        });
};

export default (req, res, next) => {
    async.waterfall([
        async.constant({
            user: req.user,
            barId: req.params.barId
        }),
        validateContext,
        removeBar,
        helpers.fetchGoingBars,
        helpers.fetchGoingTotals
    ], (err, result) => {
        if (err) {
            res.status(err.status).send({ error: err.message });
            return next();
        }

        return res.status(200).json({
            bar: {},
            goingBars: result.goingBars,
            goingTotals: result.goingTotals
        });
    });
};