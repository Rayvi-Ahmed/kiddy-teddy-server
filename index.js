const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;


// MiddleWare
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('animal toy server is running')
})

app.listen(port, () => {
    console.log(`animal toys server is running${port}`)
})