// server.js
const express = require("express")
const http = require("http")
const mongoose = require("mongoose")
const socketIo = require("socket.io")
const cors = require("cors")
const { v4: uuidv4 } = require("uuid")

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
})

const corsOptions = {
  origin: "https://deadline-timer.vercel.app/",
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json())

mongoose.connect(
  "mongodb+srv://zulfanurhuda01:zulfatasik28@timer-countdown.thkne8y.mongodb.net/?retryWrites=true&w=majority&appName=Timer-countdown",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

const TimerSchema = new mongoose.Schema({
  deadline: Date,
  link: String,
})

const Timer = mongoose.model("Timer", TimerSchema)

app.post("/create-timer", async (req, res) => {
  const { deadline } = req.body
  const link = uuidv4()
  const timer = new Timer({ deadline, link })
  await timer.save()
  res.json({ link })
})

io.on("connection", (socket) => {
  console.log("New client connected")

  socket.on("join", async (link) => {
    const timer = await Timer.findOne({ link })
    if (timer) {
      socket.join(link)
      io.to(link).emit("timer", timer.deadline)
    }
  })

  socket.on("start-timer", async ({ link, deadline }) => {
    const timer = await Timer.findOne({ link })
    if (timer) {
      timer.deadline = deadline
      await timer.save()
      io.to(link).emit("timer", timer.deadline)
    }
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected")
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
