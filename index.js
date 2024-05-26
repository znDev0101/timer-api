const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const http = require("http")
const socketIo = require("socket.io")
const timerRoutes = require("./routes/timer")

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow any origin
    methods: ["GET", "POST"], // Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  },
})

app.use(cors()) // Use the cors middleware
app.use(express.json())
app.use("/api", timerRoutes)

// Basic route to test server
app.get("/", (req, res) => {
  res.send("Backend is running")
})

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://zulfanurhuda01:zulfatasik28@timer-countdown.thkne8y.mongodb.net/?retryWrites=true&w=majority&appName=Timer-countdown",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error))

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
