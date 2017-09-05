import Bar from './../../models/bar';
import helpers from './helpers';

export default (req, res, next) => {
    if (!req.body.placeId) {
        res.status(400).send({ error: 'Place ID is needed.' });
        return next();
    }
    if (!req.user) {
        res.status(500).send({ error: 'Logged-in user cannot be found.' });
        return next();
    }
    const bar = new Bar({
        placeId: req.body.placeId,
        userId: req.user.id
    });

    bar.save((err, newBar) => {
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
                    bar: newBar,
                    goingBars: goingBars,
                    goingTotals: goingTotals
                });
            });
        });
    });
}