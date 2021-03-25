const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")

router.post("/api/login", (req, res) => {
	//mocker user
	const user = {
		id: 1,
		username: "brad",
		email: "brad@gmail.com",
	}

	jwt.sign({ user }, "secretkey", (err, token) => {
		res.json({
			token,
			hi: "jsdsd",
		})
	})
})

// =============================== Withings ================================>
router.post("/api/withings/auth", (req, res) => {
	res.json({
		message: "welcome to post",
	})
})

module.exports = router
