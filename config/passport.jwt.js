import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from './../models/user';
import config from './main';

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    process.nextTick(() => {
        User.findById(payload.id, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            return done(null, user)
        });
    });
});

export default jwtLogin;