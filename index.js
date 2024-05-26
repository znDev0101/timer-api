const express = require("express")
const mongoose = require("mongoose")
const { v4: uuidv4 } = require("uuid")
const cors = require("cors")
const http = require("http")
const socketIo = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
})

app.use(cors())
app.use(express.json())

mongoose.connect(
  "mongodb+srv://zulfanurhuda01:zulfatasik28!@timer-countdown.thkne8y.mongodb.net/?retryWrites=true&w=majority&appName=Timer-countdown",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

const timerSchema = new mongoose.Schema({
  endTime: Date,
  uuid: { type: String, unique: true },
})

const Timer = mongoose.model("Timer", timerSchema)

app.post("/api/timer", async (req, res) => {
  const { duration } = req.body
  const endTime = new Date(Date.now() + duration * 1000)
  const uuid = uuidv4()
  const timer = new Timer({ endTime, uuid })
  await timer.save()
  res.send({ endTime, uuid })
})

app.get("/api/timer/:uuid", async (req, res) => {
  const { uuid } = req.params
  const timer = await Timer.findOne({ uuid })
  if (timer) {
    res.send({ endTime: timer.endTime })
  } else {
    res.status(404).send({ error: "Timer not found" })
  }
})

const calculateTimeLeft = (endTime) => {
  const now = new Date()
  const difference = endTime - now
  if (difference <= 0) {
    return "00:00:00:00"
  }
  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((difference / 1000 / 60) % 60)
  const seconds = Math.floor((difference / 1000) % 60)

  return `${String(days).padStart(2, "0")}:${String(hours).padStart(
    2,
    "0"
  )}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

io.on("connection", (socket) => {
  console.log("New client connected")

  socket.on("join_timer", async (uuid) => {
    const timer = await Timer.findOne({ uuid })
    if (timer) {
      socket.join(uuid)

      const interval = setInterval(() => {
        const timeLeft = calculateTimeLeft(timer.endTime)
        if (timeLeft === "00:00:00:00") {
          clearInterval(interval)
        }
        io.to(uuid).emit("timer", { timeLeft })
      }, 1000)

      socket.on("disconnect", () => {
        clearInterval(interval)
      })
    }
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected")
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = app
