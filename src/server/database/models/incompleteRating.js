const mongoose = require("mongoose");

// Represents someone rating a neighborhood
let incompleteRatingSchema = new mongoose.Schema({

    // Identification
    respondent: {type: mongoose.Types.ObjectId, ref: 'Respondent', required: true, unique: true},
    homeSample: {type: mongoose.Types.ObjectId, ref: 'HomeSample', required: true, unique: true},

    // Ranked addresses
    bestAddress1: {type: mongoose.Types.ObjectId, ref: "Home", default: null}, // Best
    bestAddress2: {type: mongoose.Types.ObjectId, ref: "Home", default: null}, // Second best

    worstAddress2: {type: mongoose.Types.ObjectId, ref: "Home", default: null}, // Second worst
    worstAddress1: {type: mongoose.Types.ObjectId, ref: "Home", default: null}, // Worst

});

mongoose.model('IncompleteRating', incompleteRatingSchema);