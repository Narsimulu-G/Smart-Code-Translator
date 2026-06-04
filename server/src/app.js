import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      const isAllowed = 
        allowedOrigins.includes(origin) || 
        origin.endsWith(".vercel.app") || 
        origin === process.env.CLIENT_URL;
        
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Main API Routes
app.use("/api", routes);

// Fallbacks
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
