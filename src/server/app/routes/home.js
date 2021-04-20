/* Copyright D. Ryan @2019 - All rights reserved */

const mongoose = require('mongoose');
const Home = mongoose.model('Home');
const HomeSample = mongoose.model('HomeSample');

const Joi = require('joi');

const express = require('express');
const router = express.Router();

const config = require('../../config');

function exportHome(h) {
    return {
        zip: h.zip,
        address: h.address,

        lat: h.lat,
        lng: h.lng,

        bedrooms: h.bedrooms,
        bathrooms: h.bathrooms,
        sqft: h.sqft,

        photos: h.photos,

        price: h.price,

        classification: config.DEVELOPMENT && h.classification
    };
}

/**
 * Fetch Housing information
 *
 * @param {req.params.zipcode} Zipcode of the homes to query for
 * @return {200, {username, primary_email, first_name, last_name, city, games[...]}}
 */
router.get('/', async (req, res, next) => {

    // No respondent? Ignore
    if (!req.session.respondent) {
        return res.status(401).json({error: "User not authenticated."});
    }

    // No set zip? Return error
    if (!req.session.respondent.zip) {
        return res.status(400).json({error: "You must set your ZIP code first!"});
    }

    // Look for an existing sample of homes
    const existingSample = await HomeSample
        .findOne({respondent: req.session.respondent})
        .populate('homes');
    if (existingSample) {
        return res.status(200).json({
            homes: existingSample.homes.map(exportHome)
        });
    }

    const {experimentalGroup} = req.session.respondent;
    const zip = req.session.respondent.zip;

    let homes;

    // Determine the houses to return based on experimental grouping.
    switch (experimentalGroup) {
        // Sample 10 random rich homes
        case 1:
            homes = await Home.aggregate([
                {$match: { zip, classification: 'rich' }},
                {$sample: {size: 10}}
            ]);
            break;

        // Sample 10 random poor homes
        case 2:
            homes = await Home.aggregate([
                {$match: { zip, classification: 'poor' }},
                {$sample: {size: 10}}
            ]);
            break;

        // Sample 10 random medium homes
        case 3:
            homes = await Home.aggregate([
                {$match: { zip, classification: 'medium' }},
                {$sample: {size: 10}}
            ]);
            break;

        // Sample 5 rich and 5 poor homes
        case 4:
            const rich = await Home.aggregate([
                {$match: { zip, classification: 'rich' }},
                {$sample: {size: 5}}
            ]);
            const poor = await Home.aggregate([
                {$match: { zip, classification: 'poor' }},
                {$sample: {size: 5}}
            ]);
            homes = rich.concat(poor);
            break;

        // Default: Error
        default:
            return res.status(500).json({error: "Invalid classification error."});
    }

    homes.sort(() => Math.random() - 0.5);

    // Store the selection of homes in case the user queries again later
    await HomeSample.create({respondent: req.session.respondent, homes, zip});

    // Return only selected fields
    homes = homes.map(exportHome);

    res.status(200).json({
        homes
    });
});

module.exports = router;