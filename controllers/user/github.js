import passport from './../../config/passport';
import helpers from './helpers';
import config from './../../config/main';

export default {
    githubLogin: passport.authenticate('github', { scope : 'user:email', session: false }),
    githubLoginCb: (req, res, next) => passport.authenticate('github', { session: false }, (err, user) => {
        if (err || !user) {
            res.status(400).json({ error: 'Cannot connect to Github.' });
            return next();
        }

        const userInfo = helpers.setGithubInfo(user);
        const token = `JWT ${helpers.generateToken(userInfo)}`;
        res.redirect(301, config.client_url + '/login-success/github/' + token);
    })(req, res, next)
};