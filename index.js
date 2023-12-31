const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kplqqe8.mongodb.net/?retryWrites=true&w=majority`;

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
    const tasksCollections = client.db("task_managementDB").collection("tasks");

    // server api
    app.get("/task", async (req, res) => {
      const result = await tasksCollections.find().toArray();
      res.send(result);
    });
    app.get("/task/:email", async (req, res) => {
      const email = req.params.email;
      const query = { user_email: email };
      const result = await tasksCollections.find(query).toArray();
      res.send(result);
    });
    app.get("/task1/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tasksCollections.findOne(query);
      res.send(result);
    });

    app.post("/task", async (req, res) => {
      const taskInfo = req.body;
      const result = await tasksCollections.insertOne(taskInfo);
      res.send(result);
    });
    app.put("/task1/:id", async (req, res) => {
      const id = req.params.id;
      const updateInfo = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          title: updateInfo?.title,
          description: updateInfo?.description,
          datelines: updateInfo?.datelines,
          priority: updateInfo?.priority,
        },
      };
      const result = await tasksCollections.updateOne(query, updateDoc);
      res.send(result);
    });

    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tasksCollections.deleteOne(query);
      res.send(result);
    });

    // ---------

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
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
  res.send("Server is running now!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
