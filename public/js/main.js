// const axios = require("axios");

function infoForm() {
  document.getElementById("info").classList.add("markInfo");
  var form = document.getElementById("infoForm");
  form.submit();
}

function warningForm() {
  document.getElementById("warning").classList.add("markWarning");
  var form = document.getElementById("warningForm");
  form.submit();
}

function errorForm() {
  document.getElementById("error").classList.add("markError");
  var form = document.getElementById("errorForm");
  form.submit();
}

function successForm() {
  document.getElementById("success").classList.add("markSuccess");
  var form = document.getElementById("successForm");
  form.submit();
}

function closeNotification(id) {
  document.getElementById(id).classList.remove("display");
}

function updateNotifications(notifications, type) {
  notifications.forEach((notification) => {
    if (notification.type === type) {
      notification.isClicked === !notification.isClicked;
    }
  });
  return notifications;
}

module.exports = { updateNotifications };
