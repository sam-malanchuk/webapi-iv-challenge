const express = require('express');

const Users = require('./userDb.js');
const Posts = require('../posts/postDb.js');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
    Users.insert(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(({message}) => {
            res.status(500).json({ message });
        });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    const postData = {...req.body, user_id: req.params.id};

    Posts.insert(postData)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(error => {
            res.status(500).json({ message: 'Error creating new post' });
        })
});

router.get('/', (req, res) => {
    Users.get()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => {
            res.status(500).json({ message: 'Error getting users list' });
        });
});

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
    const { id } = req.params;

    Users.getUserPosts(id)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            res.status(500).json({ message: 'Error getting posts list' });
        });
});

router.delete('/:id', validateUserId, (req, res) => {
    const { id } = req.params;

    Users.remove(id)
        .then(user => {
            if(user) {
                res.status(200).json({ message: 'User Successfully Deleted!' });
            } else {
                res.status(500).json({ message: 'Error deleting the user' });
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Error deleting the user' });
        });
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
    const { id } = req.params;

    Users.update(id, req.body)
        .then(user => {
            if(user) {
                res.status(200).json({ message: 'User Successfully Updated!' });
            } else {
                res.status(500).json({ message: 'Error updating the user' });
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Error deleting the user' });
        });

});

//custom middleware

function validateUserId(req, res, next) {
    const { id } = req.params;

    Users.getById(id)
        .then(user => {
            if(user) {
                req.user = user;
                next();
            } else {
                res.status(400).json({ message: 'invalid user id' });
            }
        })
        .catch(error => {
            res.status(400).json({ message: 'there was an issue looking up the user ID' });
        });
};

function validateUser(req, res, next) {
    if(req.body && Object.keys(req.body).length > 0) {
        next();
    } else {
        if(req.body.name) {
            res.status(400).json({ message: "missing user data" });
        } else {
            res.status(400).json({ message: "missing required name field" });
        }
    }
};

function validatePost(req, res, next) {
    if(req.body && Object.keys(req.body).length > 0) {
        next();
    } else {
        if(req.body.text) {
            res.status(400).json({ message: "missing post data" });
        } else {
            res.status(400).json({ message: "missing required text field" });
        }
    }
};

module.exports = router;
