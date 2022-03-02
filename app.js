const connecttomongo = require('./db');
const express = require('express');
const cors = require('cors')
let session = require('express-session');
connecttomongo();

const app = express()
const port = 5000
app.use(cors())
app.use(session({secret: 'keepitbetterasasecret'}))
app.use(express.json())
app.use('/api/auth',require('./routes/auth'))
app.use("/api/fests",require("./routes/fests"));
app.use("/api/competitions",require("./routes/competitions"));
app.use("/api/schedule",require("./routes/scheduler"));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
