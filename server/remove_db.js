//Copied from soa-node-mongo, might need to update

// Pass URL of your mongoDB instance as first argument
let userArgs = process.argv.slice(2);
let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, { userNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

const clearDatabase = async () => {
    await db.dropDatabase();

    console.log('Database cleared');
    if (db) db.close();
}

clearDatabase().catch((err) => {
    console.log('ERROR: ' + err);
    if (db) db.close();
});

console.log('Processing ...');