const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const cron = require('node-cron');
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

// send mails
function mailSender(reciever, mailSubject, body){
  const mailOptions = {
    from: process.env.NodeMailer_USER,
    to: reciever,
    subject: mailSubject,
    text: body
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// datetime converter
function datetime(time){
  const days = 5;

  const date = new Date();
  date.setDate(date.getDate() + days);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  const formattedDate = `${year}-${month}-${day}T${time}`;

  return formattedDate;
}

//Seat status for schedule
function generateSeatStatus(numSeats) {
  const seatStatus = {};
  const rows = Math.ceil(numSeats / 4); // Calculate the number of rows needed
  
  for (let row = 1; row <= rows; row++) {
    for (let seat = 1; seat <= 4; seat++) {
      if ((row - 1) * 4 + seat <= numSeats) {
        const seatName = String.fromCharCode(65 + seat - 1) + row; // A1, A2, ..., B1, B2, ...
        seatStatus[seatName] = false; // Set status to false
      }
    }
  }

  return seatStatus;
}

async function run() {
    try {
      await client.connect();
      const userCollection = client.db("CSE471").collection("user");
      const busCollection = client.db("CSE471").collection("bus");
      const districtCollection = client.db("CSE471").collection("district");
      const routeCollection = client.db("CSE471").collection("route");
      const scheduleCollection = client.db("CSE471").collection("schedule");
      const dailyScheduleCollection = client.db("CSE471").collection("dailyschedule");

      //Get if admin
      app.get("/admin/:userId", async (req, res) => {
        const userid = req.params.userId;
        const filter = { _id: new ObjectId(userid) };
        const user = await userCollection.findOne(filter);
        res.send({role : user.role});
      });

      //Register driver and admin
      app.post("/createaccount", async (req, res) => {
        const { email, role } = req.body;
        const ID = new ObjectId();
        const password = ID.toString().slice(0, 8);
        const hashedPassword = await bcrypt.hash(password, 10);
        user = {_id : ID, email, password : hashedPassword, role, verify : true, otp : true}
        const result = await userCollection.insertOne(user);
        
        // Sending Mail
        const mailSubject = 'Account Details';
        const body = `email : ${email} \npassword : ${password}`;
        mailSender(email, mailSubject, body);

        res.send(result);
      });

      //Save admin info
      app.put("/admininfo/:id", async (req, res) => {
        const userId = req.params.id;
        const { name, password, mobile } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const filter = { _id: new ObjectId(userId) };

        const options = { upsert: true };
        const updatedData = {
          $set: {
            name : name,
            password : hashedPassword,
            mobile : mobile,
            otp : false
          }
        };

        const result = await userCollection.updateOne(filter, updatedData, options);
        res.send(result);
      });

      //Save driver info
      app.put("/driverinfo/:id", async (req, res) => {
        const userId = req.params.id;
        const { name, password, mobile, licenseNo, expiryDate } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const filter = { _id: new ObjectId(userId) };

        const options = { upsert: true };
        const updatedData = {
          $set: {
            name : name,
            password : hashedPassword,
            mobile : mobile,
            licenseNo : licenseNo,
            expiryDate : expiryDate,
            otp : false
          }
        };

        const result = await userCollection.updateOne(filter, updatedData, options);
        res.send(result);
      });

      //Register user
      app.post("/register", async (req, res) => {
        const { name, email, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { name, email, password : hashedPassword, role, verify : false, otp : false };
        const result = await userCollection.insertOne(newUser);
        
        // Sending Mail
        const mailSubject = 'Email Verification';
        const body = `http://localhost:3000/mailverify/${result.insertedId}`;
        mailSender(email, mailSubject, body);

        res.send(result);
      });

      //Resend verification mail
      app.post('/resend', async (req, res) => {
        const { userId } = req.body;

        const filter = { _id: new ObjectId(userId) };
        const user = await userCollection.findOne(filter);

        // Sending Mail
        const mailSubject = 'Email Verification';
        const body = `http://localhost:3000/mailverify/${userId}`;
        mailSender(user.email, mailSubject, body);
        
        return res.status(201).json({ message: 'ok'})
      });

      //Mail verify
      app.put("/mailverify/:id", async (req, res) => {
        const userId = req.params.id;
        const filter = { _id: new ObjectId(userId) };

        const options = { upsert: true };
        const updatedData = {
          $set: {
            verify : true
          }
        };

        const result = await userCollection.updateOne(filter, updatedData, options);
        res.send(result);
      });

      // Login user
      app.post('/login', async (req, res) => {
        const { email, password } = req.body;

        // Find the user by email
        const user = await userCollection.findOne({ email });

        if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
        res.status(201).send({ userId : user._id, verify : user.verify, otp : user.otp, role : user.role});
      });

      //Forgot Password
      app.post("/forgotpass", async (req, res) => {
        const { email } = req.body;

        // Find the user by email
        const user = await userCollection.findOne({ email });

        if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Sending Mail
        const mailSubject = 'Password Reset';
        const body = `http://localhost:3000/resetpass/${user._id}`;
        mailSender(email, mailSubject, body);

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
            password: newHashedPassword
          }
        };

        const result = await userCollection.updateOne(filter, updatedData, options);
        res.send(result);
      });

      //Get all driver
      app.get("/drivers", async (req, res) => {
        const drivers = await userCollection.find({ role : "driver"}).toArray();
        res.send(drivers);
      });

      //Add Bus
      app.post("/addbus", async (req, res) => {
        const bus= req.body;
        const result = await busCollection.insertOne(bus);
        res.send(result);
      });

      //Get all buses
      app.get("/buses", async (req, res) => {
        const buses = await busCollection.find({}).toArray();
        res.send(buses);
      });

      //Get all districts
      app.get("/districts", async (req, res) => {
        const districts = await districtCollection.find({}).sort({name : 1}).toArray();
        res.send(districts);
      });

      //Add Route
      app.post("/addroute", async (req, res) => {
        const route= req.body;
        const result = await routeCollection.insertOne({route});
        res.send(result);
      });

      //Get all routes
      app.get("/routes", async (req, res) => {
        const routes = await routeCollection.find({}).toArray();
        res.send(routes);
      });

      //Add schedule
      app.post("/addschedule", async (req, res) => {
        const schedule = req.body;
        const seat = await busCollection.findOne({ _id: new ObjectId(schedule.busId) });
        const numSeat = seat.seat;
        schedule.seats = generateSeatStatus(numSeat);
        const result = await scheduleCollection.insertOne(schedule);
        res.send(result);
      });

      //Daily schedule
      app.post("/dailyschedule", async (req, res) => {
        const schedule = req.body;
        const result = await dailyScheduleCollection.insertOne(schedule);
        res.send(result);
      });

      //Bus search
      app.post("/search", async (req, res) => {
        const {from, to, departure, type} = req.body;

        const filter = { route: { $all: [from, to] }};

        const routes = await routeCollection.find(filter).toArray();

        routes.forEach((routeObj, index) => {
          let fromIndex = routeObj.route.indexOf(from);
          let toIndex = routeObj.route.indexOf(to);
        
          if (fromIndex !== -1 && toIndex !== -1 && fromIndex > toIndex) {
            routes.splice(index, 1)
          }
        });

        let schedules = []

        for(let i = 0; i < routes.length; i++){
          const query = {
            $and: [
              { departureTime: { $regex: "^" + departure } },
              { routeId: routes[i]._id.toString() }
            ]
          }
          const schedule = await scheduleCollection.find(query).toArray();
          schedules = schedules.concat(schedule);
        }

        for(let i = 0; i < schedules.length; i++){
          const bus = await busCollection.findOne({ _id: new ObjectId(schedules[i].busId) });
          if (bus.type !== type){
            schedules.splice(i, 1);
          }
        }
        res.send(schedules);
      });

      //Automate Data Seeding for daily bus schedule
      cron.schedule('59 23 * * *', async () => {
        const schedules = await dailyScheduleCollection.find({}).toArray();

        for (const schedule of schedules) {
          delete schedule._id;
          schedule.departureTime = datetime(schedule.departureTime);
          schedule.arrivalTime = datetime(schedule.arrivalTime);
          const seat = await busCollection.findOne({ _id: new ObjectId(schedule.busId) });
          const numSeat = seat.seat;
          schedule.seats = generateSeatStatus(numSeat);
          await scheduleCollection.insertOne(schedule);
        }
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