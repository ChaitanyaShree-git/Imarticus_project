require('dotenv').config();
const express = require('express');
const cors = require('cors')
const mongoConnection = require('./config/mongodb');
const movieRouter = require('./routes/movies');
const reviewRoutes = require('./routes/review');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const { authenticate } = require('./middlewares/authMiddleware');
const { requiredRole } = require('./middlewares/verifyRoleMiddleware');

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*'
}))

const PORT = process.env.PORT || 3000;

//Connect to database
mongoConnection();

app.use('/auth', authRouter);
app.use('/movies', movieRouter);
app.use('/users', authenticate, requiredRole(['user']), userRouter)
app.use('/reviews', reviewRoutes);

app.get('/', (req, res) => {
    return res.status(200).send({ message: 'Server is successfully running' })
})

app.use(cors({
  origin: 'https://movies-frontend-five-chi.vercel.app/',
  credentials: true
}));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})