import requireAuth from './requireAuth';
import github from './github';
import loginSuccess from './loginSuccess';

export default {
    requireAuth: requireAuth,
    githubLogin: github.githubLogin,
    githubLoginCb: github.githubLoginCb,
    loginSuccess: loginSuccess
};