const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

const { checkUser, checkAdmin } = require("../middlewares/authCheck");
const {
  addProfileFile,
  updateProfileFile,
} = require("../middlewares/fileCheck");
const {
  registerSchema,
  loginSchema,
  userDetailSchema,
} = require("./validationSchema");
const Validator = require("express-joi-validation").createValidator();

// routes

router.get("/api/getAllUsers", checkUser, auth.getUsers);
router.get("/api/getAllUsersForChart", checkAdmin, auth.getUsersForChart);

router.get("/api/getUserDetail/:id", checkUser, auth.getUserDetail);
router.get("/api/search/:search", checkUser, auth.searchUsers);

router.post(
  "/api/userRegister",
  addProfileFile,
  (req, res, next) => {
    req.body.age = parseInt(req.body?.age, 10);
    next();
  },
  Validator.body(registerSchema),
  auth.userRegister
);

router.post(
  "/api/userLogin",

  Validator.body(loginSchema),
  auth.userLogin
);

router.patch(
  "/api/updateUserDetail/:id",

  checkUser,
  (req, res, next) => {
    req.body.age = parseInt(req.body?.age, 10);

    next();
  },
  Validator.body(userDetailSchema),
  updateProfileFile,
  auth.updateUserDetail
);

router.patch(
  "/api/updateAdminDetail",
  checkAdmin,
  (req, res, next) => {
    req.body.age = parseInt(req.body?.age, 10);

    next();
  },
  updateProfileFile,
  Validator.body(userDetailSchema),
  auth.updateAdminDetail
);
router.patch("/api/deactivateUser/:id", checkUser, auth.deactivateUser);

module.exports = router;
