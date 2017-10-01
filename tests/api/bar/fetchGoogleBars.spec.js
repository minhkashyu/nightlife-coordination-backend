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

let query = 'West End, Queensland, Australia';
let min = 3;
let newBar = {
    placeId: 'ChIJO0bSoEx344kRMru3kL4jHzU',
    name: 'Hops Test Kitchen & Raw Bar',
    address: '1248 Cambridge St, Cambridge, MA 02139, United States'
};

describe('GET /api/places/:query', () => {
    beforeEach(done => {
        server = app.server;
        done();
    });

    afterEach(done => {
        server.close(done);
    });

    const callApi = (query) => chai.request(server).get(`/api/places/${query}`);

    it('it should NOT fetch google bars without a search keyword', done => {
        callApi('')
            .end((err, res) => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Please enter a search keyword.');
                done();
            });
    });

    it(`it should NOT fetch google bars if search keyword is less then ${min} characters`, done => {
        callApi('te')
            .end((err, res) => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, `Search Keyword must be ${min} characters or more`);
                done();
            });
    });

    it('it should fetch google bars without authorization', done => {
        callApi(query)
            .end((err, res) => {
                assert.equal(err, null);
                assert.equal(res.status, 200);
                assert.isOk(res.body.bars.length > 0);
                assert.equal(res.body.goingBars.length, 0);
                assert.equal(res.body.goingTotals.length, 1);
                assert.equal(res.body.goingTotals[0]._id, newBar.placeId);
                assert.equal(res.body.goingTotals[0].count, 1);
                done();
            });
    });

    it('it should fetch google bars with authorization', done => {
        auth.loginAsGithubUser(server)
            .end((err, res) => {
                let user = res.body.user;
                let startOfToday = moment.utc().startOf('day').toDate();
                callApi(query)
                    .set('Authorization', res.body.token)
                    .end((err, res) => {
                        assert.equal(err, null);
                        assert.equal(res.status, 200);
                        assert.isOk(res.body.bars.length > 0);

                        assert.equal(res.body.goingBars.length, 1);
                        let goingBar = res.body.goingBars[0];
                        assert.equal(goingBar.placeId, newBar.placeId);
                        assert.equal(goingBar.name, newBar.name);
                        assert.equal(goingBar.address, newBar.address);
                        assert.equal(goingBar.userId, user.id);
                        assert.isOk(moment(goingBar.createdAt).toDate() > startOfToday);
                        assert.isOk(moment(goingBar.updatedAt).toDate() > startOfToday);

                        assert.equal(res.body.goingTotals.length, 1);
                        assert.equal(res.body.goingTotals[0]._id, newBar.placeId);
                        assert.equal(res.body.goingTotals[0].count, 1);
                        done();
                    });
            });

    });
});