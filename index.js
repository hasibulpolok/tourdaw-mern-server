const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;



const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

// connection mongodb
const uri = "mongodb+srv://process.env.DB_USER:process.env.DB_PASS@cluster0.aeutd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();

        const database = client.db('Services');
        const servicecollection = database.collection('service-list');

        // Get api 
        app.get('/services',async(req,res)=>{
            const cursor = servicecollection.find({});
            const services =await cursor.toArray();
            res.send(services);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const newservice = req.body;
            const result = await servicecollection.insertOne(newservice);
            
            res.json(result);
        })

        // Delete Api
        app.delete('/services/:id',async(req,res) =>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
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
