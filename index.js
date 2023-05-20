const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kkdykse.mongodb.net/?retryWrites=true&w=majority`;

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

    const ToyCollection = client.db("legoSet").collection("toys");
    // const bookingCollection = client.db("carDoctor").collection("bookings");

    app.get("/services", async (req, res) => {
      const result = await serviceCollection.find().toArray();
      res.send(result);
    })

    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await serviceCollection.findOne(query);
      res.send(result);
    })

    app.post("/addToy", async (req, res) => {
      const newToy = req.body;
      const result = await ToyCollection.insertOne(newToy);
      res.send(result);
    })

    app.get("/bookings", async (req, res) => {
      let query = {};
      if(req.query?.email) {
        query = {email: req.query.email};
      }

    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    })

      const result = await bookingCollection.find(query).toArray();
      res.send(result)
    })

   // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   //  await client.close();
  }
}
run().catch(console.dir);


 app.get("/", (req, res) => {
    res.send('Server working')
 })

 app.listen(port, () => {
    console.log(port);
 })