const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: String,
  hour: String,
  datePrecise:String,
  localisation: {
    location: {
      lat: Number,
      lng: Number,
    },
    adress: String,
  },
  NumberImage: Number,
  numberPlayerNeed:Number,

  requestParticipation: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  participant: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
