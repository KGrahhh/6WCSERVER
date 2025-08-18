import express from "express";
import multer from "multer";
import bodyParser from "body-parser";
import path from 'path';
import { fileURLToPath } from "url";
import { dirname } from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname (__filename);
const app = express();
const urlEncoderParser = bodyParser.urlencoded({ extended: false});

app.use(express.static('public'));


// Multer stuff
var storage = multer.diskStorage({
destination: (req, file, callback) => {
callback(null, 'uploads/');
},
filename: (req, file, callback) => {
callback (null, file.originalname);
}
});
var upload = multer({storage: storage}).single('file');

// ===== Page Routes =====
app.get('/', (req, res) => {res.sendFile(__dirname + '/pages/home.html');});

app.get('/userPage', (req, res) => {res.sendFile(__dirname + '/pages/user.html');});

app.get('/student', (req, res) => {res.sendFile(__dirname + '/pages/student.html');});

app.get('/admin', (req, res) => {res.sendFile(__dirname + '/pages/admin.html');});

app.get(/admin/upload, (req, res) => {res.sendFile(__dirname + '/pages/uploadForm.html');});

// ===== API Routes =====

// Get User
app.get('/getUser', (req, res) => {
    const response = {
        firstName: req.query.firstName,
        lastName: req.query.lastName
    };
    console.log("Response is:", response);
    res.end(`Received Data: ${JSON.stringify(response)}`);
});

// Display User with ID
app.get('/user', (req, res) => {
    const { userID, name } = req.query;
    if (userID && name) {
        res.send(`<html><body><h1>User ${name}'s ID is ${userID}</h1></body></html>`);
    } else {
        res.status(400).send('User ID and name are required');
    }
});

// Get Student
app.get('/getStudent', (req, res) => {
    const response = {
        studentID: req.query.studentID,
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        section: req.query.section
    };
    console.log("Response is:", response);
    res.end(`Received Data: ${JSON.stringify(response)}`);
});

// Get Admin
app.get('/getAdmin', (req, res) => {
    const response = {
        adminID: req.query.adminID,
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        department: req.query.department
    };
    console.log("Response is:", response);
    res.end(`Received Data: ${JSON.stringify(response)}`);
});

// Get Upload Form

app.post('/upload', (req, res) => {
upload(req, res, (err) => {
if (err) {
return res.status(500).send('Error uploading file');
}

const username = req.body.username;
const uploadedFile = req.file;

if (!uploadedFile) {
return res.status(400).send('No file uploaded');
}

console.log(`Username: ${username}`);
console.log(`File Path: ${uploadedFile.path}`);

res.end('File and form uploaded successfully');
});
});
// ===== Start Server =====
const server = app.listen(5000, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Server running at http://${host}:${port}`);
});
