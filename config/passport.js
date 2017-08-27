import User from './../models/user';
import passport from 'passport';
import passportJWT from './passport.jwt';
import passportGithub from './passport.github';

passport.use(passportJWT);
passport.use(passportGithub);

export default passport;
