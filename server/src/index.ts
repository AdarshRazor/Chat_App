// 📜 module import -
import express, {Request, Response} from 'express';
import dotenv from "dotenv";
import http from 'http';
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from './config/db.config'
import authRouter from './routes/userAuth.routes'
import avatarRoute from './routes/avatar.routes'
import { createWebSocketServer } from './wsServer';
//import fs from 'fs';

dotenv.config();

const app = express()
const PORT = process.env.PORT ;

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


// 🏢 Databse connection - 
connectDB();

// Create HTTP server
const server = http.createServer(app);
// 📩 WebSocket
createWebSocketServer(server);





// // Serve static files from the 'dist' folder
// const frontendDistPath = path.join(__dirname, "..", "frontend", "dist");
// app.use(express.static(frontendDistPath));

// // Serve index.html for all other routes
// app.get("/*", (req: Request, res: Response) => {
//   res.sendFile(path.join(frontendDistPath, "index.html"), (err) => {
//     if (err) {
//       console.error("Error sending file:", err);
//     }
//   });
// });










// 📶 Server here - 
app.listen(PORT, () => {
    console.log(`  `);
    console.log(`  `);
    console.log(`  `);
    console.log(`  `);
    console.log(`  `);
    console.log(`  `);
    console.log(`  `);
    console.log(`  `);
    console.log(`  `);
    console.log(`  `);
    console.log(`  `);
    console.log(`              -- Chat App (Running) --       `);
    console.log(`  `);
    console.log(`  `);
    console.log(`|----------------------------------------------|`);
    console.log(`|  🚀 Server running on http://localhost:${PORT}  |`);
    console.log(`|----------------------------------------------|`);
    console.log(`  `);
    console.log(`Listening ...`);
    console.log('Routes working fine .. ')
    console.log(`  `);
  });





































// // ⚠ Error Logging
// const LOG_FILE = "src/utils/output.txt"; // Path to your log file
// // Function to log errors to the file
// function logError(error: any) {  // Type the error parameter
//     const timestamp = new Date().toISOString();
//     const errorMessage = `${timestamp}: ${error.stack || error.message}\n`; // Include stack trace if available
//     fs.appendFile(LOG_FILE, errorMessage, (err) => {
//         if (err) {
//             console.error("Error writing to log file:", err); // Log if the log file itself has an error
//         }
//     });
//     console.error(errorMessage); // Also log to the console
// }
// // Global error handler middleware
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//     logError(err); // Log the error

//     // Respond to the client (you might want a more user-friendly message in production)
//     res.status(500).send("Something went wrong!"); 

//     next(err); // Pass the error to the default error handler (optional)
// });

// const logDirectory = "src/utils";
// fs.mkdirSync(logDirectory, { recursive: true }); // Create directory recursively

// // Create the log file if it doesn't exist (optional - appendFile will create it if needed)
// fs.openSync(LOG_FILE, 'w'); // 'w' flag will create or overwrite the file.