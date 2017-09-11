import async from 'async';
import Bar from './../../models/bar';
import helpers from './helpers';

const validateContext = (context, callback) => {
    if (!context.placeId) {
        return callback({
            status: 400,
            message: 'Place ID is needed.'
        });
    }
    if (!context.name) {
        return callback({
            status: 400,
            message: 'Bar name is needed.'
        });
    }
    if (!context.address) {
        return callback({
            status: 400,
            message: 'Bar address is needed.'
        });
    }
    if (!context.user) {
        return callback({
            status: 400,
            message: 'Logged-in user cannot be found.'
        });
    }

    callback(null, context);
};

const saveBar = (context, callback) => {
    const bar = new Bar({
        placeId: context.placeId,
        userId: context.user.id,
        name: context.name,
        address: context.address
    });

    bar.save((err, newBar) => {
        if (err) {
            return callback({
                status: 422,
                message: 'Cannot add new bar to the database.'
            });
        }

        context.newBar = newBar;
        callback(null, context);
    });
};

export default (req, res, next) => {
    async.waterfall([
        async.constant({
            placeId: req.body.placeId,
            name: req.body.name,
            address: req.body.address,
            user: req.user
        }),
        validateContext,
        saveBar,
        helpers.fetchGoingBars,
        helpers.fetchGoingTotals
    ], (err, result) => {
        if (err) {
            res.status(err.status).send({ error: err.message });
            return next();
        }

        return res.status(200).json({
            bar: result.newBar,
            goingBars: result.goingBars,
            goingTotals: result.goingTotals
        });
    });
};