const express = require("express");
const {
    getAllUsers,
    getUserById,
    saveUser,
    getUpdatePage,
    updateUser,
    deleteUser,
    login,
    refreshToken,
} = require("../Controllers/users.controller");

const router = express.Router();

router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.get("/edit/:id", getUpdatePage);

router.patch("/:id", updateUser);

router.post("/", saveUser);

router.delete("/:id", deleteUser);

router.post("/login", login);

router.post("/refreshToken", refreshToken);

module.exports = router;
