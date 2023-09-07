const connectToMongo = require("./db");
const express = require("express");
var cors = require("cors");
connectToMongo();
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
app.use("/api/auth", require("./routes/auth"));
app.use("/api/task", require("./routes/task"));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
