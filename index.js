const express = require("express");
const cors = require('cors');
const db = require('./config/db');
const app = express();
require('dotenv').config();
app.use(express.json());
const corsOptions = {
  origin: "*",
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors());
const authRoute = require("./routes/auth");
const adminRoute = require("./routes/admin");
app.use('/api', adminRoute);
app.use('/api', authRoute);
app.listen(3001, () => {
  console.log("Server is running at port 3001");
});

