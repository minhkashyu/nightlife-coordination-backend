import async from 'async';
import Bar from './../../models/bar';
import helpers from './helpers';

const fetchMyBars = (context, callback) => {
    let userId = context.user.id;
    Bar.find({ userId: userId })
        .sort('-createdAt')
        .exec((err, myBars) => {
            if (err) {
                return callback({
                    status: 404,
                    message: 'Cannot fetch my bars.'
                });
            }

            context.myBars = myBars;
            callback(null, context);
        });
};

export default (req, res, next) => {
    async.waterfall([
        async.constant({
            user: req.user
        }),
        fetchMyBars,
        helpers.fetchGoingBars
    ], (err, result) => {
        if (err) {
            res.status(err.status).send({ error: err.message });
            return next();
        }

        return res.status(200).json({
            bars: result.myBars,
            goingBars: result.goingBars
        });
    });
};