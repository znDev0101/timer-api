const mongoose = require("mongoose")
const { v4: uuidv4 } = require("uuid")

// Define the schema for the Timer
const timerSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
  },
  second: {
    type: Number,
    required: true,
  },
  minutes: {
    type: Number,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
})

// Create the Timer model from the schema
const Timer = mongoose.model("Timer", timerSchema)

module.exports = Timer
