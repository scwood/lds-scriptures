// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database(':memory:');

// db.serialize(function() {
//   db.run("CREATE TABLE lorem (info TEXT)");

//   var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//   for (var i = 0; i < 10; i++) {
//       stmt.run("Ipsum " + i);
//   }
//   stmt.finalize();

//   db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
//       console.log(row.id + ": " + row.info);
//   });
// });

// db.close();

const express = require('express');
const db = require('sqlite');
const app = express();

app.get('/:volume', sendVolume);
app.get('/:volume/:book', sendBook);
app.get('/:volume/:book/:chapter', sendChapter);

function sendVolume(req, res) {
  db.serialize(() => {
    const stmt = 'SELECT * FROM volumes WHERE volume_lds_url=?'
    db.get(stmt, ['bm'], (err, result) => {
      console.log(err);
      console.log(result);
    });
  });
}

function sendBook(req, res) {
  res.sendStatus(501);
}

function sendChapter(req, res) {
  res.sendStatus(501);
}

db.open('scriptures.db')
  .then(() => app.listen(process.env.PORT || 3000))

// ;
// sendVolume();
