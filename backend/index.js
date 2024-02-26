const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

//configure MondoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wpnmikh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.NodeMailer_USER,
    pass: process.env.NodeMailer_PASS
  }
});

async function run() {
    try {
      await client.connect();
      const userCollection = client.db("CSE471").collection("user");

      //Get user ID
      app.get("/userId/:email", async (req, res) => {
        const userEmail = req.params.email;
        const query = { email : userEmail };
        const user = await userCollection.findOne(query);
        res.send(user._id);
      });

      //Get if admin
      app.get("/admin/:userId", async (req, res) => {
        const userid = req.params.userId;
        const filter = { _id: new ObjectId(userid) };
        const user = await userCollection.findOne(filter);
        res.send({role : user.role});
      });

      //Register user
      app.post("/register", async (req, res) => {
        const { email, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { email, hashedPassword, role };
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

    //Forgot Password
    app.post("/forgotpass", async (req, res) => {
      const { email } = req.body;

      // Find the user by email
      const user = await userCollection.findOne({ email });

      if (!user) {
        console.log("hi")
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // Sending Mail
      const mailOptions = {
        from: process.env.NodeMailer_USER,
        to: email,
        subject: 'Hello from Nodemailer',
        text: `http://localhost:3000/resetpass/${user._id}`
      };
   
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      return res.status(201).json({ message: 'ok'})
    });

    //Reset Password
    app.put("/resetpass/:id", async (req, res) => {
      const userId = req.params.id;
      const filter = { _id: new ObjectId(userId) };

      const { password } = req.body;
      const newHashedPassword = await bcrypt.hash(password, 10);

      const options = { upsert: true };
      const updatedData = {
        $set: {
          hashedPassword: newHashedPassword
        }
      };

      const result = await userCollection.updateOne(filter, updatedData, options);
      res.send(result);
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