import Bar from './../../models/bar';
import moment from 'moment';

let startOfToday = moment.utc().startOf('day').toDate(); // set to 12:00 am today
const helpers = {
    fetchGoingBars: (userId, callback) => {
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
        .exec((err, bars) => {
            if (err) {
                return callback({
                    status: 404,
                    message: `Bars with user ID ${userId} cannot be found.`
                });
            }

            return callback(null, bars);
        });
    },
    goingTotals: (callback) => {
        Bar.aggregate()
            .match({ createdAt: { $gte: startOfToday } })
            .group({ _id: "$placeId", count: {$sum: 1} })
            .exec((err, totals) => {
                if (err) {
                    return callback({
                        status: 404,
                        message: 'Totals cannot be counted.'
                    });
                }

                return callback(null, totals);
            });
    }
};

export default helpers;