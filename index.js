require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wh888.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  // await client.connect();
  try {
    const db = client.db("todo");
    const taskCollection = db.collection("tasks");

    app.get("/tasks", async (req, res) => {
      const cursor = taskCollection.find({});
      const tasks = await cursor.toArray();
      res.send({ status: true, data: tasks });
    });

    app.post("/task", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });

    app.get("/task/:id", async (req, res) => {
      const id = req.params.id;
      const result = await taskCollection.findOne({ _id: ObjectId(id) });
      // console.log(result);
      res.send(result);
    });

    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const result = await taskCollection.deleteOne({ _id: ObjectId(id) });
      // console.log(result);
      res.send(result);
    });

    // status update
    app.put("/task/:id", async (req, res) => {
      const id = req.params.id;
      const task = req.body;
      // console.log(id, updateStatus);
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          status: task.status,
          title: task.title,
          description: task.description,
          dateTime: task.dateTime,
          priority: task.priority,
        },
      };
      const result = await taskCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
