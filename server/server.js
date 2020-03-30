require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const usersRouter = require("./routes/api/users");
const activitiesRouter = require("./routes/api/activities");
const passport = require("passport");
require("./middleware/passport")(passport);
const port = process.env.PORT || 5000;
const path = require('path');
// DB Config
const db = process.env['mongoURI_' + process.env.NODE_ENV];

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  )
  .then(() => console.log("~*~*~*~* MongoDB successfully connected\n\n"))
  .catch(err => console.log(err));

const app = express();

// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// Passport middleware
app.use(passport.initialize());
// Routes
app.use("/api/users", usersRouter);
app.use("/api/activities", activitiesRouter);
// Error handler
app.use(function (err, req, res, next) {
  console.log(err)
  res.status(err.status || 500).json({ 
      code: err.code,
      message: err.message
  });
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

module.exports = app.listen(port, () => console.log(`~*~*~*~* Server up and running on port ${port} !`));
