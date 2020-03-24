const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const users = require("./routes/api/users");
const activities = require("./routes/api/activities");
const passport = require("passport");
require("../config/passport")(passport);
const port = process.env.PORT || 5000;
const path = require('path');
// DB Config
const db = require("../config/keys").mongoURI;

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
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

const app = express();

// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// Passport middleware
app.use(passport.initialize());
// Routes
app.use("/api/users", users);
app.use("/api/activities", activities);
// Error handler
app.use(function (err, req, res, next) {
  console.log(err)
  res.status(err.status || 500).json({ 
      errorCode: err.code,
      errorMsg: err.message
  });
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
