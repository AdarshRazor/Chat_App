// 📜 module import -
import express from 'express';
import dotenv from "dotenv";
import connectDB from './config/db.config'
//import fs from 'fs';

dotenv.config();

const app = express()
const PORT = process.env.PORT ;
















// 🏢 Databse connection - 
connectDB();

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