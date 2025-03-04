// 📜 module import -
import express, {Request, Response} from 'express';
import dotenv from "dotenv";
import http from 'http';
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from './config/db.config'
import authRouter from './routes/userAuth.routes'
import avatarRoute from './routes/avatar.routes'
import { startSocketServer } from './wsServer';
//import fs from 'fs';

dotenv.config();

const app = express()
const PORT = process.env.PORT ;

// 📶 Server here - 
app.listen(PORT, () => {
  console.log(`  `);
  console.log(`              -- Chat App (Running) --       `);
  console.log(`|----------------------------------------------|`);
  console.log(`|  🚀 Server running on http://localhost:${PORT}  |`);
  console.log(`|----------------------------------------------|`);
  console.log(`  `);
  console.log(`Listening ...`);
  console.log(`  `);
});

// 🔻 Middlewares
app.use(express.json());
app.use(cookieParser());
// CORS Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
  credentials: true,
  exposedHeaders: ['authorization']
};

app.use(cors(corsOptions));

// 🔗 APIs
app.get('/', (req: Request, res: Response)=> {
  res.send('✅ You hit the server ...')
  return
})
// 👤 User amd Auth Router
app.use('/api/auth', authRouter)
app.use('/api/avatar', avatarRoute)

// 📩 WebSocket
startSocketServer(3002);

// 🏢 Databse connection - 
connectDB();