/* Copyright D. Ryan @2019 - All rights reserved */

const express = require('express');
const router = express.Router();

const Joi = require('joi');

const mongoose = require('mongoose');
const Respondent = mongoose.model('Respondent');
const Home = mongoose.model('Home');

const userState = require('../helpers/userState');

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
            respondent: req.session.respondent.respondentId,
            zip: req.session.respondent.zip
        });
    }

    // Validation schema
    const schema = Joi.object({
        respondentId: Joi.string().alphanum().min(4).max(10)
    });

    const validation = schema.validate(req.body);
    if (validation.error) {
        return res.status(400).json({error: "Invalid respondent ID provided."});
    }

    const respondentId = validation.value.respondentId.toLowerCase();

    // Check if a respondent by that ID already exists.
    const existingRespondent = await Respondent.findOne({ respondentId })
    if (existingRespondent) {
        // Update last login
        await Respondent.updateOne({_id: existingRespondent._id}, {
            lastLogin: Date.now()
        });

        // Store the session
        req.session.respondent = existingRespondent;
        return res.status(200).json({
            state: await userState.getUserState(existingRespondent),
            respondent: existingRespondent.respondentId,
            zip: existingRespondent.zip
        });
    }

    // Otherwise, generate a new respondent document and save it
    req.session.respondent = await Respondent.create({
        respondentId,
        experimentalGroup: Math.ceil(Math.random()*4),
    });

    res.status(200).json({
        state: await userState.getUserState(req.session.respondent),
        respondent: req.session.respondent.respondentId,
        zip: req.session.respondent.zip
    });
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

    // Validate the ZIP code.
    // Count the number of homes
    const numHomes = await Home.countDocuments({zip});
    if (numHomes < 1) {
        return res.status(404).json({error: "We don't have enough data on that ZIP code."});
    }

    // Make sure there are enough homes of the right types in that ZIP code.
    const numRich = await Home.countDocuments({zip, classification: 'rich'});
    const numMedium = await Home.countDocuments({zip, classification: 'medium'});
    const numPoor = await Home.countDocuments({zip, classification: 'poor'});

    if (numRich < 10 || numMedium < 10 || numMedium < 10) {
        console.log(`Not enough homes with each classification in the zipcode ${req.params.zipcode}`);
        console.log("Poor count: " + numPoor + ", Medium count: " + numMedium + ", Rich count: " + numRich);
        return res.status(400).json({error: "We don't have enough data on that ZIP code."});
    }

    // We've successfully validated everything, so now let's update the respondent's ZIP
    req.session.respondent.zip = zip;

    res.status(200).json({
        state: await userState.getUserState(req.session.respondent),
        zip
    });
});

module.exports = router;