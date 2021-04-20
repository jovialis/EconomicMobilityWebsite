/**
 * Created on 4/17/21 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');
const Rating = mongoose.model('Rating');

const UserState = {
    LOGIN: 'login',
    SELECT_ZIP: 'select_zip',
    RANK_HOUSES: 'rank_houses',
    COMPLETED: 'completed'
};

module.exports.getUserState = async function(respondent) {
    // No respondent
    if (!respondent) {
        return UserState.LOGIN;
    }

    // No ZIP?
    if (!respondent.zip) {
        return UserState.SELECT_ZIP;
    }

    // Look for a response
    if ((await Rating.countDocuments({respondent})) <= 0) {
        return UserState.RANK_HOUSES;
    } else {
        return UserState.COMPLETED;
    }
}