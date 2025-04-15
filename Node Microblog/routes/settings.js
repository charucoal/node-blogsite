const express = require("express");
const router = express.Router();

// BLOG SETTINGS PAGE
// GET FUNCTIONS
/**
 * @desc SETTINGS : displays blog setting options
*/
router.get("/settings", async (req, res, next) => {

    try {
        const query = "SELECT * FROM blog_settings"; // displays blog name + author name
        const result = await queryDatabase(query, []);

        // shows setting page with the current values in the input boxes
        res.render("settings.ejs", {set : result});
    }

    catch (err) {
        next(err);
    }
});

// POST FUNCTIONS
/**
 * @desc settings_update : updates table containing the blog setting information
*/
router.post("/settings_update", async (req, res, next) => {

    try {
        const postData = req.body;
        const query = "UPDATE blog_settings SET blog_name = ?, blog_author = ? WHERE settings_id = 1"; // updates the information in the blog_settings table
        const query_components = [postData.blog_title, postData.blog_author];

        const result = await queryDatabase(query, query_components);

         // redirects to setting page and shows the updated values in the input boxes
        res.redirect("settings")
    }

    catch(err) {
        next(err);
    }
});

// FUNCTIONS

// queries the database using the query + parameters given as argument
async function queryDatabase(query, query_parameters) {
    return new Promise((resolve, reject) => {
        global.db.all(query, query_parameters, (err, result) => {
            
            if (err) reject(err);
            
            else resolve(result);
        });
    });
}

// Export the router object so index.js can access it
module.exports = router;