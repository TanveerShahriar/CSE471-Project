const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wpnmikh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    try {
      await client.connect();
      const userCollection = client.db("CSE471").collection("user");

      //Register user
      app.post("/register", async (req, res) => {
        const { email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { email, hashedPassword };
        const result = await userCollection.insertOne(newUser);
        res.send(result);
    });

    // Login user
    app.post('/login', async (req, res) => {
      const { email, password } = req.body;

      // Find the user by email
      const user = await userCollection.findOne({ email });

      if (!user) {
        console.log("hi")
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

      if (!isPasswordValid) {
        console.log("hihi")
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      console.log("done")
      return res.status(201).json({ message: 'ok'})
    });


    } finally {
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Running Server");
});

app.listen(port, () => {
    console.log("Listening to port", port);
});