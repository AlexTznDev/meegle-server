const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
  },
  date:String,
  hour:String,
  player:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }

});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
