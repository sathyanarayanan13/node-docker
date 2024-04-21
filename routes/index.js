var express = require("express")
var router = express.Router()
const pool = require('../db')

router.get("/", async (req, res) => {
    const data = await pool.query('SELECT * FROM schools')
    res.render("index", {title : "Docker sample", students: data.rows})
})

module.exports = router