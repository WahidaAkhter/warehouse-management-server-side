const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

app.get('/', (req, res) => {
    res.send('Server Side Work will be done!');
});

app.use(cors());
app.use(express.json());

// id = booksInventory
// pass=osqF1SGouT2Ms6vy



const uri = "mongodb+srv://booksInventory:osqF1SGouT2Ms6vy@cluster0.6cm8v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        await client.connect();
        const userCollection = client.db("bookExpress").collection("user");

        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })

        app.post('/user', async (req, res) => {
            const newItem = req.body;
            console.log('adding new item', newItem);
            const result = await userCollection.insertOne(newItem);
            res.send(result);
        });


        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updatedItem = req.body;
            console.log('Updating item', updatedItem);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: updatedItem.quantity
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            //const result = await userCollection.deleteOne(query);
            res.send(result);
        })


    }

    finally {
        //  await client.close();
    }

}

run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port`, port);
});


