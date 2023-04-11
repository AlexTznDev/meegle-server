const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  latitude: String,
  longitude: String, 
  date:String,
  hour:String,
  description:String,

requestParticipation:[

  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }

],

  participant:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ]
,
  typeEvent:{
    type:String,
enum:[
  "Sport",
  "Drink & Food",
  "Concert",
  "Visite",
  "NightClub",
  "Evenement organisé"
]
  },
  titre: String,
  image: String

});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
