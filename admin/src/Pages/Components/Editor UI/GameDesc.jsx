import {Button, TextField, ButtonGroup, IconButton} from "@mui/material";

export default function GameDesc({
    gameDb,
    handleChange,
}){
    return (
        <>
            <TextField
                required
                id="description"
                label="Description"
                variant="standard"
                value={gameDb.description}
                onChange={handleChange}
                multiline
                rows={10}
                fullWidth
                type="text"
            />
            <TextField
                required
                id="shortDescription"
                label="Short Description"
                variant="standard"
                value={gameDb.shortDescription}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                type="text"
            />
        </>

    )
}
