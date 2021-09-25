const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const axios = require("axios");
// const request = require("request");
// const session = require("express-session");
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");

const { closeNotification, noam } = require("./public/js/main");

const app = express();

mongoose.connect("mongodb://localhost:27017/artbrainDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");

// Maximum of 10 requestes per 10 seconds
const rateLimiter = rateLimit({
  windowMs: 10000, //window time
  max: 10, // maximum number of requests in window time
  message: "Too many requestes, please wait and try again later.",
});

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(rateLimiter);

const userSchema = new mongoose.Schema({
  notifications: Array,
});

const User = mongoose.model("User", userSchema);

// const notificationSchema = new mongoose.Schema({
//   type: String,
//   content: String,
//   isClicked: Boolean,
// });

// const Notification = mongoose.model("Notification", notificationSchema);

// const timeToAppear = Math.floor(Math.random() * 6) + 5;
// const timeToLast = Math.floor(Math.random() * 4) + 1;

function initiateNotifications() {

  const infoArray = [
    'Big sale next week',
    'New auction next month'
  ]

  const notifications = [
    {
      type: "info",
      content: infoArray[Math.floor(Math.random() * 2)],
      isClicked: false,
      timeToAppear: Math.floor(Math.random() * 6) + 5,
      timeToLast: Math.floor(Math.random() * 4) + 1,
    },
    {
      type: "warning",
      content: "Limited edition books for next auction",
      isClicked: false,
      timeToAppear: Math.floor(Math.random() * 6) + 5,
      timeToLast: Math.floor(Math.random() * 4) + 1,
    },
    {
      type: "error",
      content: "Last items with limited time offer",
      isClicked: false,
      timeToAppear: Math.floor(Math.random() * 6) + 5,
      timeToLast: Math.floor(Math.random() * 4) + 1,
    },
    {
      type: "success",
      content: "New books with limited edition coming next week",
      isClicked: false,
      timeToAppear: Math.floor(Math.random() * 6) + 5,
      timeToLast: Math.floor(Math.random() * 4) + 1,
    },
  ];


  const newUser = new User({
    notifications: textRules(notifications),
  });

  newUser.save().then(function () {
    User.find({}, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfuly added to database!")
      }
    });
  });
}

function updateNotifications(notifications, type) {
  notifications.forEach((notification) => {
    if (notification.type === type) {
      notification.isClicked = !notification.isClicked;
    }
  });
  return notifications;
}

initiateNotifications();


function textRules(notifications){
  notifications.forEach((notification) => {
    if(notification.content.includes("new") === true || notification.content.includes("New") === true){
      notification.content = notification.content + '~~';
    }
    if(notification.content.includes("limited edition") === true || notification.content.includes("Limited edition") === true){
      if(notification.type === 'warning'){
         notification.content = "LIMITED EDITION books for next auction";
      }
      if(notification.type === 'success'){
        notification.content = "New books with LIMITED EDITION coming next week~~";

      }
    }
    if(notification.content.includes("sale") === true){
      notification.content = notification.content + '!';
    }
  })
  return notifications;
}


app.get("/", function (req, res) {
  initiateNotifications();

  User.findOne()
    .sort({ field: "asc", _id: -1 })
    .limit(1)
    .then((userFound) => {
      res.render("index", {
        notificaitons: userFound.notifications,
        id: userFound._id,
      });
    });
});

app.post("/", function (req, res) {
  const type = req.body.type;
  const id = req.body.id;

  User.findOne({ _id: id }, function (err, userFound) {
    if (!err) {
      let updatedNotifications = updateNotifications(
        userFound.notifications,
        type
      );
      User.updateOne(
        { _id: req.body.id },
        { notifications: updatedNotifications },
        function (err, userFound) {
          if (err) {
            console.log(err);
          } else {
            console.log("Succesfully updated.");
          }
        }
      );
    } else {
      console.log(err);
    }

    res.render("index", {
      notificaitons: userFound.notifications,
      id: userFound._id,
    });
  });
});


app.listen(3000, function () {
  User.deleteMany({}, function (err) {
    if (err) {
      console.log(err);
    }
  });
  console.log("Server started on port 3000");
});