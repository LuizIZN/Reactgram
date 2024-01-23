const express = require("express");
const router = express.Router();

// Controller
const {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
  follow,
  unfollow,
  removeFollower,
  getUserFollowed,
  getUserFollowers,
  deactivateAccount,
} = require("../controllers/UserController.js");

// middlewares
const validate = require("../middlewares/handleValidation");
const {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
} = require("../middlewares/userValidation");
const authGuard = require("../middlewares/authGuard.js");
const { imageUpload } = require("../middlewares/imageUpload.js");

// routes
router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);
router.get("/profile", authGuard, getCurrentUser);
router.put(
  "/",
  authGuard,
  userUpdateValidation(),
  validate,
  imageUpload.single("profileImage"),
  update
);
router.get("/:id", getUserById);

router.put("/profile/follow/:id", authGuard, follow);
router.put("/profile/unfollow/:id", authGuard, unfollow);
router.put("/profile/remove-follower/:id", authGuard, removeFollower);
router.get("/profile/followed", authGuard, getUserFollowed);
router.get("/profile/followers", authGuard, getUserFollowers);
router.put("/profile/deactivate", authGuard, deactivateAccount);

module.exports = router;
