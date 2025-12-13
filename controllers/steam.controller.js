import axios from "axios";

export async function getSteamJsonData(req, res){
    try {
        const appId = req.params.id;
        const steamRes = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`)
        const data = await steamRes.json();
        if(data[appId]['success']){
            res.status(200).send(data)
        } else {
            res.status(404).send(`Unable to fetch data for this game ${appId}`);
        }
    }
    catch (err) {
        console.log(err);
        res.send(err.message)
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
        const response = await axios.get(
          `https://store.steampowered.com/api/appdetails?appids=${id}`, {
            timeout: 2000
          });
        const game = response.data[String(id)];
        results.push(game?.success ? game.data : null);
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