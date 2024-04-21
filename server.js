const express = require('express')
const bodyParser = require('body-parser');
const router = require("./routes/index")
const pool = require('./db')
const port = 3010

const app = express()
app.set("views", "views")
app.set("view engine", "ejs")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"))

//index
app.use("/", router)

//routes
app.get('/students', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM schools')
        res.status(200).send(data.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.post('/', async (req, res) => {
    const name = req.body.name;
    const address = req.body.address;
    try {
        await pool.query('INSERT INTO schools (name, address) VALUES ($1, $2)', [name, address])
        const data = await pool.query('SELECT * FROM schools')
        res.render("index", {title : "Docker sample", students: data.rows})
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.get('/setup', async (req, res) => {
    try {
        await pool.query('CREATE TABLE schools( id SERIAL PRIMARY KEY, name VARCHAR(100), address VARCHAR(100))')
        res.status(200).send({ message: "Successfully created table" })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.all('*', function(req, res) {
    res.redirect("/");
});


app.listen(port, () => console.log(`Server has started on port: ${port}`))