// ROUTES FOR ARTICLE PAGE

const express = require("express");
const router = express.Router();

/**
 * @desc article_clicked : displays selected article
*/
router.post("/article_clicked", async(req, res, next) => {

    try {
        const postData = req.body;
        const id = postData.id;

        const query1 = "SELECT * FROM blog_posts WHERE id = ?"; // gets information about article selected from reader's homepage
        const query2 = "SELECT * FROM comment WHERE id = ? ORDER BY comment_id DESC"; // displays all comments which have the id of selected article
        const query3 = "SELECT * FROM blog_settings WHERE settings_id = 1"; // displays blog name + author name
        const query4 = "UPDATE blog_posts SET blog_hits = blog_hits + ? WHERE id = ?"; // increases blog's hits by 1 for respective article

        const query_parameters = [id];
        const update = [1, id];

        const result1 = await queryDatabase(query1, query_parameters);
        const result2 = await queryDatabase(query2, query_parameters);
        const result3 = await queryDatabase(query3, []);
        const result4 = await queryDatabase(query4, update);

        // shows article with all the information queried
        res.render("article_template.ejs", {blogpost: result1, comments_list: result2, set : result3});
    }

    catch(err) {
        next(err)
    }
});


/**
 * @desc article_interaction : updates article page when a new comment is added or the article is liked
*/
router.post("/article_interaction", async (req, res, next) => {

    try {
        const postData = req.body;
        let id;

        // if article is liked
        if(postData.like != undefined)
        {
            id = postData.like;

            const query1 = "UPDATE blog_posts SET blog_likes = blog_likes + ( ? ) WHERE id = ?"; // increases like count by 1 for respective article
            const like = [1, postData.like];
            const result1 = await queryDatabase(query1, like);
        }

        // if article is commented on
        else
        {
            id = postData.selectedArticle;

            const query1 = "INSERT INTO comment(comment_user, comment_content, comment_date_time, id) VALUES (?, ?, ?, ?)"; // comment is added to comment table
            const comment = [postData.username, postData.userInput, getCurrentDateTime(), postData.selectedArticle];
            const result1 = await queryDatabase(query1, comment);
        }

        const query2 = "SELECT * FROM blog_posts WHERE id = ?"; // gets information about article selected from reader's homepage
        const query3 = "SELECT * FROM comment WHERE id = ? ORDER BY comment_id DESC"; // displays all comments which have the id of selected article
        const query4 = "SELECT * FROM blog_settings WHERE settings_id = 1"; // displays blog name + author name

        const query_parameters = [id];

        const result2 = await queryDatabase(query2, query_parameters);
        const result3 = await queryDatabase(query3, query_parameters);
        const result4 = await queryDatabase(query4, []);

        // shows article with all the information queried
        res.render("article_template.ejs", {blogpost: result2, comments_list: result3, set: result4});
    }

    catch(err) {
        next(err)
    }
});

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