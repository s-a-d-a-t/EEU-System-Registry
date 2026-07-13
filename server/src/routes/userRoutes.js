const express =  require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");

router.get(
    "/",
    authenticate,
    userController.getAllUsers
);
// get by id
router.get(
  "/:id",
  authenticate,
  userController.getUserById  
);

//update user
router.put(
    "/:id",
    authenticate,
    userController.updateUser
);

//delete user
router.delete(
    "/:id",
    authenticate,
    userController.deleteUser
);
module.exports = router;