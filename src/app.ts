import express from "express";
import dotenv from "dotenv";
dotenv.config()
import path from "path";
const app = express()
import friendsRoutes from "./routes/FriendRoutes";
import { ApiError } from "./errors/apiError";
const debug = require("debug")("app");
import {Request, Response} from "express";
import logger, { stream } from "./middleware/logger";
import authMiddleware from "./middleware/basic-auth";
const cors = require('cors');

// Winston/Morgan-logger
const morganFormat = process.env.NODE_ENV == "production" ? "combined" : "dev"
app.use(require("morgan")(morganFormat, { stream }));
//logger.log("info", "Server started");
app.set("logger", logger);
// The line above sets the logger as a global key on the application object
// You can now use it from all your middlewares like this req.app.get("logger").log("info","Message")
// Level can be one of the following: error, warn, info, http, verbose, debug, silly
// Level = "error" will go to the error file in production

// Simple logger
// Middleware, logger, kald response eller next for at kunne komme videre
/* app.use((req, res, next) => {
    debug(new Date().toLocaleDateString(), req.method, req.originalUrl, req.ip);
    next();
}) */

// Gør at man må tilgå public folderen
app.use(express.static(path.join(process.cwd(), "public")))

app.use(cors());

app.use("/api/friends", authMiddleware, friendsRoutes)

app.get("/demo", (req, res) => {
    res.send("I work!!")
})

//Vi ender her hvis ingen andre middelwares ovenover laver et respons
//404 handlers for api-requests
app.use("/api", (req:any, res:any, next:any) => {
    /* if (req.originalUrl.startsWith("/api")) { */
        res.status(404).json({errorCode:404, msg: "not found"})
    /* } else {
        next()
    } */
})

app.use((err:any, req:Request, res:Response, next:Function) => {
    if (err instanceof (ApiError)) {
        //const e = <ApiError>err;
        const errorCode = err.errorCode ? err.errorCode : 500
        res.status(errorCode).json({errorCode: 404, msg: "not found"})
    } else {
        next(err)
    }
})


//const facade = new FriendsFacade;

// Gør at vi kan se/nå filer i public folder
// Alle kan se hvad der ligger i public folderen
//app.use('/static', express.static('public'))
/* app.use(express.static(path.join(process.cwd(), "public")))

// Something has to go in here
 
app.get("/demo", (req, res) => {
    res.send("Server is really up");
});

app.get("/api/friends", (req, res) => {
    let x = FriendsFacade.getAllFriends().then(values => res.send(values));
});

app.get("/api/friends/:id", (req, res) => {
    const em = req.params.id;
    let friend = FriendsFacade.getFrind(em).then(val => res.send(val));
}); */

export default app;
