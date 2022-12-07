const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3001;
const path = require('path');

//Imported files
const noteData = require('./db/db.json');
const uuid = require('./helpers/uuid');

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded( { extended: true}));


app.get('/notes', (req, res) => { res.sendFile(path.join(__dirname, 'public/notes.html'))})
app.get('/api/notes', (req, res) => { res.json(noteData)})
app.post('/api/notes', (req, res) => {
//pulls info from request
    const {title, text} = req.body
//checks if all fields are filled out
    if ( title && text) {
        const newNote  = {
            title,
            text,
            //assigns random id
            id: uuid(),
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if(err){
                console.error(err);
            }else{
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote);

                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4),
                (writeErr) => writeErr ? console.error(writeErr): console.log('Note added'))
            }
        })
    }
})

app.listen(PORT, () => console.log('Running on port 3001'));