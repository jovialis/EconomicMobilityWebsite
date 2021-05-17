/* Copyright D. Ryan @2019 - All rights reserved */

const express = require('express');
const router = express.Router();

const Joi = require('joi');

const mongoose = require('mongoose');
const Respondent = mongoose.model('Respondent');
const Home = mongoose.model('Home');
const Rating = mongoose.model('Rating');

const userState = require('../utils/userState');

const loginRespondent = require('../utils/loginRespondent');

const validateZIP = require('../utils/validateZIP');

/*
 * Logging a respondent in / creating a respondent
 * @param {req.body.respondentId}
 * @return {200 || 403}
 */
router.post("/login", async (req, res, next) => {
    // Respondent already logged in? Ignore
    if (req.session.respondent) {
        return res.status(200).json({
            state: await userState.getUserState(req.session.respondent),
            respondent: req.session.respondent.respondentId
        });
    }

    try {
        // Attempt to login the user and return the results.
        const loginRes = await loginRespondent(req.body.respondentId);
        req.session.respondent = loginRes.respondent;

        return res.status(200).json({
            respondent: loginRes.respondent.respondentId,
            state: loginRes.state
        });
    } catch (err) {
        return res.status(400).json({error: err.message});
    }
});

/**
 * Sets a user's ZIP code
 */
router.post('/zip', async (req, res, next) => {
    // No respondent? Ignore
    if (!req.session.respondent) {
        return res.status(401).json({error: "You are not logged in. Please refresh the page."});
    }

    // Fail if the respondent has already set their ZIP code
    if (req.session.respondent.zip) {
        return res.status(400).json({ error: 'You already set your ZIP code. Please refresh the page.' });
    }

    // Validation schema
    const schema = Joi.object({
        zip: Joi.string().pattern(new RegExp('^[0-9]{5}$'))
    });

    const validation = schema.validate(req.body);
    if (validation.error) {
        return res.status(400).json({error: "That doesn't look like a ZIP code!"});
    }

    // Parse as a number
    const zip = validation.value.zip;

    // Make sure the ZIP is valid
    try {
        await validateZIP(zip);
    } catch (e) {
        return res.status(400).json({error: e.message});
    }

    // We've successfully validated everything, so now let's update the respondent's ZIP
    req.session.respondent.zip = zip;
    await Respondent.updateOne({
        _id: req.session.respondent._id
    }, {
        zip
    });

    res.status(200).json({
        state: await userState.getUserState(req.session.respondent),
        zip
    });
});


/**
 * Returns true/false depending on whether a respondent with the given ID has completed the survey
 * @param {req.query.id}
 */
router.post("/completed", async (req, res, next) => {
    const respondentId = req.query.id;

    // Attempts to find a respondent by that ID.
    const respondent = await Respondent.findOne({respondentId});
    if (!respondent) {
        return res.json({complete: false});
    }

    // Returns complete if there's a corresponding Rating document.
    return res.json({
        complete: (await Rating.countDocuments({respondent}) > 0)
    })
});


module.exports = router;