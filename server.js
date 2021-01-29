/*server.js*/

// include all required modules
var http = require('http');
const express = require('express');
var bodyParser = require('body-parser');

const { MongoClient, ObjectId } = require("mongodb");

// server details
const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
// Static Files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/scss', express.static(__dirname + 'public/scss'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use('/vendor', express.static(__dirname + 'public/vendor'))

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Listen on port
app.listen(port, () => console.info(`Listening on port ${port}`))

// get order data from the database
app.get('/SelectOrder', async (req, res) => {
    const url = 'mongodb+srv://ksp:ksp123@cluster0.tqggl.mongodb.net/testinggg?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true';
    // const client = new MongoClient(url);
    const dbName = "resturant";
    // connect to your cluster
    const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    // specify the DB's name
    const dbRes = client.db(dbName);
    const query = { order: {deleted_status: 0} };
    console.log("Connected correctly to server for selecting....");
    dbRes.collection('transaction').find().toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
    });
});

// update make status
app.post('/SelectOrder/MakeStatus', (req, res) => {
    const url = 'mongodb+srv://ksp:ksp123@cluster0.tqggl.mongodb.net/testinggg?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true';
    const client = new MongoClient(url);
    const dbName = "resturant"

    async function EditRun() {
        try {
            await client.connect();
            console.log("Connected correctly to server for editting make status....");
            const database = client.db(dbName);
            const collection = database.collection("transaction");
            console.log(req.body.transaction_id ,req.body.order_no)
            // create a filter for a movie to update
            const filter = {
                _id: req.body.transaction_id,
                "orders.ordered_no": req.body.order_no,
            };
            // update a document
            const updateDoc = {
                $set: {"orders.$.cooked_status": "1"},
            };
            // for update many
            const result = await collection.updateOne(filter, updateDoc);
            console.log(
                `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
            );
        } finally {
            await client.close();
        }
    }
    EditRun().catch(console.dir);
});

// update take status
app.post('/SelectOrder/TakeStatus', (req, res) => {
    const url = 'mongodb+srv://ksp:ksp123@cluster0.tqggl.mongodb.net/testinggg?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true';
    const client = new MongoClient(url);
    const dbName = "resturant"

    async function EditRun() {
        try {
            await client.connect();
            console.log("Connected correctly to server for editting take status....");
            const database = client.db(dbName);
            const collection = database.collection("transaction");
            console.log(req.body.transaction_id)
            // create a filter for a movie to update
            const filter = {
                _id: req.body.transaction_id,
                "orders.ordered_no": req.body.order_no,
            };
            // update a document
            const updateDoc = {
                $set: {"orders.$.take_status": "1"},
            };
            // for update many
            const result = await collection.updateMany(filter, updateDoc);
            console.log(
                `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
            );
        } finally {
            await client.close();
        }
    }
    EditRun().catch(console.dir);
});

// update place status
app.post('/SelectOrder/PlaceStatus', (req, res) => {
    const url = 'mongodb+srv://ksp:ksp123@cluster0.tqggl.mongodb.net/testinggg?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true';
    const client = new MongoClient(url);
    const dbName = "resturant"

    async function EditRun() {
        try {
            await client.connect();
            console.log("Connected correctly to server for editting place status....");
            const database = client.db(dbName);
            const collection = database.collection("transaction");
            console.log(req.body.transaction_id)
            // create a filter for a movie to update
            const filter = {
                _id: req.body.transaction_id,
                "orders.ordered_no": req.body.order_no,
            };
            // update a document
            const updateDoc = {
                $set: {"orders.$.placed_status": "1"},
            };
            // for update many
            const result = await collection.updateMany(filter, updateDoc);
            console.log(
                `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
            );
        } finally {
            await client.close();
        }
    }
    EditRun().catch(console.dir);
});

// update delete status
app.post('/SelectOrder/DeleteStatus', (req, res) => {
    const url = 'mongodb+srv://ksp:ksp123@cluster0.tqggl.mongodb.net/testinggg?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true';
    const client = new MongoClient(url);
    const dbName = "resturant"

    async function EditRun() {
        try {
            await client.connect();
            console.log("Connected correctly to server for editting delete status....");
            const database = client.db(dbName);
            const collection = database.collection("transaction");
            console.log(req.body.transaction_id)
            // create a filter for a movie to update
            const filter = {
                _id: req.body.transaction_id,
                "orders.ordered_no": req.body.order_no,
            };
            // update a document
            const updateDoc = {
                $set: {"orders.$.deleted_status": "1"},
            };
            // for update many
            const result = await collection.updateMany(filter, updateDoc);
            console.log(
                `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
            );
        } finally {
            await client.close();
        }
    }
    EditRun().catch(console.dir);
});
