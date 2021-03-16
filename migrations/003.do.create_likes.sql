CREATE TABLE likes (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    count INTEGER NOT NULL default 1,
    post_id INTEGER
        REFERENCES posts(id) ON DELETE CASCADE NOT NULL, 
    user_id INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL  
);