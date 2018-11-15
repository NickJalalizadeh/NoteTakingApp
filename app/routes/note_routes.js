var ObjectID = require('mongodb').ObjectID;
const path = require('path');

module.exports = function(app, db) {
    
    //Creating a Note
    app.post('/notes', (req, res) => {
        // Validate request
        if(!req.body.title && !req.body.body) {
            return res.status(400).send({
                error: "Note can not be empty"
            });
        }

        // Define Note
        const note = { 
            title: req.body.title || 'Untitled Note',
            body: req.body.body,
            color: req.body.color
        };

        // Save Note in the database
        db.collection('notes').insert(note, (err, result) => {
            if (err) { 
                res.send({ error: err.message || 'An error has occurred' }); 
            } else {
                res.send(note);
            }
        });
    });

    //Reading a Note
    app.get('/notes/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection('notes').findOne(details, (err, result) => {
            if (err) {
                res.send({error: err.message || 'An error has occurred'});
            } else {
                res.send(result);
            } 
        });
    });

    //Read all Notes
    app.get('/notes', (req, res) => {
        db.collection('notes').find({}).toArray((err, result) => {
            if (err) {
                res.send({error: err.message || 'An error has occurred'});
            } else {
                res.send(result);
            } 
        });
    });

    //Updating a Note
    app.put('/notes/:id', (req, res) => {
        // Define Note
        const note = {
            title: req.body.title || 'Untitled Note', 
            body: req.body.body,
            color: req.body.color
        };

        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection('notes').update(details, note, (err, result) => {
            if (err) {
                res.send({error: err.message || 'An error has occurred'});
            } else {
                res.send(note);
            } 
        });
    });

    //Deleting a Note
    app.delete('/notes/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection('notes').remove(details, (err, item) => {
            if (err) {
                res.send({error: err.message || 'An error has occurred'});
            } else {
                res.send('Note ' + id + ' deleted!');
            } 
        });
    });
};