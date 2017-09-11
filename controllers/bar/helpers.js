import Bar from './../../models/bar';
import moment from 'moment';

let startOfToday = moment.utc().startOf('day').toDate(); // set to 12:00 am today
const helpers = {
    fetchGoingBars: (context, callback) => {
        let userId = context.user.id;
        if (!userId || userId === 'undefined' || userId === 'null') {
            return callback({
                status: 400,
                message: 'User ID is needed.'
            });
        }

        Bar.find({
            userId: userId,
            createdAt: { $gte: startOfToday }
        })
            .exec((err, goingBars) => {
                if (err) {
                    return callback({
                        status: 404,
                        message: `Cannot fetch going bars with user ID ${userId}.`
                    });
                }

                context.goingBars = goingBars;
                callback(null, context);
            });
    },
    fetchGoingTotals: (context, callback) => {
        Bar.aggregate()
            .match({ createdAt: { $gte: startOfToday } })
            .group({ _id: "$placeId", count: {$sum: 1} })
            .exec((err, goingTotals) => {
                if (err) {
                    return callback({
                        status: 404,
                        message: 'Cannot fetch going totals.'
                    });
                }

                context.goingTotals = goingTotals;
                callback(null, context);
            });
    }
};

export default helpers;