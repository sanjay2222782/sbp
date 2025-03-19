const express = require("express");
const { publicrouter } = require("./Router/user/user");
require("dotenv").config();
const http = require("http");
const cors = require("cors");
const setupSocket = require("./socket/socketManager");
const app = express()
const server = http.createServer(app);
setupSocket(server);
const path = require("path");
const videocatrouter = require("./Router/admin/videocat");
const { userMiddleware } = require("./middleware/middleware");
const { authrouter } = require("./Router/user/auth");
const socketManager = require("./socket/socketManager");
require("./DB/db")

const port = process.env.PORT
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

IP = process.env.IP
app.use("/user", publicrouter)
app.use("/authuser", userMiddleware , authrouter)
app.use("/admin", videocatrouter)
const io = socketManager(server)
server.listen(port,IP, ()=>{
    console.log(`server is runing on ${IP}:${port}`)
})   