const connecttomongo = require('./db');
const express = require('express');
const cors = require('cors')
connecttomongo();

const app = express()
const port = 5000
app.use(cors())
app.use(express.json())
app.use('/api/auth',require('./routes/auth'))
app.use("/api/fests",require("./routes/fests"));
app.use("/api/events",require("./routes/events"));
app.use("/api/events/duels",require("./routes/duels"));
app.use("/api/schedule",require("./routes/scheduler"));
app.use("/api/voting",require("./routes/voting"))

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
