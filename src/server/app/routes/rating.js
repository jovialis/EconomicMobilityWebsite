/* Copyright D. Ryan @2019 - All rights reserved */

const express = require('express');
const router = express.Router();

const Joi = require('joi');

const mongoose = require('mongoose');
const Respondent = mongoose.model('Respondent');
const Rating = mongoose.model('Rating');
const Home = mongoose.model('Home');
const HomeSample = mongoose.model('HomeSample');
const IncompleteRating = mongoose.model('IncompleteRating');

/*
  * Submit user ratings for a respondent

  * @return {200 || 403}
  */
router.post('/', async (req, res, next) => {

    // No repsondent? Not allowed
    if (!req.session.respondent) {
        return res.status(401).send({error: "Not logged in."});
    }

    // Make sure there has been a Home Sample generated.
    const sample = await HomeSample.findOne({respondent: req.session.respondent});
    if (!sample) {
        return res.status(401).send({error: "No Home Sample generated for user."});
    }

    // Validation schema
    const schema = Joi.object({

        bestAddress1: Joi.string().min(1),
        bestAddress2: Joi.string().min(1),

        worstAddress2: Joi.string().min(1),
        worstAddress1: Joi.string().min(1),

    });

    const validation = schema.validate(req.body);
    if (validation.error) {
        return res.status(400).json({error: "Invalid rating submitted."});
    }

    // Make sure that none of the values are duplicates
    const uniqueValues = [...new Set(Object.values(validation.value))];
    if (uniqueValues.length < 4) {
        return res.status(400).json({error: "You may not rank a house two times!"});
    }

    // Lookup each home:
    const ratingSchema = {
        respondent: req.session.respondent,
        homeSample: sample,

        bestAddress1: await Home.findOne({address: validation.value.bestAddress1}).select('_id'),
        bestAddress2: await Home.findOne({address: validation.value.bestAddress2}).select('_id'),
        worstAddress2: await Home.findOne({address: validation.value.worstAddress2}).select('_id'),
        worstAddress1: await Home.findOne({address: validation.value.worstAddress1}).select('_id'),
    };

    if (!ratingSchema.bestAddress1 || !ratingSchema.bestAddress2 || !ratingSchema.worstAddress1 || !ratingSchema.worstAddress2) {
        return res.status(400).json({error: "An error occurred while looking up one of the addresses."});
    }

    // Prevent double rating
    if (await Rating.exists({respondent: req.session.respondent})) {
        return res.status(401).send({error: "Cannot submit two entries."});
    }

    // Generate the rating
    await Rating.create(ratingSchema);

    console.log(`Saved the rating for respondent ${req.session.respondentId}.`);
    return res.status(200).json({state: "completed"});
});

/**
 * @param {req.body.key} bestAddress1 | bestAddress2 | worstAddress2 | worstAddress1
 * @param {req.body.value} street value
 */
router.post('/partial', async (req, res, next) => {
    // No repsondent? Not allowed
    if (!req.session.respondent) {
        return res.status(401).send({error: "Not logged in."});
    }

    // Make sure there has been a Home Sample generated.
    const sample = await HomeSample.findOne({respondent: req.session.respondent});
    if (!sample) {
        return res.status(401).send({error: "No Home Sample generated for user."});
    }

    // Validation schema
    const schema = Joi.object({
        key: Joi.equal("bestAddress1", "bestAddress2", "worstAddress2", "worstAddress1"),
        value: Joi.string().min(1),
    });

    const validation = schema.validate(req.body);
    if (validation.error) {
        return res.status(400).json({error: "Invalid rating submitted."});
    }

    const home = await Home.findOne({address: validation.value.value}).select('_id');
    if (!home) {
        return res.status(400).json({error: "An error occurred while looking up address."});
    }

    //Either update an existing incomplete rating or create a new one
    if (await IncompleteRating.countDocuments({respondent: req.session.respondent}) > 0) {
        await IncompleteRating.updateOne({
            respondent: req.session.respondent
        }, {
            [validation.value.key]: home
        });
    } else {
        await IncompleteRating.create({
            respondent: req.session.respondent,
            homeSample: sample,

            [validation.value.key]: home
        });
    }

    console.log(`Saved a partial rating for respondent ${req.session.respondent.respondentId}.`);
    return res.status(200).json({success: true});
});

module.exports = router;