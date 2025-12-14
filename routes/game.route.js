import express from "express";
import {addGame, addMany, fetchGame, fetchGames, updateGame, deleteGame, deleteGames} from "../controllers/game.controller.js";

const router = express.Router();

router.post('/add', addGame)
router.post('/addmany', addMany)
router.get("/fetch/:id", fetchGame)
router.get("/fetchall", fetchGames)
router.post("/update/:id", updateGame)
router.delete("/delete/:id", deleteGame)
router.delete("/deletemany", deleteGames)

router.get("/test", (req, res) => {
    console.log("test is working");
    res.send("Welcome to the test")
})

export default router