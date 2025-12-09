import React from "react";
import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "@mui/material";


export default function Preview() {
    const params = useParams();
    const [steamData, setSteamData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

        useEffect(() => {
            setLoading(true);
            async function fetchGame() {
                if (params.id) {
                    try {
                        const res = await fetch(`/api/game/fetch/${params.id}`);
                        if (res.ok){
                            const data = await res.json();
                            console.log(data);
                            setSteamData(data);
                        } else {
                            console.log('error fetching response');
                            setError(`error fetching response from ${res.statusText}`);
                        }
                    } catch (error) {
                        console.log('error is', error);
                        setError(error);
                    } finally {
                        setLoading(false);
                    }
                }
            }
            fetchGame();
        }, [params.id]);

    return (
        <div className="min-h-screen flex flex-col items-center bg-[#151515] text-white  text-center">
        {
            steamData && (
            <div className="my-4 flex flex-col items-center">
                <h1 className="text-4xl">
                {steamData.name}
                </h1>

                <div className="my-4">
                <h2 className="text-2xl mb-2">Capsule Image</h2>
                <img src={steamData.capsuleImage}/>
                </div>

                <div className="my-4">
                <h2 className="text-2xl mb-2">Header Image</h2>
                <img src={steamData.headerImage}/>
                </div>

                <div className="my-4">
                <h2 className="text-2xl mb-2">Short Description</h2>
                <p className="max-w-4xl">
                {steamData.shortDescription}
                </p>
                </div>

                <div className="my-4">
                <h2 className="text-2xl mb-2">Price</h2>
                <p className="max-w-4xl">
                ₹{steamData.price}
                </p>
                </div>

                <div className="my-4">
                <h2 className="text-2xl mb-2">Website</h2>
                <p className="max-w-4xl">
                    <a href={steamData.website} className="hover:underline hover:text-blue-500">{steamData.website}</a>
                </p>
                </div>

                <div className="my-4">
                    {steamData.genres && steamData.genres.length > 0 && (
                        <div className="my-4 max-w-6xl">
                            <h2 className="text-2xl mb-2">Genres:</h2>
                            <div className="flex flex-row gap-3 overflow-x-auto my-1">
                                {steamData.genres.map((genre, index) => (
                                        <div key={index} className="p-2 bg-gray-800 rounded-md">
                                            {genre}
                                        </div>
                                ))}
                                </div>
                        </div>
                        )   }
                </div>

                <div className="my-4">
                    {steamData.devs && steamData.devs.length > 0 && (
                        <div className="my-4 max-w-6xl">
                            <h2 className="text-2xl mb-2">Developers:</h2>
                            <div className="flex flex-row gap-3 overflow-x-auto my-1">
                                {steamData.devs.map((dev, index) => (
                                        <div key={index} className="p-2 bg-gray-800 rounded-md">
                                            {dev}
                                        </div>
                                ))}
                                </div>
                        </div>
                        )   }
                </div>

                <div className="my-4">
                    {steamData.pubs && steamData.pubs.length > 0 && (
                        <div className="max-w-6xl">
                            <h2 className="text-2xl mb-2">Publishers:</h2>
                            <div className="flex flex-row gap-3 overflow-x-auto my-1">
                                {steamData.pubs.map((pub, index) => (
                                        <div key={index} className="p-2 bg-gray-800 rounded-md">
                                            {pub}
                                        </div>
                                ))}
                                </div>
                        </div>
                        )   }
                </div>

                

                <div className="my-4">
                    {steamData.screenshots && steamData.screenshots.length > 0 && (
                        <div className="my-4 max-w-6xl">
                            <h2 className="text-2xl mb-2">Screenshots</h2>
                            <div className="flex flex-row gap-3 overflow-x-auto my-2">
                                {steamData.screenshots.map((screenshot, index) => (
                                    <img key={index} src={screenshot} className="w-[400px] rounded-md"/>
                                ))}
                                </div>
                        </div>
                                )}
                </div>

                <div className="my-4">
                    <h2 className="text-2xl mb-2">Trailers</h2>
                    {!steamData.trailer &&(
                        <p>No Trailers Available</p>
                    )}
                    {steamData.trailer && steamData.trailer.length > 0 && (
                        <div className="my-4 max-w-6xl">
                            <div className="flex flex-row gap-3 overflow-x-auto my-2">
                                {steamData.trailer.map((item, index) => (
                                        <video poster={item.thumbnail}  src={item.trailer} controls title={item.name} className="w-[300px]"/>
                                ))}
                                </div>
                        </div>
                        )}
                </div>

                <div className="my-4">
                <h2 className="text-2xl mb-2">Description</h2>
                    <div className="max-w-2xl text-center" dangerouslySetInnerHTML={{__html: steamData.description}} />
                </div>
            </div>

            )
        }
                        <div className="my-4">
                    <Button type="button" variant="contained" onClick={()=> {navigate(`/edit/${params.id}`)}}>Back to Editor</Button>
                </div>
        </div>
    );
}   