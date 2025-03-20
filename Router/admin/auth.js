const { Router } = require("express");
const videocatrouter = require("./videocat");
const { adminDetailsRouter } = require("./adminDetails");

const adminRouter = Router()
adminRouter.use("/videocatrouter", videocatrouter)
// adminRouter.use("/admindetails", adminDetailsRouter)

module.exports= {adminRouter}