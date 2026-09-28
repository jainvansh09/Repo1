const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 5000;

const dataFile = path.join(__dirname, "student.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(__dirname));


// ================= LOGIN =================

app.post("/api/login", async (req, res) => {

    const { userId, password } = req.body;

    if (!userId || !password) {
        return res.status(400).json({
            success: false,
            message: "User ID and password are required"
        });
    }

    try {

        const students = JSON.parse(
            fs.readFileSync(dataFile, "utf8")
        );

        const student = students.find(
            student => student.userId === userId
        );

        if (!student) {
            return res.status(401).json({
                success: false,
                message: "Invalid User ID or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            student.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid User ID or password"
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            student: {
                name: student.name,
                userId: student.userId,
                rollNo: student.rollNo,
                branch: student.branch,
                semester: student.semester,
                email: student.email,
                phone: student.phone
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
});


// ================= REGISTER STUDENT =================

app.post("/api/students", async (req, res) => {

    const {
        name,
        rollNo,
        branch,
        semester,
        email,
        phone,
        userId,
        password
    } = req.body;

    // Validate fields
    if (
        !name ||
        !rollNo ||
        !branch ||
        !semester ||
        !email ||
        !phone ||
        !userId ||
        !password
    ) {

        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {

        const students = JSON.parse(
            fs.readFileSync(dataFile, "utf8")
        );

        // Check duplicate User ID
        const existingUser = students.find(
            student => student.userId === userId
        );

        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "User ID already exists"
            });
        }

        // Check duplicate roll number
        const existingRollNo = students.find(
            student => student.rollNo === rollNo
        );

        if (existingRollNo) {

            return res.status(409).json({
                success: false,
                message: "Roll number already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = {

            id: Date.now(),

            name,

            rollNo,

            branch,

            semester,

            email,

            phone,

            userId,

            password: hashedPassword
        };

        students.push(newStudent);

        fs.writeFileSync(
            dataFile,
            JSON.stringify(students, null, 2)
        );

        res.status(201).json({

            success: true,

            message: "Student registered successfully",

            student: {
                name,
                userId,
                rollNo,
                branch,
                semester,
                email,
                phone
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to register student"
        });
    }
});


// ================= GET STUDENTS =================

app.get("/api/students", (req, res) => {

    try {

        const students = JSON.parse(
            fs.readFileSync(dataFile, "utf8")
        );

        // Don't expose passwords
        const safeStudents = students.map(student => ({
            id: student.id,
            name: student.name,
            rollNo: student.rollNo,
            branch: student.branch,
            semester: student.semester,
            email: student.email,
            phone: student.phone,
            userId: student.userId
        }));

        res.json({
            success: true,
            count: safeStudents.length,
            students: safeStudents
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Unable to read student data"
        });
    }
});


// ================= PAGES =================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "index.html")
    );

});

app.get("/register", (req, res) => {

    res.sendFile(
        path.join(__dirname, "register.html")
    );

});

app.get("/welcome", (req, res) => {

    res.sendFile(
        path.join(__dirname, "welcome.html")
    );

});


// ================= SERVER =================

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});