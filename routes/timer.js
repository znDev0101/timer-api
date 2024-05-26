const express = require("express")
const router = express.Router()
const Timer = require("../models/timer") // Assuming you have a Timer model

// Route to create a new timer
router.post("/api/timer", async (req, res) => {
  try {
    const { endTime } = req.body
    const timer = new Timer({ endTime })
    await timer.save()
    res.status(201).send(timer)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Route to get a timer by UUID
router.get("/timer/:uuid", async (req, res) => {
  try {
    const timer = await Timer.findOne({ uuid: req.params.uuid })
    if (!timer) {
      return res.status(404).send("Timer not found")
    }
    res.send(timer)
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router
