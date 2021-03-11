import express from "express";
import dotenv from "dotenv";
import path from "path"

dotenv.config()
const app = express()

// Gør at vi kan se/nå filer i public folder
// Alle kan se hvad der ligger i public folderen
//app.use('/static', express.static('public'))
app.use(express.static(path.join(process.cwd(), "public")))

// Something has to go in here
 
app.get("/demo", (req, res) => {
    let a = 124;
    console.log(a);
    res.send("Server is really up");
})

export default app;
