const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Define a schema and model for the timer
const timerSchema = new mongoose.Schema({
  duration: { type: Number, default: 25 * 60 },
  startTime: { type: Date, default: null },
  isRunning: { type: Boolean, default: false },
})

const Timer = mongoose.model("Timer", timerSchema)

// Create a single timer document if it doesn't exist
Timer.findOne().then((timer) => {
  if (!timer) {
    const newTimer = new Timer()
    newTimer.save()
  }
})

app.get("/", async (req, res) => {
  res.json("its works")
})

// Routes
app.get("/timer", async (req, res) => {
  const timer = await Timer.findOne()
  res.json(timer)
})

app.post("/timer/start", async (req, res) => {
  const timer = await Timer.findOne()
  timer.startTime = new Date()
  timer.isRunning = true
  await timer.save()
  res.json(timer)
})

app.post("/timer/stop", async (req, res) => {
  const timer = await Timer.findOne()
  timer.isRunning = false
  await timer.save()
  res.json(timer)
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
