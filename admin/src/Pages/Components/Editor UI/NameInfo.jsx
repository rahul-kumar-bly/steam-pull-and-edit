import {TextField} from "@mui/material";

export default function NameInfo({
    gameDb,
    handleChange
}){
    return (
        <>
            <div className="flex flex-col gap-4 w-2xl p-2" style={{backgroundImage: `linear-gradient(rgba(245, 245, 250, 0.85), rgba(235, 235, 240, 0.85))
                , url(${gameDb.headerImage})`, backgroundSize: "cover", backgroundPosition: "center"}}>
             <TextField
                                    required
                                    id="name"
                                    label="Name"
                                    variant="standard"
                                    value={gameDb.name || ""} 
                                    onChange={handleChange}
                                    fullWidth
                                    type="text"
                                />
                                <TextField
                                    required
                                    id="steamUrl"
                                    label="Steam Url"
                                    variant="standard"
                                    value={gameDb.steamUrl || ""}
                                    onChange={handleChange}
                                    fullWidth
                                    type="text"
                                />

                            </div>

</>
    )
}