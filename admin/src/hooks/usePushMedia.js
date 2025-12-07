import {useCallback} from "react";

export const usePushMedia = (steamData, setError, setSteamData) => {
    return useCallback((e, mediaKey)=> {
        console.log('mediaKey is', mediaKey);
        e.preventDefault();
        const formData = new FormData(e.target);
        const formJson = Object.fromEntries(formData.entries());
        const newMediaValue = formJson.sentData;
        if (!newMediaValue) return;
        console.log("newMediaValue is", newMediaValue);
        steamData[mediaKey].push(newMediaValue);
        setSteamData({ ...steamData });

    },[steamData, setError, setSteamData]);
}