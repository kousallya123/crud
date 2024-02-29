require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const connectDB = require('./config/db');
app.use(cors())
app.use(express.json())

app.use('/', require('./routes/users'))


connectDB();

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`server is runing on port`, port);
})