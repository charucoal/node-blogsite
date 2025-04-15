const express = require("express");
const router = express.Router();

// AUTHOR HOMEPAGE ACTIONS
// GET FUNCTIONS

/**
 * @desc AUTHOR HOMEPAGE: displays draft and published articles in a table
*/
router.get("/homepage", async (req, res, next) => {

    try{
        const query_articles = "SELECT * FROM blog_posts ORDER BY blog_published DESC"; // selects all the blog posts in the order of published date (to show in that order in the publshed table)
        const query_settings = "SELECT * FROM blog_settings"; // displays blog name + author name

        const result1 = await queryDatabase(query_articles, []);
        const result2 = await queryDatabase(query_settings, []);

        res.render("author_homepage.ejs", {blog_post: result1, blog_set: result2});
    }

    catch(err){
        next(err)
    }
});

// POST FUNCTIONS
/**
 * @desc draft_actions: logic for publishing or deleting articles (in draft article table)
*/
router.post("/draft_actions", async (req, res, next) => {

    try{
        const postData = req.body;

        // if the PUBLISH button is clicked
        if(postData.publish != undefined)
        {
            const query = "UPDATE blog_posts SET blog_status = 1, blog_published = ? WHERE id = ?"; // changes the blog_status from draft (0) to published (1)
            var id = parseInt(postData.publish);
            const result = await queryDatabase(query, [getCurrentDateTime(), id]);
        }

        // if the DELETE button is clicked
        else if(postData.delete != undefined)
        {
            const query = "DELETE FROM blog_posts WHERE id = ?"; // daletes the article from the blog_posts table
            var id = parseInt(postData.delete);
            const result = await queryDatabase(query, [id]);
        }

        // redirects to homepage (and updated tables are shown)
        res.redirect("homepage");
    }

    catch(err){
        next(err)
    }
});

/**
 * @desc publish_actions: logic for publishing or deleting articles (in published article table)
*/
router.post("/publish_actions", async (req, res, next) => {

    try{
        const postData = req.body;

        // if ARCHIVE button is clicked
        if(postData.archive != undefined)
        {
            const query = "UPDATE blog_posts SET blog_status = 0 WHERE id = ?"; // changes the blog_status from published (1) to draft (0)
            var id = parseInt(postData.archive);
            const result = await queryDatabase(query, [id]);
        }

        // if DELETE button is clicked
        else if(postData.delete != undefined)
        {
            const query = "DELETE FROM blog_posts WHERE id = ?"; // daletes the article from the blog_posts table
            var id = parseInt(postData.delete);
            const result = await queryDatabase(query, [id]);
        }

        // redirects to homepage (and updated tables are shown)
        res.redirect("homepage");
    }

    catch(err){
        next(err)
    }
});

// EDIT PAGE
// POST FUNCTIONS

/**
 * @desc editing : called when creating a new draft or editing an article
*/
router.post("/editing", async (req, res, next) => {

    const postData = req.body;

    try{

        // when the NEW DRAFT button is clicked
        if(postData.edit == "new")
        {
            const query1 = "INSERT INTO blog_posts (blog_title, blog_content, blog_created) VALUES (?, ?, ?)"; // adds a new entry into the blog_posts table
            const query2 = "SELECT * FROM blog_posts ORDER BY id DESC LIMIT 1"; // newest article created (the above one) content is queried
            const query3 = "SELECT * FROM blog_settings"; // displays blog name + author name
    
            const query_components = ["New Draft", "Let the words flow...", getCurrentDateTime()];
    
            const result1 = await queryDatabase(query1, query_components);
            const result2 = await queryDatabase(query2, []);
            const result3 = await queryDatabase(query3, []);
    
            // renders to show the edit page with the article's information
            res.render("edit.ejs", {article: result2, set: result3})
        }

        // when a draft or a published article is being edited
        else {
            const id = parseInt(postData.edit)

            const query1 = "SELECT * FROM blog_posts WHERE id = ?"; // gets information about article selected for editing
            const query2 = "SELECT * FROM blog_settings"; // displays blog name + author name

            const query_components = [id];

            const result1 = await queryDatabase(query1, query_components);
            const result2 = await queryDatabase(query2, []);

            // renders to show the edit page with the article's information
            res.render("edit.ejs", {article: result1, set : result2})
        }
    }

    catch(err){
        next(err)
    }
});

/**
 * @desc edited : called when SAVE CHANGES button is pressed to save the input given
*/
router.post("/edited", async (req, res, next) => {

    const postData = req.body;

    try {
        const id = postData.id;

        const query1 = "UPDATE blog_posts SET blog_title = ?, blog_content = ?, blog_modified = ? WHERE id = ?"; // updates information about the edited article 
        const query2 = "SELECT * FROM blog_posts WHERE id = ?"; // gets information about article selected for editing
        const query3 = "SELECT * FROM blog_settings"; // displays blog name + author name

        const query_components = [postData.article_title, postData.article_content, getCurrentDateTime(), postData.id];

        const result1 = await queryDatabase(query1, query_components);
        const result2 = await queryDatabase(query2, [id]);
        const result3 = await queryDatabase(query3, []);

        // renders to show the edit page with the updated article information
        res.render("edit.ejs", {article: result2, set : result3})
    }

    catch(err){
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

//  gets current date and time when called
function getCurrentDateTime() {
    const currentDateAndTime = new Date();
    const options = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    };

    return currentDateAndTime.toLocaleString("en-US", options);
}

module.exports = router;