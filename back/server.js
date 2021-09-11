require("dotenv").config();
const express = require("express");
const app = express();
const Filter = require("bad-words");
const filter = new Filter();
const rateLimit = require("express-rate-limit");
const PORT = process.env.PORT || 5000;
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 30 * 1000, // 15 minutes
  max: 1, // limit each IP to 100 requests per windowMs
});

const monk = require("monk");
const cors = require("cors");
app.use(cors());
// connecting to the db using Monk
const db = monk(process.env.MONGO_URI || "localhost/meower");

// get the meows collection
const meows = db.get("meows");
app.use(express.json());
app.get("/", (_, res) => {
  // return all the meows
  meows.find().then((meow) => {
    res.json(meow);
  });
});

function isValid(meow) {
  return (
    meow.name &&
    meow.name.toString().trim() !== "" &&
    meow.content &&
    meow.content.toString().trim() !== ""
  );
}
// apply to all requests
app.use(limiter);

app.post("/", (req, res) => {
  try {
    let { name, content } = req.body;
    isValid(req.body);
    //insert into db
    name = name.toString().trim();
    content = content.toString().trim();
    const meow = {
      // clean the content before storing it in db
      name: filter.clean(name),
      content: filter.clean(content),
    };
    meows.insert(meow).then((createdMeow) => {
      return res.json(createdMeow);
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      msg: "Hey Something went wrong!",
    });
  }
});

app.listen(PORT, () => {
  console.log("Running on Port", PORT);
});
