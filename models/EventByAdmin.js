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
  titre:String,
  sousTitre: String,
  preTexte:String,
  texte1:String,
  texte2: String,
  texte3: String,
  texte4: String,
  picture: String,
  picture2: String,
  picture3: String,
  picture4: String,
  website: String

  

});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
