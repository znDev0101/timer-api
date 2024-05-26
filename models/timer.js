const mongoose = require("mongoose")
const { v4: uuidv4 } = require("uuid")

// Define the schema for the Timer
const timerSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
})

// Create the Timer model from the schema
const Timer = mongoose.model("Timer", timerSchema)

module.exports = Timer
