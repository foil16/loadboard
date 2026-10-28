# Loadboard

A real-time load board that matches freight loads to nearby truckers and pushes notifications to a live dashboard.

Built at **McGill CodeJam** (November 2023) over a weekend, by a team of four.

<!-- TODO: add a screenshot or GIF of the dashboard here -->

## Tech stack

- **Backend:** Node.js, Express, MQTT (`mqtt.js`), WebSockets (`ws`), MongoDB
- **Frontend:** React, Tailwind CSS

## How it works

1. The server subscribes to the challenge's MQTT feed, which streams `Start`, `Truck`, `Load` and `End` events for a simulated day.
2. Truck positions are upserted into MongoDB, and loads are stored as they arrive.
3. Each new load is matched against truckers:
   - first filtered by equipment type and by trip-length preference (short trips are under 200 miles);
   - then scored on **profit** (load price vs. estimated fuel cost, from Haversine distance plus load mileage) and **deadhead** (empty miles to the pickup, relative to the load's length).
4. Truckers with a viable match get a notification ("Very profitable load", "Short distance", "Viable load"). The notification is saved to MongoDB and broadcast over WebSocket.
5. The React dashboard keeps three live tables open over WebSocket: truckers, loads and notifications.

The REST API on port 4000 exposes `GET /truckers`, `/trucker/:id`, `/loads` and `/load/:id`.

## Running it locally

Requirements: Node.js 18+, a MongoDB database, and an MQTT broker publishing events in the CodeJam format. The hackathon's broker is no longer available, so you'll need to point it at your own.

**Server** (REST on :4000, WebSocket on :4001):

```bash
cd server
npm install
cp .env.example .env   # fill in MONGODB_URI and the MQTT settings
node server.js
```

**Dashboard** (port 3000), in a second terminal:

```bash
cd react/loadboard
npm install
npm start
```
