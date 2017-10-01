import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
let assert = chai.assert;
import {describe, beforeEach, afterEach, it} from 'mocha';
import _ from 'lodash';

import moment from 'moment';
import auth from './../../config/auth';
let app = require('./../../../server');
let server;

let newBar = {
    placeId: 'ChIJO0bSoEx344kRMru3kL4jHzU',
    name: 'Hops Test Kitchen & Raw Bar',
    address: '1248 Cambridge St, Cambridge, MA 02139, United States'
};

describe('GET /api/bars', () => {
    beforeEach(done => {
        server = app.server;
        done();
    });

    afterEach(done => {
        server.close(done);
    });

    const callApi = () => chai.request(server).get('/api/bars');

    it('it should NOT fetch my bars without authorization', done => {
        callApi()
            .end((err, res) => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'You are not authorised to do this. Please log in.');
                done();
            });
    });

    it('it should fetch my bars', done => {
        auth.loginAsGithubUser(server)
            .end((err, res) => {
                assert.equal(err, null);

                let user = res.body.user;
                let startOfToday = moment.utc().startOf('day').toDate();
                callApi()
                    .set('Authorization', res.body.token)
                    .end((err, res) => {
                        assert.equal(err, null);
                        assert.equal(res.status, 200);

                        let bars = res.body.bars;
                        assert.equal(bars.length, 5);
                        _.forEach(bars, bar => {
                            assert.equal(bar.userId, user.id);
                        });

                        assert.equal(res.body.goingBars.length, 1);
                        let goingBar = res.body.goingBars[0];
                        assert.equal(goingBar.placeId, newBar.placeId);
                        assert.equal(goingBar.name, newBar.name);
                        assert.equal(goingBar.address, newBar.address);
                        assert.equal(goingBar.userId, user.id);
                        assert.isOk(moment(goingBar.createdAt).toDate() > startOfToday);
                        assert.isOk(moment(goingBar.updatedAt).toDate() > startOfToday);

                        done();
                    });
            });

    });
});