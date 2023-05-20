const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;


// MiddleWare
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('animal toy server is running')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.poxvpxp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const db = client.db('AllProduct')
        const productCollection = db.collection('AddedProduct')

        const indexKey = { productName: 1 }
        const indexOptions = { name: "productName" }

        const result = productCollection.createIndex(indexKey, indexOptions);

        app.get('/toySearch/:text', async (req, res) => {
            const searchText = req.params.text
            const result = await productCollection.find({ productName: { $regex: searchText, $options: "i" } }).toArray()
            res.send(result)
        })

        app.post('/postToys', async (req, res) => {
            const body = req.body
            const result = await productCollection.insertOne(body)
            res.send(result)
        })

        app.get('/alltoys', async (req, res) => {
            const result = await productCollection.find({}).sort({ name: 1 }).limit(20).toArray();
            res.send(result)
        })


        app.get('/details/:id', async (req, res) => {
            const id = req.params.id
            console.log(req.params)
            const result = await productCollection.findOne({ _id: new ObjectId(id) })
            console.log(result)
            res.send(result)


        })

        // app.get('/alltoyDetails/:id', async (req, res) => {
        //     const id = req.params.id
        //     const result = await productCollection.findOne({ _id: new ObjectId(id) })
        //     res.send(result)
        //     console.log(result)
        // })


        app.get('/alltoys/:category', async (req, res) => {
            if (
                req.params.category === "Teddy Bear" ||
                req.params.category === "Horse" ||
                req.params.category === "Dinosaur"
            ) {
                const result = await productCollection.find({ Category: req.params.category }).toArray()
                return res.send(result)
            }
            const result = await productCollection.find({}).toArray()
            res.send(result)
        })


        app.get('/mytoys/:email', async (req, res) => {
            const result = await productCollection.find({ email: req.params.email }).sort({ name: 1 }).toArray()
            res.send(result)
        })

        app.delete('/mytoys/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/mytoys/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query);
            res.send(result)
        })

        app.put('/updatetoys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const body = req.body;
            const option = { upsert: true };

            const updateProduct = {
                $set: {
                    Category: body.Category,
                    Quantity: body.Quantity,
                    price: body.price,
                    description: body.description
                },
            };

            const updateToys = await productCollection.updateOne(filter, updateProduct, option)

            res.send(updateToys)
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`animal toys server is running${port}`)
})