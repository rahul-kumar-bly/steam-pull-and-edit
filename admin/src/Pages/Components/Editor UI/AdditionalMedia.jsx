import {TextField, InputLabel} from "@mui/material";

export default function AdditionalMedia({
    gameDb,
    handleChange
}){
    return (
      <>
                    <div>
                <InputLabel htmlFor="header image">Header Image</InputLabel>
                {
                    gameDb.headerImage &&(
                        <img src={gameDb.headerImage} alt=""/>
                    )
                }

                                        <TextField
                                            required
                                            id="headerImage"
                                            variant="standard"
                                            value={gameDb.headerImage}
                                            onChange={handleChange}
                                            fullWidth
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="publishers">Capsule Image</InputLabel>
                                        {gameDb.capsuleImage &&(
                                            <img src={gameDb.capsuleImage} alt=""/>
                                        )}
                                        <TextField
                                            required
                                            id="capsuleImage"
                                            variant="standard"
                                            value={gameDb.capsuleImage}
                                            onChange={handleChange}
                                            fullWidth
                                            type="text"
                                        />
                                    </div>      
      </>  
    )
}