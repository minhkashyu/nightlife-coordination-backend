import express from 'express';
import userController from './../controllers/user/index';
import barController from './../controllers/bar/index';

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
    if (app.get('env') === 'test') {
        authRoutes.post('/login-test', userController.loginTest);
    }
    //=========================
    // Google Places Routes
    //=========================
    // fetchBars(query, isAuthenticated)
    apiRoutes.get('/places/:query', userController.checkAuth, barController.fetchGoogleBars);
    apiRoutes.get('/places', userController.checkAuth, barController.fetchGoogleBars);

    //=========================
    // Bar Routes
    //=========================

    // fetchMyBars()
    apiRoutes.get('/bars', userController.requireAuth, barController.fetchMyBars);
    // addBar(placeId, name, address)
    apiRoutes.post('/bars', userController.requireAuth, barController.addBar);
    // removeBar(barId)
    apiRoutes.delete('/bars/:barId', userController.requireAuth, barController.removeBar);
};