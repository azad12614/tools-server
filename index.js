require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jkwgrzb.mongodb.net/?retryWrites=true&w=majority`;

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
    const productList = client.db("products").collection("items");
    
    //API
    app.post("/add-product", async (req, res) => {
      const product = req.body;
      // insert mongodb
      const result = await productList.insertOne(product);
      res.send(result);
    });

    // API 2
    app.get("/all-products", async (req, res) => {
      const result = await productList.find({}).toArray();
      res.send(result);
    });

    // API 3
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productList.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // API 4
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const productId = { _id: new ObjectId(id) };
      const productUpdate = req.body;
      const updates = { $set: productUpdate };
      // update mongodb
      const result = await productList.updateOne(productId, updates);
      res.send(result);
    });

    // API 5
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const productId = { _id: new ObjectId(id) };
      // delete mongodb
      const result = await productList.deleteOne(productId);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.use(express.static(__dirname + "../../Katastrophen"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Katastrophen", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});