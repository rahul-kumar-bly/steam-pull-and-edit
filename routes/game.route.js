import express from "express";
import {addGame, fetchGame, fetchGames, updateGame, deleteGame} from "../controllers/game.controller.js";

const router = express.Router();

router.post('/add', addGame)
router.get("/fetch/:id", fetchGame)
router.get("/fetchall", fetchGames)
router.post("/update/:id", updateGame)
router.delete("/delete/:id", deleteGame)

router.get("/test", (req, res) => {
    console.log("test is working");
    res.send("Welcome to the test")
})

export default router