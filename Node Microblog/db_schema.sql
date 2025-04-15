-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- TABLES
-- stores information about all blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    blog_title TEXT,
    blog_content TEXT,
    blog_created TEXT,
    blog_modified TEXT DEFAULT "-", -- stores the most current modified date
    blog_published TEXT,
    blog_likes INT DEFAULT 0,
    blog_hits INT DEFAULT 0,
    blog_status BOOLEAN DEFAULT 0 -- 0 for draft and 1 for published
);

-- stores the comments written across ALL blog posts
CREATE TABLE IF NOT EXISTS comment (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment_user TEXT,
    comment_content TEXT,
    comment_date_time TEXT,
    id INTEGER,
    FOREIGN KEY (id) REFERENCES blog_posts(id) ON DELETE CASCADE
);

-- stores the blog name + blog author details
CREATE TABLE IF NOT EXISTS blog_settings (
    settings_id INTEGER PRIMARY KEY AUTOINCREMENT,
    blog_name TEXT,
    blog_author TEXT
);

-- DEFAULT DATA
-- DEFAULT ARTICLES FOR DEMONSTRATION PURPOSES
INSERT INTO blog_posts('blog_title', 'blog_content', 'blog_created', 'blog_modified') VALUES ('My First Article', 'Hello World!', 'Jan 14, 2024, 12:12:33 AM', 'Jan 14, 2024, 12:12:38 AM');
INSERT INTO blog_posts('blog_title', 'blog_content', 'blog_created', 'blog_modified') VALUES ('Second Article', 'Here is the content for the second article.', 'Jan 14, 2024, 12:12:33 AM', 'Jan 14, 2024, 12:12:38 AM');
INSERT INTO blog_posts('blog_title', 'blog_content', 'blog_created', 'blog_modified') VALUES ('Third Article', 'Okay, okay last one.', 'Jan 14, 2024, 12:12:33 AM', 'Jan 14, 2024, 12:12:38 AM');

-- DEFAULT DATA TO SHOW AS THE BLOG NAME AND BLOG AUTHOR
INSERT INTO blog_settings ('blog_name', 'blog_author') VALUES ('BLOG TITLE', 'AUTHOR NAME');

COMMIT;

