const { Router } = require("express");
const { signup } = require("../../Controller/admin/adminDetails");

const adminDetailsRouter =  Router()
adminDetailsRouter.use('/',signup )

module.exports= {
    adminDetailsRouter
}