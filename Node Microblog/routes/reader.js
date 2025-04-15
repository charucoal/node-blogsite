const express = require("express");
const router = express.Router();

// READER'S HOMEPAGE
// GET FUNCTIONS

/**
 * @desc READER HOMEPAGE : displays all published articles
*/
router.get("/homepage", async (req, res, next) => {

    try {
        // selects all the published blog posts in the order of published date (to show in that order in the homepage)
        const query = "SELECT * FROM blog_posts WHERE blog_status = 1 ORDER BY blog_published DESC";
        const query2 = "SELECT * FROM blog_settings"; // displays blog name + author name

        const result = await queryDatabase(query, []);
        const result1 = await queryDatabase(query2, []);

        res.render("reader_homepage.ejs", {blog_published: result, set : result1})
    }

    catch(err) {
        next(err)
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
