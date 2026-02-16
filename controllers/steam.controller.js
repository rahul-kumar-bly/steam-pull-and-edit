import axios from "axios";
import redisClient from "../utils/cache.js";

// import { gameCache } from "../utils/steamCache.js";

// cache code added but commented; will enable in production

export async function getSteamJsonData(req, res){
    try {
          const appId = req.params.id;
          console.log(">>> Fetching ID", appId);
          const cacheKey = `game:${appId}`;
          const cachedGame = await redisClient.get(cacheKey);
          if (cachedGame){
            console.log(">>> INFO: using cached data for", appId);            
            return res.status(200).json(JSON.parse(cachedGame));
          }
          const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`)
          const game = response.data[String(appId)];
          const gameData = game?.success ? game.data : null;
          await redisClient.set(cacheKey, JSON.stringify(gameData), {EX: 60});
          return res.status(200).json(gameData);
        }
        catch (err) {
          console.log(err);
          return res.send(err.message);
    }      
}

// https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=413150


export async function getSteamBatchJsonData(req, res) {
  const ids = decodeURIComponent(req.params.id)
    .split(",")
    .map(id => id.trim());
  console.log(">>> AppIds are", ids);


  const results = [];
  try {    
    for (const id of ids) {
      console.log(">>> Fetching ID", id);
      try {
        const cachedGame = await redisClient.get(`game:${id}`);
        if (cachedGame){
          console.log(">>> INFO: using cached data for", id);
          results.push(JSON.parse(cachedGame));
        }
        else {
          const response = await axios.get(
            `https://store.steampowered.com/api/appdetails?appids=${id}`, {
              timeout: 2000
            });
          const game = response.data[String(id)];
          const gameData = game?.success ? game.data : null;
          if (gameData) {
            results.push(gameData);
            await redisClient.set(`game:${id}`, JSON.stringify(gameData), {EX: 60});
          }
        }
      } catch (err) {
        console.error(">>> Steam failed for", id);
      }
    }

    res.json(results);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}