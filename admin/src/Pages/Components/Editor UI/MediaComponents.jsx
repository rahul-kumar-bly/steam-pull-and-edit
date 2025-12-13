import { SmallRedButton, SmallBlueButton } from "../SmallButtons"
import {Divider, InputLabel, Button} from "@mui/material";

export default function MediaComponents({
    gameDb,
    handleAddScreenshot,
    handleAddTrailer,
    handleDeleteMedia
}){
 return (
    <>
                        <div className="flex flex-row gap-2 items-center">
                        <InputLabel htmlFor="screenshots">Screenshots</InputLabel>
                        <SmallBlueButton text="+" tooltip="Add new screenshot" onClickHandle={handleAddScreenshot} />
                    </div>

                    <div className="flex flex-row gap-3 flex-wrap">
                        {gameDb.screenshots.length === 0 &&(
                            <p>No screenshots are available.</p>
                        )}
                        {gameDb.screenshots && gameDb.screenshots.map((screenshot, index) => (
                            <div key={index}  className="w-1/4 h-auto cursor-pointer transition-transform hover:scale-105 relative">
                                <img src={screenshot} alt=""/>
                                <SmallRedButton 
                                    classProps="absolute top-1 right-1 flex items-center justify-center " 
                                    text="&times;" 
                                    tooltip="Delete this screenshot" 
                                    onClickHandle={() => handleDeleteMedia(index, "screenshots")} 
                                />
                            </div>
                        ))}
                    </div>
                    <Divider />
                    <InputLabel htmlFor="trailers">Trailers</InputLabel>
                    <div className="flex flex-col flex-wrap gap-2 max-w-full">
                        {gameDb.trailer && gameDb.trailer.map((item,index) => (
                            <div className="w-1/3 h-auto relative" key={index}>
                                {(item.trailer.includes('youtube.com')) &&(
                                    <iframe className="w-full" src={`${item.trailer.replace('watch?v=', 'embed/')}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                )}
                                {(!item.trailer.includes('youtube.com'))&&(
                                <video poster={item.thumbnail}  src={item.trailer} controls title={item.name}/>
                                )}
                                <SmallRedButton 
                                    classProps="absolute top-1 right-1 flex items-center justify-center cursor-pointer" 
                                    text="&times;" 
                                    tooltip="Delete this Trailer" 
                                    onClickHandle={() => handleDeleteMedia(index, "trailer")} 
                                />
                            </div>
                        ))}
                    </div>
                    <Button type="button" variant="contained" onClick={handleAddTrailer}>Add New Trailer</Button>
    </>
 )   
}