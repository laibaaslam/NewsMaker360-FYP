// changed package.json type to moudle for this impirt tyle require will not be used
import express from "express";
import cors from "cors"
import morgan from "morgan";
import dotenv from "dotenv";
// if .js  not mentied error will occur
import connectDB from "./database/connection.js";
import AuthenticationRouter from "./routes/authroutes.js";
import AdminRoutes from "./routes/adminroutes.js";
import ResultGenerationRouter from "./routes/resultGenerationRoutes.js";
import ReportRouter from "./routes//reportroutes.js";

//configure env
dotenv.config();


//databse config
// connectDB();

//rest object
const app = express();

//middelwares order of exceuction is maintained
app.use(express.json());
// This means that every HTTP response sent by your server will include CORS headers, allowing clients from other origins to access your resources.
app.use(cors());
// for logging http request 
app.use(morgan("dev"));
// default X-Powered-By header that Express sends in HTTP responses by default. This header typically contains information about the server framework being used (in this case, Express), but it can expose unnecessary information about your server stack to potential attackers.
app.disable('x-powered-by')


//routes for Sign up and login
app.use("/api/auth", AuthenticationRouter);
// route for result generation
app.use("/user/generate", ResultGenerationRouter);

// Admin route
app.use("/api/admin", AdminRoutes);

// for report of user
app.use("/api/reports", ReportRouter);

//rest api
app.get("/", (req, res) => {
    res.send("<h1>Welcome to NewsMaker360 App</h1>");
});



//run server only when valid db connection 
connectDB().then(() => {
    const PORT = process.env.PORT || 8080;
    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    server.on("error", (error) => {
        if (error.code === "EADDRINUSE") {
            console.error(`Port ${PORT} is already in use. Stop the other backend process or change PORT in Backend/.env`);
        } else {
            console.error("Failed to start server:", error.message);
        }
        process.exit(1);
    });
}).catch(error => {
    console.error('Failed to connect to the database:', error.message);
});

