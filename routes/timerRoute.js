// server.js
const express = require("express")
const router = express.Router()
const Timer = require("../models/timerModel")

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

router.post("/create-timer", async (req, res) => {
  try {
    if (
      !req.body.seconds ||
      !req.body.minutes ||
      !req.body.hours ||
      !req.body.day
    ) {
      return express.response
        .status(400)
        .send({ message: "schema data timer tidak lengkap" })
    }

    const newTimer = {
      uuid: req.body.uuid,
      seconds: req.body.seconds,
      minutes: req.body.minutes,
      hours: req.body.hours,
      day: req.body.day,
    }

    const timer = new Timer.create(newTimer)

    return res.status(200).send(timer)
  } catch (error) {
    console.log(error.message)
    express.response.status(500).send({ message: error.message })
  }
})

// app.post("/create-timer", async (req, res) => {
//   const { deadline } = req.body
//   const link = uuidv4()
//   const timer = new Timer({ deadline, link })
//   await timer.save()
//   res.json({ link })
// })

export default router
