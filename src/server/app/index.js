/**
 * Created on 4/12/21 by jovialis (Dylan Hanson)
 **/

const express = require("express");
const cors = require('cors');

const bodyParser = require("body-parser");
const logger = require("morgan");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const path = require("path");
const config = require('../config');

const userState = require('./utils/userState');

// Setup our Express pipeline
let app = express();

if (config.PRODUCTION) {
    app.use(cors());
}

app.use(logger(config.DEVELOPMENT ? "dev" : "short"));

// JSON parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// Sessions support
app.use(session({
    name: "auth.id",
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: config.PRODUCTION,
    store: new MongoStore({
        mongoUrl: config.MONGODB_URI
    }),
    cookie: {
        path: "/",
        httpOnly: true,
        secure: config.PRODUCTION,
        domain: config.SESSION_DOMAIN
    }
}));

const loadRespondent = require('./middleware/loadRespondent');
loadRespondent(app);

// Register routes
const apiRouter = require('./routes');
app.use('/api', apiRouter);

// Set up frontend engine
app.engine("pug", require("pug").__express);
app.set("views", __dirname);
app.use(express.static(path.join(__dirname, '../../../public')));

// Give them the SPA base page
app.get("*", async (req, res) => {

    const respondent = req.session.respondent;
    const state = await userState.getUserState(respondent);

    console.log(`Loading app for: ${respondent ? respondent.respondentId : "nobody!"}`);
    let preloadedState = {
        state,
        respondent: respondent && respondent.respondentId,
        zip: respondent && respondent.zip
    };

    preloadedState = JSON.stringify(preloadedState);
    res.render("../../client/base.pug", {
        state: preloadedState
    });
});

module.exports = app;