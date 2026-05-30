import express, {} from 'express';
const app = express();
app.use(express.json());
//In-memory databast
let users = [];
//Get all users
app.get('/users', (req, res) => {
    res.json(users);
});
//Add new user
app.post('/users', (req, res) => {
    const user = req.body;
    users.push(user);
    res.status(201).json(user);
});
const PORT = process.env.port || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map