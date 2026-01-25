import axios from "axios";
// import { gameCache } from "../utils/steamCache.js";

// cache code added but commented; will enable in production

export async function getSteamJsonData(req, res){
    try {
        const appId = req.params.id;
        // const cachedGame = gameCache.get(appId);
        // if (cachedGame) {
        //   console.log(">>> INFO: using cached data for", appId);
        //   return res.status(200).send(cachedGame);          
        // }
        console.log(">>> Fetching ID", appId);
        const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`)
        const game = response.data[String(appId)];
        const gameData = game?.success ? game.data : null;
        // gameCache.set(appId, gameData);
        // console.log("Cache set for appId", appId);
        return res.status(200).send(gameData);
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
      // const cachedGame = gameCache.get(id);
      // if (cachedGame) {
      //   console.log(">>> INFO: using cached data for", id);
      //   results.push(cachedGame);
      //   continue
      // }
      try {
        const response = await axios.get(
          `https://store.steampowered.com/api/appdetails?appids=${id}`, {
            timeout: 2000
          });
        const game = response.data[String(id)];
        const gameData = game?.success ? game.data : null;
        // gameCache.set(id, gameData);
        results.push(gameData);
      } catch (err) {
        console.error(">>> Steam failed for", id);
        results.push({
            message: null,
            appId: id
        });
      }
    }

    res.json(results);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}