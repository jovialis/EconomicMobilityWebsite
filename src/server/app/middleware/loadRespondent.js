/**
 * Created on 5/14/21 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');
const Respondent = mongoose.model('Respondent');
const HomeSample = mongoose.model('HomeSample');

const loginRespondent = require('../utils/loginRespondent');
const validateZIP = require('../utils/validateZIP');

module.exports = app => {

    /**
     * Assigns a respondent ID based on a direct link from the survey.
     * @param {req.query.respondent}
     */
    app.use(async (req, res, next) => {

        if (
            req.query.r &&
            (!req.session.respondent || req.session.respondent.respondentId !== req.query.r)
        ) {
            const respondentId = req.query.r;

            try {
                // Attempt to login the user and return the results.
                const loginRes = await loginRespondent(respondentId);
                req.session.respondent = loginRes.respondent;
            } catch (err) {
                console.log(err);
            }
        }

        if (
            req.query.z &&
            req.session.respondent &&
            (!req.session.respondent.zip || req.session.respondent.zip !== req.query.z) &&
            (await HomeSample.countDocuments({respondent: req.session.respondent})) < 1
        ) {
            const zip = req.query.z;

            try {
                // Validate zip
                await validateZIP(zip);

                // Update the user's ZIP
                req.session.respondent.zip = zip;
                await Respondent.updateOne({
                    respondentId: req.session.respondent.respondentId
                }, {
                    zip
                });
            } catch (err) {
                console.log(err);
            }
        }

        return next();

    });

};