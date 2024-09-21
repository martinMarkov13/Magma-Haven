const mongoose = require("mongoose");

const volcanoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Volcano name is required!"],
    minLength: [2, "Name should be at least 2 characters long"]
  },
  location: {
    type: String,
    required: [true, "Location is required!"],
    minLength: [3, "Location should be at least 3 characters long"]
  },
  elevation: {
    type: Number,
    required: [true, "Elevation is required!"],
    min: [0, "Elevation should be at least 0"]
  },
  lastEruption: {
    type: Number,
    required: [true, "Last eruption is required!"],
    min: [0, "Year is incorrect"],
    max: [2024, "Year is incorrect"]
  },
  image: {
    type: String,
    required: [true, "Image is required!"],
    match: [/^https?:\/\//, "Image is not in the correct format"]
  },
  type: {
    type: String,
    required: [true, "Volcano type is required!"],
    enum: [
      "Supervolcanoes",
      "Submarine",
      "Subglacial",
      "Mud",
      "Stratovolcanoes",
      "Shield",
    ],
  },
  description: {
    type: String,
    required: [true, "Description is required!"],
    minLength: [10, "Description should be at least 10 characters long"]
  },
  voteList: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    }
  ],
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const Volcano = mongoose.model("Volcano", volcanoSchema);

module.exports = Volcano;
