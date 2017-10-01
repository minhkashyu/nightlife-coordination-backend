import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
let assert = chai.assert;
import {describe, beforeEach, afterEach, it} from 'mocha';

import moment from 'moment';
import auth from './../../config/auth';
import Bar from './../../../models/bar';
let app = require('./../../../server');
let server;

let newBar = {
    placeId: 'ChIJO0bSoEx344kRMru3kL4jHzU',
    name: 'Hops Test Kitchen & Raw Bar',
    address: '1248 Cambridge St, Cambridge, MA 02139, United States'
};
let testBarId = '123456';

describe('DELETE /api/bars/:barId', () => {
    beforeEach(done => {
        server = app.server;
        done();
    });

    afterEach(done => {
        server.close(done);
    });

    const callApi = (token, barId) => chai.request(server).delete(`/api/bars/${barId}`).set('Authorization', token);

    it('it should NOT remove bar without authorization', (done) => {
        chai.request(server)
            .delete(`/api/bars/${testBarId}`)
            .end((err, res) => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'You are not authorised to do this. Please log in.');
                done();
            });
    });

    it('it should NOT remove bar with invalid token', (done) => {
        callApi('123456', testBarId)
            .end((err, res) => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'You are not authorised to do this. Please log in.');
                done();
            });
    });

    it('it should NOT remove bar without barId', (done) => {
        auth.loginAsGithubUser(server)
            .end((err, res) => {
                assert.isNull(err);

                callApi(res.body.token)
                    .end((err, res) => {
                        assert.equal(res.status, 400);
                        assert.equal(res.body.error, 'Bar ID is needed.');
                        done();
                    });
            });
    });

    it('it should NOT remove bar with wrong barId', (done) => {
        auth.loginAsGithubUser(server)
            .end((err, res) => {
                assert.isNull(err);

                callApi(res.body.token, testBarId)
                    .end((err, res) => {
                        assert.equal(res.status, 404);
                        assert.equal(res.body.error, `Bar with ID ${testBarId} cannot be found.`);
                        done();
                    });
            });
    });

    it('it should remove bar', (done) => {
        auth.loginAsGithubUser(server)
            .end((err, res) => {
                assert.isNull(err);

                Bar.findOne({ name: newBar.name })
                    .exec((err, bar) => {
                        assert.isNull(err);

                        let barId = bar.id;

                        callApi(res.body.token, barId)
                            .end((err, res) => {
                                assert.isNull(err);
                                assert.equal(res.status, 200);
                                assert.isEmpty(res.body.bar);
                                assert.lengthOf(res.body.goingBars, 0);
                                assert.lengthOf(res.body.goingTotals, 0);

                                Bar.findOne({ _id: barId }, (err, bar) => {
                                    assert.isNull(err);
                                    assert.isNull(bar);

                                    done();
                                });
                            });
                    });
            });
    });
});