const express = require("express")
const {registerUser, findUser, getUser} = require("../Controllers/userController")
const {loginUser} = require("../Controllers/userController")

const router = express.Router();


router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/find/:userId",findUser);
router.get("/",getUser);

module.exports = router;