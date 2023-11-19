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
  clientId: "5headkevin",
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

let started = true;
let db = null;
let collectionl = null;
let collectiont = null;
let collectionvan = null;
let collectionreefer = null;
let collectionflatbed = null;

function getDistance(lat1, lon1, lat2, lon2) {
  R = 3958.8;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaphi = ((lat2 - lat1) * Math.PI) / 180;
  const deltalambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaphi / 2) * Math.sin(deltaphi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltalambda / 2) *
      Math.sin(deltalambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function getRelevantTruckersForLoad(load, db, truckers, notifications) {
  const query = { equipType: load.equipmentType };
  const relevantTruckersTemp = await truckers.find(query).toArray();
  const mileage = load.mileage;
  let pref = null;
  if (mileage < 200) {
    pref = "Short";
  } else {
    pref = "Long";
  }
  const relevantTruckersTemp1 = relevantTruckersTemp.filter((trucker) => {
    return trucker.nextTripLengthPreference === pref;
  });

  // const relevantTruckersTemp2 = relevantTruckersTemp1.filter((trucker) => {
  //   return (
  //     getDistance(
  //       trucker.positionLatitude,
  //       trucker.positionLongitude,
  //       load.originLatitude,
  //       load.originLongitude
  //     ) <= 100
  //   );
  // });

  // const distance1 = getDistance(
  //   trucker.positionLatitude,
  //   trucker.positionLongitude,
  //   load.originLatitude,
  //   load.originLongitude
  // );
  // const timetravelled = (distance1 * 1.35 + load.mileage) * 1.2;
  // const estimatedsalary = timetravelled * 30;

  return relevantTruckersTemp;
}

async function uploadNotification(loadIdi, truckerIdi, notifications) {
  const notification = {
    type: "Notification",
    loadId: loadIdi,
    truckerId: truckerIdi,
  };
  notifications.insertOne(notification);
  broadcastNotifications(notification);
  console.log("Trucker notified");
}

mqttClient.on("message", async (topic, message) => {
  const data = JSON.parse(message.toString());

  db = await connectDB();
  collectiont = db.collection("truckers");
  collectionl = db.collection("loads");
  collectionn = db.collection("notifications");

  if (data.type === "Start") {
    console.log("New day detected");
    started = true;
    // db = await connectDB();
    // collectiont = db.collection('truckers');
    // collectionl = db.collection('loads');

    //await collection.insertOne(data);
  } else if (data.type === "End") {
    console.log("End of day detected");
    broadcastEndofDay(data);
    await collectiont.deleteMany({});
    await collectionl.deleteMany({});
    await collectionn.deleteMany({});
    console.log("Deleted previous day");
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
      boradcastNewTrucker(data);
      console.log("Trucker info added or updated");
    }
    if (data.type === "Load") {
      await collectionl.insertOne(data);
      loadId = data.loadId;
      const relevantTruckers = await getRelevantTruckersForLoad(
        data,
        db,
        collectiont,
        collectionn
      );
      broadcastNewLoad(data);
      relevantTruckers.forEach((trucker) => {
        uploadNotification(loadId, trucker.truckId, collectionn);
      });
    }
    //await collection.insertOne(data);
    console.log("Load added to DB");
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
const port = 4000;

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
  const truckers = await db.collection("loads").find({}).toArray();
  res.json(truckers);
});

app.get("/load/:id", async (req, res) => {
  const db = await connectDB();
  const loadId = parseInt(req.params.id, 10);
  if (isNaN(loadId)) {
    return res.status(400).send("Invalid load ID");
  }
  const load = await db.collection("loads").findOne({ loadId: loadId });
  if (load) {
    res.json(load);
  } else {
    res.status(404).send("Load not found");
  }
});

//notifications
//
//app.get("/")
//__________________________________________websocket

const WebSocket = require("ws");
const http = require("http");

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
  console.log("New socket connection");

  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  ws.on("close", function close() {
    console.log("Client disconnected");
  });
});

server.listen(4001, function () {
  console.log("Server is listening on port 4001");
});

function boradcastNewTrucker(trucker) {
  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(trucker));
  });
}

function broadcastEndofDay(end) {
  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(end));
  });
}

function broadcastNewLoad(load) {
  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(load));
  });
}

function broadcastNotifications(notification) {
  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(notification));
  });
}
