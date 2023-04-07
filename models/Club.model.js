const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: String,
  website: String,
  latitude: Number,
  longitude: Number,
});

const Club = mongoose.model("Club", clubSchema);

module.exports = Club;
