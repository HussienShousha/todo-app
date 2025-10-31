const usersModel = require("../Models/users.models");
const todosModel = require("../Models/todos.models");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { promisify } = require("util");
const dbConnect = require("../dbConnect");


exports.getAllUsers = async (req, res, next) => {
    await dbConnect();
    let users = await usersModel.find({});
    try {
        res.status(200).render("index", { users });
    } catch (error) {
        res.status(500).json({ message: "fail" , error: error});
    }
};

exports.getUserById = async (req, res, next) => {
    await dbConnect();
    let { id } = req.params;
    try {
        let user = await usersModel.findById(id);
        if (!user) return res.status(404).json({ message: "user is Not Found" });
        res.status(200).json({ message: "Success", data: user });
    } catch (error) {
        res.status(500).json({ message: "fail" , error: error});
    }
};

exports.saveUser = async (req, res, next) => {
    await dbConnect();
    console.log("Form data received:", req.body);
    let user = req.body;
    try {
        let newUser = await usersModel.create(user);
        res.status(201).redirect("/users");
    } catch (error) {
        res.status(400).json({ message: "fail", error: error });
    }
};

exports.getUpdatePage = async (req, res) => {
    await dbConnect();
  try {
    let user = await usersModel.find({ _id: req.params.id });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("edit", { user, dobFormatted: user[0].dob ? user[0].dob.toISOString().split("T")[0] : ""})
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.updateUser = async (req, res, next) => {
    await dbConnect();
    let user = req.body;
    let { id } = req.params;

    try {
        let newUser = await usersModel.findByIdAndUpdate(
            id,
            { $set: user },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "user is Not Found" });
        res.status(201).redirect("/users");
    } catch (error) {
        res.status(500).json({ message: "fail" , error: error});
    }
};

exports.deleteUser = async (req, res, next) => {
    await dbConnect();
    const { id } = req.params;
    let user = await usersModel.findByIdAndDelete(id);
    try {
        if (!user) {
            return res.status(404).json({ message: "User is Not Found" });
        }
        await todosModel.deleteMany({ userId: req.params.id });

        res.status(204).redirect("/users");
    } catch (error) {
        res.status(500).json({ message: "Error" , error: error});
    }
};

exports.login = async (req, res) => {
    await dbConnect();
    let { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            message: "you must provide email and password",
        });
    }

    let user = await usersModel.findOne({ email: email });

    if (!user) {
        return res.status(404).json({
            message: "This User Not Found",
        });
    }
    let isVaild = await bcrypt.compare(password, user.password);

    if (!isVaild) {
        return res.status(401).json({
            message: "Invaild eamil or password",
        });
    }

    let token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );
    let refreshToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: "2d" }
    );

    await usersModel.findOneAndUpdate(
        { _id: user.id },
        { refreshToken: refreshToken }
    );

    res.status(201).json({
        message: "Success",
        token,
        refreshToken,
    });
};

exports.refreshToken = async (req, res, next) => {
    await dbConnect();
    let { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({
            message: "refreshToken is required",
        });
    }

    try {
        let decode = await promisify(jwt.verify)(
            refreshToken,
            process.env.JWT_REFRESH_TOKEN_SECRET
        );

        let user = await usersModel.findOne({ _id: decode.id });

        if (!user || user.refreshToken != refreshToken) {
            return res.status(403).json({
                message: "invaild refreshToken",
            });
        } else {
            let token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "2h" }
            );
            res.status(201).json({
                message: "Success",
                token,
            });
        }
    } catch (error) {
        res.status(403).json({
            message: "Bad Request",
            error: error.message,
        });
    }
};
