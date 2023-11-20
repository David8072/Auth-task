const express = require("express");
const cors = require("cors");
const connectdb = require("./db");
var signinRouter = require("./routes/signin");
var loginRouter = require("./routes/login");
var homeRouter = require("./routes/home");


const app = express();
const port = 3000;
app.use(express.json());
app.use(cors({origin:"*"}));
connectdb();

app.get("/",(req,res) => {
    res.send("Hello guys");
});
app.use("/signin",signinRouter);
app.use("/login",loginRouter);
app.use("/home",homeRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });