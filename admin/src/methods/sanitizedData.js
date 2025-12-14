const sanitizedData = (gData) => ({
        appId: gData.steam_appid || "",
        name: gData.name || "",
        description: gData.detailed_description || "",
        shortDescription: gData.short_description || "",
        price: parseInt(
            gData.price_overview?.final_formatted?.replace("₹", "").replace(",", "")
        ) || 0,
        devs: gData.developers || [],
        pubs: gData.publishers || [],
        website: gData.website || "",
        headerImage: gData.header_image || "",
        capsuleImage: gData.capsule_image || "",
        screenshots: gData.screenshots?.map(s => s.path_thumbnail) || [],
        genres: gData.genres?.map(g => g.description) || [],
        trailer: gData.movies?.map(m => ({
            thumbnail: m.thumbnail,
            trailer: m.dash_h264,
            name: m.name
        })) || [],
        releaseDate: gData.release_date || [],
        steamUrl: `https://store.steampowered.com/app/${gData.steam_appid}`
    });


    export default sanitizeData;