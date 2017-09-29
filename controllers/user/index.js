import requireAuth from './requireAuth';
import checkAuth from './checkAuth';
import github from './github';
import loginSuccess from './loginSuccess';
import loginTest from './loginTest';

export default {
    requireAuth: requireAuth,
    checkAuth: checkAuth,
    githubLogin: github.githubLogin,
    githubLoginCb: github.githubLoginCb,
    loginSuccess: loginSuccess,
    loginTest: loginTest
};