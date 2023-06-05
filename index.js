const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());

require("dotenv").config();
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://todos:OoUo8UbMy3g79evl@cluster0.dxmnpk6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const todosCollection = client.db("todoDB").collection("todos");
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    app.get("/todos", async (req, res) => {
      console.log("all dara");
      const result = await todosCollection.find().toArray();
      res.send(result);
    });
    app.get("/todos/:id", async (req, res) => {
      const query = {
        _id: new ObjectId(req.params.id),
      };
      const result = await todosCollection.findOne(query);
      res.send(result);
    });
    app.post("/todos", async (req, res) => {
      const { todoData } = req.body;

      const result = await todosCollection.insertOne(todoData);
      res.send(result);
    });
    app.put("/todos/:id", async (req, res) => {
      const id = req.params.id;
      const { todoData } = req.body;

      const filter = { _id: new ObjectId(id) };

      const updateDoc = {
        $set: {
          tittle: todoData.tittle,
          discription: todoData.discription,
          option: todoData.option,
        },
      };
      const result = await todosCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    app.delete("/todos/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await todosCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("todos connect");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
