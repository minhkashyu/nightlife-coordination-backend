import helpers from './helpers';

export default (req, res, next) => {
    const token = `JWT ${helpers.generateToken(req.body)}`;
    res.status(200).json({
        token: token,
        user: req.body
    });
    return next();
};