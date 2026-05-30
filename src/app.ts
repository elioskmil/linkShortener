import express, {type Request, type Response} from 'express';
interface User {
    id: number;
    name: string;
}
const app = express();
app.use(express.json());
//In-memory databast
let users: User[] =[];
//Get all users
app.get('/users', (req: Request, res: Response) => {
    res.json(users);
});
//Add new user
app.post('/users', (req: Request, res: Response) => {
    const user: User = req.body;
    users.push(user);
    res.status(201).json(user);
});
const PORT = process.env.port || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});