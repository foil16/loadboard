//________________________________MongoDB

const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://foil16:admin@loadboarddb.rqkbhpe.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    //console.log("Connection to DB successful");
    return client.db("loadboarddb");
  } catch (e) {
    console.error(e);
  }
}

// const truckSchema = new Schema({
//     truckId: Number,
//     positionLatitude: Number,
//     positionLongitude: Number,
//     equipType: String,
//     nextTripLengthPreference: String
// })

// const loadSchema = new Schema({
//     loadId: Number,
//     originLatitude: Number,
//     originLongitude: Number,
//     destinationLatitude: Number,
//     destinationLongitude: Number,
//     equipmentType: String,
//     price: Number,
//     mileage: Number

// })

//________________________________MQTT
const mqtt = require("mqtt");

const mqttClient = mqtt.connect("mqtt://fortuitous-welder.cloudmqtt.com", {
  port: 1883,
  username: "CodeJamUser",
  password: "123CodeJam",
  cleanSession: true,
  //   QoS: 1,
  clientId: "5head",
  //   Topic: "CodeJam"
});

mqttClient.on("connect", async () => {
  console.log("Connected to MQTT broker");

  // const db = await connectDB()
  // const collection = db.collection("today")
  // await collection.deleteMany({});
  //console.log("Collection emptied");

  mqttClient.subscribe("CodeJam", { qos: 1 }, (err) => {
    if (err) {
      console.error("Subscription error:", err);
    } else {
      console.log("Subscribed to CodeJam topic");
    }
  });
});

let started = false;
let db = null;
let collectionl = null;
let collectiont = null;

mqttClient.on("message", async (topic, message) => {
  const data = JSON.parse(message.toString());

  db = await connectDB();
  collectiont = db.collection("truckers");
  collectionl = db.collection("loads");

  if (data.type === "Start") {
    console.log("New day detected");
    started = true;
    // db = await connectDB();
    // collectiont = db.collection('truckers');
    // collectionl = db.collection('loads');

    console.log("Deleted previous day");
    //await collection.insertOne(data);
  } else if (data.type === "End") {
    console.log("End of day detected");
    await collectiont.deleteMany({});
    await collectionl.deleteMany({});
    //await collection.insertOne(data);
    //mqttClient.unsubscribe('CodeJam');
    //mqttClient.end();
    //client.close();
    started = false;
  } else if (started) {
    if (data.type === "Truck") {
      const truckIds = parseInt(data.truckId, 10);
      const query = { truckId: truckIds };
      const update = { $set: data };
      const options = { upsert: true };
      await collectiont.findOneAndUpdate(query, update, options);
      console.log("Trucker info added or updated");
    }
    if (data.type === "Load") {
      await collectionl.insertOne(data);
    }
    //await collection.insertOne(data);
    console.log("Info added to DB");
  }

  // await collection.insertOne(data);
  // console.log("Data saved to MongoDB");

  //   mqttClient.unsubscribe('CodeJam');
  //     mqttClient.end();
  //     client.close();
});

//________________________________API
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});

//truckers
app.get("/truckers", async (req, res) => {
  const db = await connectDB();
  const truckers = await db.collection("truckers").find({}).toArray();
  res.json(truckers);
});

app.get("/trucker/:id", async (req, res) => {
  const db = await connectDB();
  const truckerId = parseInt(req.params.id, 10);

  if (isNaN(truckerId)) {
    return res.status(400).send("Invalid trucker ID");
  }
  const trucker = await db
    .collection("truckers")
    .findOne({ truckId: truckerId });
  if (trucker) {
    res.json(trucker);
  } else {
    res.status(404).send("Trucker not found");
  }
});

//loads
app.get("/loads", async (req, res) => {
  const db = await connectDB();
  const truckers = await db.collection("truckers").find({}).toArray();
  res.json(truckers);
});
