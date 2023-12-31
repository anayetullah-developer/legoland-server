const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 2000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kkdykse.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    // await client.connect();

    const ToyCollection = client.db("legoSet").collection("toys");
    // const bookingCollection = client.db("carDoctor").collection("bookings");

    const indexKeys = { productName: 1 };
    const indexOption = { name: "productTitle" };

    const result = await ToyCollection.createIndex(indexKeys, indexOption);

  
    app.get("/", async (req, res) => {
      res.send("Server is working");
    });

    app.get("/toys", async (req, res) => {
       const query = {};
      const options = {
        sort: { price: 1 },
      };
      const result = await ToyCollection.find(query, options)
        .limit(20)
        .toArray();
      res.send(result);
    });

    app.get("/all-toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ToyCollection.findOne(query);
      res.send(result);
    });

    app.get("/toys/:category", async (req, res) => {
      console.log(req.params.category);
      const result = await ToyCollection.find({subCategory: req.params.category}).toArray();
      res.send(result);
    })

    app.get("/productSearch/:text", async (req, res) => {
      const searchQuery = req.params.text;

      const result = await ToyCollection.find({
        $or: [{ productName: { $regex: searchQuery, $options: "i" } }],
      }).toArray();

      res.send(result);
    });

    app.post("/addToy", async (req, res) => {
      const body = req.body;
      body.createdAt = new Date();
      const newToy = req.body;
      const result = await ToyCollection.insertOne(newToy);
      res.send(result);
    });

    app.get("/all-toys", async (req, res) => {
      console.log(req.query.sort);

      const sort = { price: req.query.sort == 'descending' ? 1 : -1 };

      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await ToyCollection.find(query)
        .limit(20)
        .sort(sort)
        .toArray();
      res.send(result);
    });

    app.delete("/all-toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ToyCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/updateToy/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      console.log(body);
      const query = { _id: new ObjectId(id) };
      const updateToy = {
        $set: {
          productName: body.productName,
          url: body.url,
          price: body.price,
          description: body.description,
          color: body.color,
          rating: body.rating,
          subCategory: body.subCategory,
          quantity: body.quantity,
        },
      };
      const result = await ToyCollection.updateOne(query, updateToy);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //  await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(port);
});

