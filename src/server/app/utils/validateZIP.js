/**
 * Created on 5/16/21 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');
const Home = mongoose.model('Home');

module.exports = async function(zip) {

    // Validate the ZIP code.
    // Count the number of homes
    const numHomes = await Home.countDocuments({zip});
    if (numHomes < 1) {
        throw new Error("We don't have enough data on that ZIP code.");
    }

    // Make sure there are enough homes of the right types in that ZIP code.
    const numRich = await Home.countDocuments({zip, classification: 'rich'});
    const numMedium = await Home.countDocuments({zip, classification: 'medium'});
    const numPoor = await Home.countDocuments({zip, classification: 'poor'});

    if (numRich < 10 || numMedium < 10 || numMedium < 10) {
        console.log(`Not enough homes with each classification in the zipcode ${zip}`);
        console.log("Poor count: " + numPoor + ", Medium count: " + numMedium + ", Rich count: " + numRich);

        throw new Error("We don't have enough data on that ZIP code.");
    }

}