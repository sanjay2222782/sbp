const { Router } = require("express");
const { likevideo, unlikevideo, likelist } = require("../../Controller/user/like");

const likerouter = Router()
likerouter.post("/likevideo", likevideo)
likerouter.delete("/unlike", unlikevideo)
likerouter.get("/likelist", likelist)
module.exports= {likerouter}