import {useCallback} from "react";

export const useSteamFormInput = (steamData, setSteamData) => {
    return useCallback((e, index = null) => {
        const {id, type, value} = e.target;

        if (type === 'text' || type === 'number' || id === 'shortDescription' || id === 'description') {
            setSteamData(prev => ({
                ...prev,
                [id]: value,
            }))
        }
        if (id === `genre-${index}`) {
            const newGenre = [...steamData.genres]
            newGenre[index] = e.target.value
            setSteamData({...steamData, genres: newGenre})
        }
        if (id === `dev-${index}`){
            const newDevs = [...steamData.devs]
            newDevs[index] = e.target.value
            setSteamData({...steamData, devs: newDevs})
        }
        if (id === `pub-${index}`){
            const newPubs = [...steamData.pubs]
            newPubs[index] = e.target.value
            setSteamData({...steamData, pubs: newPubs})
        }
    }, [steamData, setSteamData]);
}