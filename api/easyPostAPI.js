const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 9000;
const Easypost = require("@easypost/api");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/", (req, res) => {
  const api = new Easypost("");
  let response = {};
  const endpoint = req.body.endpoint;

  console.log("id found", req.body);

  if (endpoint === "Create Shipment") {
    response = new api.Shipment(req.body.requestData);
    response.save().then((s) => res.json(s));
  }

  if (endpoint === "Buy Shipment") {
    api.Shipment.retrieve(req.body.requestData.id).then((s) => {
      s.buy(s.lowestRate(), 249.99).then((s) => res.json(s));
    });
  }
});

app.listen(port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);