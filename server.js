import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
require('dotenv').config({ silent: true });

let app = express();
app.set('trust proxy', true); // Tell Express to use the remote IP address
const config = require('./config/main').default;
const router = require('./routes/index').default;

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
    useMongoClient: true
})
.then(() => {
    console.log('Mongoose default connection is open to ' + config.database);
})
.catch((error) => {
    console.log('error connecting to db: ' + error);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
if (app.get('env') === 'production') {
    app.use(logger('combined'));
}
if (app.get('env') === 'development') {
    app.use(logger('dev'));
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS, HEAD');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, Media');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

router(app);

let server = app.listen(config.port, err => {
    if (err) {
        return console.error(err);
    }

    console.log('The server is listening on port %s', config.port);
});

module.exports = {
    server: server
};