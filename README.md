# Daily Metrolink Schedules API

API Host: https://mysterious-brushlands-30472.herokuapp.com/

Endpoints:

Routes: https://mysterious-brushlands-30472.herokuapp.com/api/v1/routes

Schedules: https://mysterious-brushlands-30472.herokuapp.com/api/v1/schedules/{route-id}

The Daily Metrolink Schedules API provides endpoints for the following:

- Routes served by Metrolink
- Schedules of the trips for a given route for the current day

This api is used by the [Daily Metrolink Schedules app](https://github.com/tyricec/daily-metrolink-schedules) for display of the schedules in a vertical sliced table.

## Getting Started

### Requirements

- NodeJS
- npm
- MongoDB

### Installation

First, install the projects dependencies:

```bash
npm install
```

Next, start up a mongo server. Depends on your environment, but for UNIX systems:

```bash
mongod
```

Next, set up config.json to use the url of desired mongo server:

```json
{
  "mongoUrl": "mongodb://localhost:27017/gtfs",
  "agencies": [
    {
      "agency_key": "metrolink",
      "url": "https://transitfeeds.com/p/metrolink/332/latest/download",
      "exclude": [
        "shapes"
      ]
    }
  ]
}
```

Now, run the import command fo all the data required for the api:

```bash
npm run import
```

Finally, run the start command to load up the server

```bash
npm run start
```

## Deployment

Since this app runs on heroku, all that is required to run to deploy this app is to push to a heroku remote. The import of all the data runs on every push, so the only requirement is to have a mongo addon on the heroku remote.

## Built With

- [Express](https://expressjs.com/)
- [node-gtfs](https://github.com/BlinkTagInc/node-gtfs)
