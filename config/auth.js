export default {
    'githubAuth': {
        'clientID': process.env.GITHUB_KEY,
        'clientSecret': process.env.GITHUB_SECRET,
        'callbackURL': process.env.API_URL + '/auth/github/callback'
    }
};