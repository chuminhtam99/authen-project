const User = require("../models/User");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const getAllUser = async (req, res) => {
  const allUser = await User.find({});
  if (allUser) {
    res.status(200).json({
      success: true,
      message: allUser,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "db user",
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExistingUser) {
      res.status(400).json({
        success: false,
        message: "Find duplicate user",
      });
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const newlyCreatedUser = await User.create({
        username: username,
        email: email,
        password: hashedPassword,
        role: role || "user",
      });
      if (newlyCreatedUser) {
        res.status(201).json({
          success: true,
          message: "register okela",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "error in registering",
        });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const currentUser = await User.findOne({
      username,
    });
    if (!currentUser) {
      res.status(400).json({
        success: false,
        message: "cannot find username in db",
      });
    } else {
      if (bcrypt.compareSync(password, currentUser.password)) {
        const accessToken = jwt.sign(
          {
            userId: currentUser._id,
            username: currentUser.username,
            role: currentUser.role,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "60m",
          }
        );

        res.status(200).json({
          success: true,
          message: "find usename ok, authentication ok",
          accessToken,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "authentication failed",
        });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong in login user! Please try again",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.aaa.userId;
    const { oldPassword, newPassword } = req.body;
    // find the password of userid, then compare to the newly entered password
    const currentUser = await User.findOne({
      _id: userId,
    });
    if (currentUser) {
      // if oldpassword is wrong, notify that user should reenter old pw
      const oldPwIsTrue = bcrypt.compareSync(oldPassword, currentUser.password);
      if (oldPwIsTrue) {
        // check if newPw == oldPw:
        if (oldPassword == newPassword) {
          res.status(400).json({
            success: false,
            message: "enter a new pw",
          });
        } else {
          // encrypt new pw and make it in db
          const salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync(newPassword, salt);
          currentUser.password = hashedPassword;
          await currentUser.save();
          res.status(200).json({
            success: true,
            message: "pw changed ok",
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "old pw is false",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "cannot find the user with token",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong in change password!",
    });
  }
};
module.exports = { registerUser, loginUser, getAllUser, changePassword };
