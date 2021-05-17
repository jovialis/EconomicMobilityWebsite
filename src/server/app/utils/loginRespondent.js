/**
 * Created on 5/14/21 by jovialis (Dylan Hanson)
 **/

const express = require('express');
const router = express.Router();

const Joi = require('joi');

const mongoose = require('mongoose');
const Respondent = mongoose.model('Respondent');

const userState = require('./userState');

module.exports = async function (respondentId) {
    // Validation schema
    const schema = Joi.object({
        respondentId: Joi.string().alphanum().length(9)
    });

    const validation = schema.validate({respondentId});
    if (validation.error) {
        throw new Error("Invalid respondent ID provided.")
    }

    respondentId = validation.value.respondentId.toLowerCase();

    // Check if a respondent by that ID already exists.
    const existingRespondent = await Respondent.findOne({ respondentId })
    if (existingRespondent) {
        // Update last login
        await Respondent.updateOne({_id: existingRespondent._id}, {
            lastLogin: Date.now()
        });

        return ({
            state: await userState.getUserState(existingRespondent),
            respondent: existingRespondent
        });
    }

    // Otherwise, generate a new respondent document and save it
    const respondent = await Respondent.create({
        respondentId,
        experimentalGroup: Math.ceil(Math.random()*4),
    });

    return ({
        state: await userState.getUserState(respondent),
        respondent: respondent
    });
}