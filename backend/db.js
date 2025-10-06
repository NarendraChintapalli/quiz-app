const sqlite=require('sqlite3').verbose();
const path=require('path');

// Create or open database file
const  dbPath=path.resolve(__dirname,'data','quiz.db');
const db=new sqlite.Database(dbPath);


// Create table if not exists

db.serialize(()=>{
  db.run(`
    CREATE TABLE IF NOT EXISTS questions(
      id INTEGER primary key autoincrement,

      question TEXT NOT NULL,
      optionA TEXT NOT NULL,
      optionB TEXT NOT NULL,
      optionC TEXT NOT NULL,
      optionD TEXT NOT NULL,
      correctOption TEXT NOT NULL

    )`
  );
});

module.exports=db;