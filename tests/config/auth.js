import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
import user from './user';

export default {
    loginAsGithubUser: (app) => {
        return chai.request(app)
            .post('/api/auth/login-test')
            .send(user.githubUser());
    }
}