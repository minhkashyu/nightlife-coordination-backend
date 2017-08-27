import jwt from 'jsonwebtoken';
import config from './../../config/main';
import User from './../../models/user';

const helpers = {
    generateToken: user => {
        return jwt.sign(user, config.secret, {
            expiresIn: 10800 // 3 hrs
        });
    },
    setGithubInfo: user => {
        return {
            id         : user.id,
            username   : user.github.username,
            name       : user.github.displayName,
            email      : user.github.email
        };
    }
};

export default helpers;