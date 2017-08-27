import requireAuth from './requireAuth';
import github from './github';

export default {
    requireAuth: requireAuth,
    githubLogin: github.githubLogin,
    githubLoginCb: github.githubLoginCb
};