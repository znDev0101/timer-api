const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
import timerRoute from "./routes/timerRoute.js"
require("dotenv").config()

const app = express()
const port = process.env.PORT || 5000

app.use(
  cors({
    origin: "*",
  })
)
app.use(express.json())

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.get("/", async (req, res) => {
  res.json("its works")
})

app.use("/timer", timerRoute)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
