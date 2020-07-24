require('dotenv').config();
const express = require("express");
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const usersRouter = require("./routes/api/users");
const activitiesRouter = require("./routes/api/activities");
const passport = require("passport");
require("./middleware/passport")(passport);
const port = process.env.PORT || 5000;
const path = require('path');
const compression = require('compression');
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
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', socket => {
  // Join room based on userId
  socket.on('userConnected', (data) => {
    // console.log('User connected', data.userId)
    socket.join(data.userId);
  });
  // Emit the action to any other clients the user may be using
  socket.on('new action', (data) => {
    // console.log('new action:', data)
    socket.to(data.userId).emit('action', data.action);
  });

  socket.on('disconnect', () => {
    socket.leave;
    // console.log('user disconnected')
  })
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(cors());
app.use(passport.initialize());

// Routes
app.use("/api/users", usersRouter);
app.use("/api/activities", activitiesRouter);
// For cronjob
app.get('/ping', (req, res) => {
  return res.send('ping');
});

// Error handler
app.use(function (err, req, res, next) {
  console.log(err)
  res.status(err.status || 500).json({ 
      code: err.code,
      message: err.message
  });
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build', {'maxage': '7d'})));

  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

module.exports = server.listen(port, () => console.log(`~*~*~*~* Server up and running on port ${port} !`));
