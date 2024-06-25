const express = require("express");
const app = express();
const router = express.Router();

const { getUsers, saveUser, putUsers, validateUsers, verifyToken, verifyMobile ,forgotPassword} = require('../controllers/userController');
const Authorization = require('../middleware/autherization');
app.use(router);
router.use(express.json());

//Get all users
router.get("/users/list", getUsers);

//Validate the user -> If phonenumber is exists login else register
router.post("/auth/validate", validateUsers);

//verify token
router.get("/auth/verifytoken", Authorization, verifyToken);

router.post("/auth/verifyMobile", verifyMobile)

router.post("/auth/forgotPassword", forgotPassword)

module.exports = router;