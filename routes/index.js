import express from 'express';
import userController from './../controllers/user/index';
import googleController from './../controllers/google/index';

export default (app) => {
    const apiRoutes = express.Router();
    const authRoutes = express.Router();

    app.use('/api', apiRoutes);

    //=========================
    // Auth Routes
    //=========================
    apiRoutes.use('/auth', authRoutes);

    // GET /api/auth/github
    authRoutes.get('/github', userController.githubLogin);
    authRoutes.get('/github/callback', userController.githubLoginCb);
    authRoutes.get('/loginSuccess', userController.requireAuth, userController.loginSuccess);

    //=========================
    // Google Places Routes
    //=========================

    apiRoutes.get('/places/:query', googleController.getBars);
    apiRoutes.get('/places', googleController.getBars);
};