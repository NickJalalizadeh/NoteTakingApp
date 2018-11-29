var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
    
    defineNote = (body) => {
        return {
            title: body.title || 'Untitled Note',
            body: body.body,
            color: body.color
        };
    };

    //Creating a Note
    app.post('notes', (req, res) => {
        // Validate request
        if(!req.body.title && !req.body.body) {
            return res.status(400).send({
                error: "Note can not be empty"
            });
        }

        // Define Note
        const note = defineNote(req.body);

        // Save Note in the database
        db.collection('notes').insert(note, (err, result) => {
            if (err) { 
                res.send({ error: err.message || 'An error has occurred' }); 
            } else {
                res.send(note);
            }
        });
    });

    //Reading one Note
    app.get('notes/:id', (req, res) => {
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

    //Reading all Notes
    app.get('notes', (req, res) => {
        db.collection('notes').find({}).toArray((err, result) => {
            if (err) {
                res.send({error: err.message || 'An error has occurred'});
            } else {
                res.send(result);
            } 
        });
    });

    //Updating a Note
    app.put('notes/:id', (req, res) => {
        // Define Note
        const note = defineNote(req.body);

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
    app.delete('notes/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection('notes').remove(details, (err) => {
            if (err) {
                res.send({error: err.message || 'An error has occurred'});
            } else {
                res.send('Note ' + id + ' deleted!');
            } 
        });
    });
};