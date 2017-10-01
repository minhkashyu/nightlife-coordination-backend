import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
let assert = chai.assert;
import {describe, beforeEach, afterEach, it} from 'mocha';

import moment from 'moment';
import auth from './../../config/auth';
let app = require('./../../../server');
let server;

let newBar = {
    placeId: 'ChIJO0bSoEx344kRMru3kL4jHzU',
    name: 'Hops Test Kitchen & Raw Bar',
    address: '1248 Cambridge St, Cambridge, MA 02139, United States'
};

describe('POST /api/bars', () => {
    beforeEach(done => {
        server = app.server;
        done();
    });

    afterEach(done => {
        server.close(done);
    });

    const callApi = (token) => chai.request(server).post('/api/bars').set('Authorization', token);

    it('it should NOT add new bar without authorization', (done) => {
        chai.request(server)
            .post('/api/bars')
            .send(newBar)
            .end((err, res) => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'You are not authorised to do this. Please log in.');
                done();
            });
    });

    it('it should NOT add new bar with invalid token', (done) => {
        callApi('123456')
            .send(newBar)
            .end((err, res) => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'You are not authorised to do this. Please log in.');
                done();
            });
    });

    it('it should NOT add new bar without placeId', (done) => {
        auth.loginAsGithubUser(server)
            .end((err, res) => {
                callApi(res.body.token)
                    .send({
                        name: newBar.name,
                        address: newBar.address
                    })
                    .end((err, res) => {
                        assert.equal(res.status, 400);
                        assert.equal(res.body.error, 'Place ID is needed.');
                        done();
                    });
            });
    });

    it('it should NOT add new bar without bar name', (done) => {
        auth.loginAsGithubUser(server)
            .end((err, res) => {
                callApi(res.body.token)
                    .send({
                        placeId: newBar.placeId,
                        address: newBar.address
                    })
                    .end((err, res) => {
                        assert.equal(res.status, 400);
                        assert.equal(res.body.error, 'Bar name is needed.');
                        done();
                    });
            });
    });

    it('it should NOT add new bar without bar address', (done) => {
        auth.loginAsGithubUser(server)
            .end((err, res) => {
                callApi(res.body.token)
                    .send({
                        placeId: newBar.placeId,
                        name: newBar.name
                    })
                    .end((err, res) => {
                        assert.equal(res.status, 400);
                        assert.equal(res.body.error, 'Bar address is needed.');
                        done();
                    });
            });
    });

    it('it should add new bar', (done) => {
        auth.loginAsGithubUser(server)
            .end((err, res) => {
                let user = res.body.user;
                let startOfToday = moment.utc().startOf('day').toDate();
                callApi(res.body.token)
                    .send(newBar)
                    .end((err, res) => {
                        assert.equal(err, null);
                        assert.equal(res.status, 200);

                        let bar = res.body.bar;
                        assert.equal(bar.placeId, newBar.placeId);
                        assert.equal(bar.userId, user.id);
                        assert.equal(bar.name, newBar.name);
                        assert.equal(bar.address, newBar.address);

                        assert.equal(res.body.goingBars.length, 1);
                        let goingBar = res.body.goingBars[0];
                        assert.equal(goingBar.placeId, newBar.placeId);
                        assert.equal(goingBar.name, newBar.name);
                        assert.equal(goingBar.address, newBar.address);
                        assert.equal(goingBar.userId, user.id);
                        assert.isOk(moment(goingBar.createdAt).toDate() > startOfToday);
                        assert.isOk(moment(goingBar.updatedAt).toDate() > startOfToday);

                        let goingTotals = res.body.goingTotals;
                        assert.equal(goingTotals.length, 1);
                        assert.equal(goingTotals[0]._id, bar.placeId);
                        assert.equal(goingTotals[0].count, 1);

                        done();
                    });
            });
    });
});