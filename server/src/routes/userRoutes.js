const express =  require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");

router.get(
    "/",
    authenticate,
    userController.getAllUsers
);

router.get(
  "/:id",
  authenticate,
  userController.getUserById  
);
module.exports = router;