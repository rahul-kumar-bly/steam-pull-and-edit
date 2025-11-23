import {useCallback} from "react";

export const useDeleteMedia = (steamData, setError, setSteamData) => {
    return useCallback((mediaKey, index)=> {
        console.log('your data is');
        console.log('mediaKey is', mediaKey);
        console.log('index is', index);
                if (steamData[mediaKey].length === 1) {
                    setError('Can not proceed with removing screenshots, this is the last one!');
                    return 0
                }
                const updatedMedia = steamData[mediaKey].filter(
                    (mediaInArray, mediaIndex) => {
                        const isMatch = mediaIndex === index;
                        return !isMatch;
                    })
                console.log('steamData is', steamData[mediaKey]);
                if (updatedMedia.length < steamData[mediaKey].length) {
                    console.log('item deleting...')
                    setSteamData(prev => ({
                        ...prev,
                        [mediaKey]: updatedMedia
                    }));
                }
    },[steamData, setError, setSteamData]);
}