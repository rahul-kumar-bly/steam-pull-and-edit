import express from "express";
import {getSteamBatchJsonData, getSteamJsonData} from "../controllers/steam.controller.js";
const route = express.Router();

route.get("/test", (req, res) => {
    console.log("test is working");
    res.send("Welcome to the test")
})

route.get("/get/:id", getSteamJsonData);
route.get("/getbatch/:id", getSteamBatchJsonData);

export default route;