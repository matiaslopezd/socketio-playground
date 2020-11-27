/**
 * @name socketio-playground-server
 * @author Videsk
 * @license MIT
 * @website https://videsk.io
 *
 * Fork this project and use it to play
 * with socketio-server.
 *
 * This websocket server is focus in play with
 * custom configuration, authentication headers,
 * create and verify JWT and other general things.
 *
 * You can find more examples in https://open.videsk.io
 */
const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const randomUA = require("user-agents");

// NPM: https://www.npmjs.com/package/express-useragent
const expressUserAgent = require("express-useragent");
app.get("/express-useragent", function (req, res) {
  const ua = new randomUA().toString();
  res.header("Content-Type", "application/json");
  res.json({
    ua,
    parsed: expressUserAgent.parse(ua)
  });
});

// NPM: https://www.npmjs.com/package/useragent
const userAgent = require("useragent");
app.get("/useragent", function (req, res) {
  const ua = new randomUA().toString();
  const method = req.query.cache ? "lookup" : "parse";
  res.header("Content-Type", "application/json");
  res.json({
    ua,
    parsed: userAgent[method](ua)
  });
});

// NPM: https://www.npmjs.com/package/ua-parser-js
const userAgentJS = require("ua-parser-js");
app.get("/userAgentJS", function (req, res) {
  const ua = new randomUA().toString();
  res.header("Content-Type", "application/json");
  res.json({
    ua,
    parsed: userAgentJS(ua)
  });
});

const apiBenchmark = require("api-benchmark");

const services = {
  benchmark: `http://localhost:${port}/`
};

const routes = {
  "express-useragent": "express-useragent",
  useragent: "useragent",
  "useragent-with-cache": {
    route: "useragent",
    query: {
      cache: true
    }
  },
  "user-agent-js": "userAgentJS"
};

app.get("/", async (req, res) => {
  const { json = false, samples = 40, mode = "sequence" } = req.query;
  res.set("Content-Type", "text/html");
  apiBenchmark.compare(
    services,
    routes,
    { runMode: mode, minSamples: samples },
    (err, results) => {
      if (!json) apiBenchmark.getHtml(results, (error, html) => res.send(html));
      else res.send(results);
    }
  );
});

module.exports = {
  port,
  server
};
