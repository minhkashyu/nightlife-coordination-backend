import passport from './../../config/passport';

export default (req, res, next) => passport.authenticate('jwt', { session: false }, (err, user) => {
    if (!err && user) {
        req.user = user;
    }
    next();
})(req, res, next);