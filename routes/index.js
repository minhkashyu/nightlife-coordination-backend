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

    //=========================
    // Google Places Routes
    //=========================
    // fetchBars(query, isAuthenticated)
    apiRoutes.get('/places/:query', barController.fetchGoogleBars);
    apiRoutes.get('/places', barController.fetchGoogleBars);

    //TODO: /places/loggedin did not return { error: 'Please enter a search keyword.' }
    apiRoutes.get('/places/loggedin/:query', userController.requireAuth, barController.fetchGoogleBars);
    apiRoutes.get('/places/loggedin', userController.requireAuth, barController.fetchGoogleBars);

    //=========================
    // Bar Routes
    //=========================

    // fetchMyBars()
    apiRoutes.get('/bars', userController.requireAuth, barController.fetchMyBars);
    // addBar(placeId)
    apiRoutes.post('/bars', userController.requireAuth, barController.addBar);
    // removeBar(barId)
    apiRoutes.delete('/bars/:barId', userController.requireAuth, barController.removeBar);
};