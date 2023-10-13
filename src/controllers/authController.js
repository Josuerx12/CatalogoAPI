const UserService = require("../services/userService");
const { updateAvatar } = require("../middleware/uploadPhotos");

class AuthController {
  constructor() {
    this.user = new UserService();
  }

  newUser = async (req, res) => {
    try {
      const token = await this.user.createUser(req.body);
      return res.status(201).json({
        payload: {
          status: "Success",
          message: "User created with success!",
          token,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        payload: { status: "Failed", error: "Failed to create a new user." },
      });
    }
  };
  async login(req, res) {
    try {
      const token = await this.user.login(req.body);
      return res.status(200).json({
        payload: {
          status: "Sucess",
          message: "User logged with success",
          token,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        payload: {
          status: "Failed",
          error: error.message,
        },
      });
    }
  }
  recoveryAccount = async (req, res) => {
    try {
      await this.user.recoveryUser(req.body);
      return res.status(200).json({
        payload: {
          status: "Success",
          message: "E-mail with the new password has been sent with success!",
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({
        payload: {
          status: "Failed",
          error: error.message.includes("User not exists.")
            ? error.message
            : "Fail to recovery your account, try again latter.",
        },
      });
    }
  };
  getUser = async (req, res) => {
    try {
      const user = req.user;
      return res.status(200).json({
        payload: {
          status: "Success",
          message: "User getted with success.",
          user,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({
        payload: {
          status: "Failed",
          error: "Fail to get the refreshed user.",
        },
      });
    }
  };
  editTheUser = async (req, res) => {
    try {
      await this.user.editUser(req.user, req.body, req.file);
      return res.status(200).json({
        payload: {
          status: "Success",
          message: "User edited with success.",
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({
        payload: {
          status: "Failed",
          error: error.message.includes("No data inserted.")
            ? error.message
            : "Fail to edit your account, try again latter.",
        },
      });
    }
  };
  deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
      await this.user.deleteUser(req.user, id);
      return res.status(200).json({
        payload: {
          status: "Success",
          message: `User ${id} deleted with success.`,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({
        payload: {
          status: "Failed",
          error: error.message,
        },
      });
    }
  };
}

module.exports = AuthController;
