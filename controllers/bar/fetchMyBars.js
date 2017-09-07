import Bar from './../../models/bar';
import helpers from './helpers';

export default (req, res, next) => {
    if (!req.user) {
        res.status(500).send({ error: 'Logged-in user cannot be found.' });
        return next();
    }
    let userId = req.user.id;
    Bar.find({ userId: userId })
        .sort('-createdAt')
        .exec((err, bars) => {
            if (err) {
                res.send({ error: err });
                return next(err);
            }

            helpers.fetchGoingBars(req.user.id, (err, goingBars) => {
                if (err) {
                    res.status(err.status).send({ error: err.message });
                    return next();
                }

                return res.status(200).json({
                    bars: bars,
                    goingBars: goingBars
                });
            });
        });
};