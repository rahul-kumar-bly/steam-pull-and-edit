import React from "react";
import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";


export default function Preview() {
    const params = useParams();
    const [steamData, setSteamData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [headings, setHeadings]  = useState([]);

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
                    setHeadings(document.querySelectorAll('h2:not(#product_desc h2, #toc)' ));

            }
            fetchGame();
        }, [params.id]);

    return (
        <div className="min-h-screen flex flex-col items-center bg-[#151515] text-white  text-center">
        {
            steamData && (
            <div className="my-4 flex flex-col items-center ">
                <div className="my-5 p-4 lg:fixed top-10 left-10">
                    <h2 id="toc" className="text-4xl bg-[rgba(90,136,175,0.4)] rounded-sm p-2">Table of Contents</h2> 
                    {headings && headings.length > 0 && (
                        <ul className="list-disc list-inside text-left my-2">
                            {Array.from(headings).map((heading, index) => (
                                <li key={index}>
                                    <a href={`#${heading.id}`} className="hover:underline hover:text-blue-500">{heading.textContent.replace(':', '')}</a>
                                </li>
                            ))}
                            <li><a onClick={()=> {navigate(`/edit/${params.id}`)}} href="#" className="hover:underline hover:text-blue-500">Back to Editor</a></li>

                        </ul>
                    )}

                </div>
                <h1 className="text-4xl" id="Game_Title">
                {steamData.name}
                </h1>

                <div className="my-4">
                <h2 className="text-2xl mb-2" id="Capsule_Image">Capsule Image</h2>
                <img src={steamData.capsuleImage}/>
                </div>

                <div className="my-4">
                <h2 className="text-2xl mb-2" id="Header_Image">Header Image</h2>
                <img src={steamData.headerImage}/>
                </div>

                <div className="my-4">
                <h2 className="text-2xl mb-2" id="Short_Description">Short Description</h2>
                <p className="max-w-4xl">
                {steamData.shortDescription}
                </p>
                </div>

                <div className="my-4" >
                <h2 className="text-2xl mb-2" id="Price">Price</h2>
                <p className="max-w-4xl p-2 bg-[rgba(90,136,175,0.5)] rounded-sm">
                ₹{steamData.price}
                </p>
                </div>

                <div className="my-4" >
                <h2 className="text-2xl mb-2" id="Website">Website</h2>
                {!steamData.website &&(
                    <p>No Website Available</p>
                ) }
                <p className="max-w-4xl">
                    <a href={steamData.website} className="hover:underline hover:text-blue-500">{steamData.website}</a>
                </p>
                </div>

                <div className="my-4">
                    {steamData.genres && steamData.genres.length > 0 && (
                        <div className="my-4 max-w-6xl">
                            <h2 className="text-2xl mb-2"  id="Genres">Genres</h2>
                            <div className="flex flex-row gap-3 overflow-x-auto my-1">
                                {steamData.genres.map((genre, index) => (
                                        <div key={index} className="p-2 bg-[rgba(90,136,175,0.5)] rounded-sm">
                                            {genre}
                                        </div>
                                ))}
                                </div>
                        </div>
                        )   }
                </div>

                <div className="my-4" >
                    {steamData.devs && steamData.devs.length > 0 && (
                        <div className="my-4 max-w-6xl">
                            <h2 className="text-2xl mb-2" id="Developers">Developers</h2>
                            <div className="flex flex-row gap-3 overflow-x-auto my-1">
                                {steamData.devs.map((dev, index) => (
                                        <div key={index} className="p-2 bg-[rgba(90,136,175,0.5)] rounded-sm">
                                            {dev}
                                        </div>
                                ))}
                                </div>
                        </div>
                        )   }
                </div>

                <div className="my-4" >
                    {steamData.pubs && steamData.pubs.length > 0 && (
                        <div className="max-w-6xl">
                            <h2 className="text-2xl mb-2" id="Publishers">Publishers</h2>
                            <div className="flex flex-row gap-3 overflow-x-auto my-1">
                                {steamData.pubs.map((pub, index) => (
                                        <div key={index} className="p-2 bg-[rgba(90,136,175,0.5)] rounded-sm">
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
                            <h2 className="text-2xl mb-2"  id="Screenshots">Screenshots</h2>
                            <div className="flex flex-row gap-3 overflow-x-auto my-2">
                                {steamData.screenshots.map((screenshot, index) => (
                                    <img key={index} src={screenshot} className="w-[400px] rounded-sm"/>
                                ))}
                                </div>
                        </div>
                                )}
                </div>

                <div className="my-4" >
                    <h2 className="text-2xl mb-2" id="Trailers">Trailers</h2>
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
                <h2 className="text-2xl mb-2" id="Description">Description</h2>
                    <div id="product_desc" className="max-w-2xl text-center overflow-y-scroll p-2 max-h-[800px]" dangerouslySetInnerHTML={{__html: steamData.description}} />
                </div>
            </div>

            )
        }
        </div>
    );
}   