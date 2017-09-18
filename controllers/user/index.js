import requireAuth from './requireAuth';
import github from './github';
import loginSuccess from './loginSuccess';
import loginTest from './loginTest';

export default {
    requireAuth: requireAuth,
    githubLogin: github.githubLogin,
    githubLoginCb: github.githubLoginCb,
    loginSuccess: loginSuccess,
    loginTest: loginTest
};