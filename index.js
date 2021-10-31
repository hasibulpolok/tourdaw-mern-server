const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const dotenv = require('dotenv').config()



const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aeutd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();

        const database = client.db('Services');
        const servicecollection = database.collection('service-list');
        const userbooking = database.collection('userbooking');


        // Get api Book
        app.get('/book', async (req, res) => {
            const cursor = userbooking.find({});
            const booking = await cursor.toArray();
            res.send(booking);
        })


        // update
        app.put('/book/:id',async(req,res)=>{
            const id = req.params.id;
            const updated = req.body;
            const query = { _id: ObjectId(id) };
            const options = {upsert: true};
            const updateDoc = {
                $set:{
                    status:updated.Status,
                },
            };
            const result = await userbooking.updateOne(filter, updateDoc, Options)
            res.json(result)
        })

        // POST API Booking
        app.post('/book', async (req, res) => {
            const bookdetails = req.body;
            const result = await userbooking.insertOne(bookdetails);
            res.json(result);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
        })

        // Delete Api book
        app.delete('/book/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log('deleting booking');
            const result = await userbooking.deleteOne(query)
            res.json(result);
        })

        app.get('/book/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const book = await userbooking.findOne(query)
            console.log(id);
            res.send(book)
        })


        // Get api place
        app.get('/services', async (req, res) => {
            const cursor = servicecollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })


        // POST API place
        app.post('/services', async (req, res) => {
            const newservice = req.body;
            const result = await servicecollection.insertOne(newservice);
            res.json(result);
        })


        // Delete Api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicecollection.deleteOne(query)
            res.json(result);
        })



    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);





app.get('/', (req, res) => {
    res.send("server setup successfully")
    console.log("server running");
})

app.listen(port, () => {
    console.log("runnig server on port", port);
})
