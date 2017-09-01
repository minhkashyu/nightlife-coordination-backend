import helpers from './helpers';

export default (req, res, next) => {
    const userInfo = helpers.setGithubInfo(req.user);
    res.status(201).json({
        token: req.headers.authorization,
        user: userInfo
    });
    return next();
};