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


router.post("/login", login);          
router.post("/refreshToken", refreshToken);
router.get("/", getAllUsers);         
router.get("/edit/:id", getUpdatePage);
router.post("/", saveUser);            

router.get("/:id", getUserById);       
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);


module.exports = router;
