import { SmallBlueButton, SmallRedButton } from "../SmallButtons"
import InputAdornment from '@mui/material/InputAdornment';
import {TextField, Input, InputLabel} from "@mui/material";
import dayjs from "dayjs";

export default function MetaInfo({
    gameDb,
    handleChange,
    handleDeleteMedia,
    handleAddGenre,
    handleAddDevs,
    handleAddPubs
}){
    return (
        <>
            <TextField
                id="website"
                label="Website"
                variant="standard"
                value={gameDb.website}
                onChange={handleChange}
                fullWidth
                type="text"
            />
                <div className="flex flex-col gap-1 flex-wrap">
                    <div className="flex flex-row gap-2 items-center">
                    <InputLabel htmlFor="genres">Genres</InputLabel>
                            <SmallBlueButton text="+" tooltip="Add new genre" onClickHandle={handleAddGenre} />
                    </div>
                                        <div className="p-2 bg-slate-200 flex flex-col gap-2">
                                            {gameDb.genres && gameDb.genres.map((item, index) => (
                                                <span key={index} className="flex flex-row items-center gap-10 justify-between">
                                                <TextField
                                                    required
                                                    key={index}
                                                    id={`genre-${index}`}
                                                    // defaultValue="genre"
                                                    variant="standard"
                                                    value={item}
                                                    onChange={(e)=> handleChange(e,index)}
                                                />
                                                <SmallRedButton text="&times;" tooltip="Delete this genre" onClickHandle={() => handleDeleteMedia(index, "genres")} />
                                                </span>
                                            ))}
                                        </div>
                                        <div>Reload Genres</div>
                                    </div>
                                    <div className="flex flex-col gap-1 flex-wrap">
                                        <InputLabel htmlFor="price">Price</InputLabel>
                                        <Input
                                            id="price"
                                            type="number"
                                            label="Price"
                                            value={gameDb.price}
                                            onChange={handleChange}
                                            startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                                                />
                                    </div>

                                    <div className="flex flex-col gap-1 flex-wrap">
                                        <InputLabel htmlFor="Release Date">Release Date</InputLabel>
                                        {gameDb.releaseDate.map((d, index) =>
                                        <>
                                        {d.coming_soon ? <p> Coming Soon </p> :
                                            <Input
                                                id="date"
                                                type="date"
                                                label="date"
                                                value={dayjs(d?.date).format("YYYY-MM-DD")}
                                                onChange={handleChange}
                                                />
                                        }
                                        </>
                                        )}
                                        {/* 1920290 - barkour not released yet */}
                                    </div> 

                                    <div  className="flex flex-col gap-1 flex-wrap">
                                        <div className="flex flex-row gap-2 items-center">
                                        <InputLabel htmlFor="developers">Developers</InputLabel>
                                                <SmallBlueButton text="+" tooltip="Add new developer" onClickHandle={handleAddDevs} />
                                        </div>


                                        <div className="p-2 bg-slate-200 flex flex-col gap-2">
                                            {gameDb.devs && gameDb.devs.map((item, index) => (
                                            <span key={index} className="flex flex-row items-center gap-10 justify-between">
                                                <TextField
                                                    required
                                                    key={index}
                                                    id={`dev-${index}`}
                                                    // defaultValue="dev"
                                                    variant="standard"
                                                    value={item}
                                                    onChange={(e)=> handleChange(e,index)}
                                                />
                                                <SmallRedButton text="&times;" tooltip="Delete this developer entry" onClickHandle={() => handleDeleteMedia(index, "devs")} />
                                            </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div  className="flex flex-col gap-1 flex-wrap">


                                        <div className="flex flex-row gap-2 items-center">
                                                <InputLabel htmlFor="publishers">Publishers</InputLabel>
                                                <SmallBlueButton text="+" tooltip="Add new publisher" onClickHandle={handleAddPubs} />
                                        </div>


                                        <div className="p-2 flex flex-col bg-slate-200 gap-2">
                                            {gameDb.pubs && gameDb.pubs.map((item, index) => (
                                                <span key={index} className="flex flex-row items-center gap-10 justify-between">
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        key={index}
                                                        id={`pub-${index}`}
                                                        // defaultValue="dev"
                                                        variant="standard"
                                                        value={item}
                                                        onChange={(e)=> handleChange(e,index)}
                                                    />
                                                    <SmallRedButton text="&times;" tooltip="Delete this publisher entry" onClickHandle={() => handleDeleteMedia(index, "pubs")} />
                                                </span>
                                            ))}
                                        </div>
                                    </div>
        </>
    )
}