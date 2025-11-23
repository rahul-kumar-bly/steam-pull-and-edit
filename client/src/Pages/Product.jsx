import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import '../assets/css/product.css'
import parse from 'html-react-parser';
import Screenshots from "./Components/Screenshots.jsx"
import Trailers from "./Components/Trailers.jsx"
import { Tabs } from "@chakra-ui/react"
import { FaImages } from "react-icons/fa";
import { FaPhotoVideo } from "react-icons/fa";
import { Spinner } from "@chakra-ui/react"



export default function Product(){

    const [productId, setProductId] = useState(null);
    const [gameData, setGameData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const params = useParams();

    useEffect(()=>{
        setProductId(params.id);
        console.log(`params.id is ${params.id}`);
        const fetchDataFromSteam = async () => {
            try {
                const res = await fetch(`http://localhost:8080/game/fetch/${params.id}`);
                const data =  await res.json();
                if (data) {
                    setGameData(data);
                    setError(null);
                    setLoading(false)
                } else {
                    console.log(error);
                    setLoading(false)
                    setError(error);
                    setGameData(null);
                }
            } catch(error) {
                console.log(error);
                setLoading(false)
                setError(error);
                setGameData(null);
            }
        }

        fetchDataFromSteam()
    }, [params.id])

    console.log('gameData is', gameData);

    return (
        <div>{loading && (
            <div  className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
                <Spinner size={"lg"}/>
            </div>
        )}
            {/*{error && !gameData && (*/}
            {/*    <ProductError error={error} />*/}
            {/*)}*/}

            {gameData && productId  && !error && (

                <div className="product" id="product">
                    <div id="topContainerBg" className="top-container-bg" style={{backgroundImage: `linear-gradient(rgba(44, 45, 59, 0.9), rgba(45, 46, 52, 0.9)), url(${gameData.screenshots[1]})`, backgroundSize: "cover", backgroundPosition: "center"}}>
                        <div className="top-container">
                            <div className="top-left-container">
                                <div className="heading-container">
                                    <div className="heading-icon" id="headingIcon">
                                        <img src={gameData.capsuleImage} style={{ width: "32px", height: "32px", objectFit: "cover", borderRadius: "10%" }}
                                        />
                                    </div>
                                    <div className="heading-title" id="headingTitle">
                                        <h1>
                                            {gameData.name}
                                        </h1>
                                    </div>
                                </div>

                                    <Tabs.Root defaultValue="screenshots" variant={"outline"}>
                                        <Tabs.List>
                                            <div className="flex flex-row gap-5">
                                                <Tabs.Trigger value="screenshots"  padding={5}>
                                                    <FaImages />
                                                    Screenshots
                                                </Tabs.Trigger>
                                                <Tabs.Trigger value="trailers" padding={5}>
                                                    <FaPhotoVideo />
                                                    Trailers
                                                </Tabs.Trigger>
                                            </div>
                                        </Tabs.List>
                                        <Tabs.Content value="screenshots">
                                            <Screenshots screenshots={gameData.screenshots} />
                                        </Tabs.Content>
                                        <Tabs.Content value="trailers">
                                            <Trailers trailers={gameData.trailer} />
                                        </Tabs.Content>
                                    </Tabs.Root>


                            </div>

                            <div className="top-right-container">
                                {/*// <!--            mini image and short description-->*/}
                                <div className="mini-img-container" id="miniImageContainer">
                                    <img src={gameData.headerImage} alt=""/>
                                </div>
                                <div className="details">
                                    <div className="short-desc" id="shortDesc">
                                        {gameData.shortDescription}
                                    </div>
                                    <div className="price">
                                        Price: <span className="release-date-text" id="price">₹{gameData.price}</span>
                                    </div>
                                    <div className="release-date">
                                        <div className="flex flex-row gap-2">
                                            Genre:
                                            {gameData.genres.map(genre => (
                                                        <p>{genre}</p>
                                                ))}
                                        </div>
                                    </div>
                                    <div className="pub-dev">
                                        <div className="pub" id="pub">
                                            Publisher: <span className="pub-dev-title">
                                            {gameData.pubs}
                                        </span>
                                        </div>
                                        <div className="dev" id="dev">
                                            Developer: <span className="pub-dev-title">
                                                {gameData.devs}
                                        </span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            {/*// <!-- top-right-container closing tag -->*/}

                        </div>
                        {/*// <!-- top-container closing tag -->*/}
                    </div>


                    <div className="middle-container" id="middleContainer">
                        <div className="description-container">
                            <h2>About the game</h2>
                            <div className="long-desc" id="longDesc">
                                {parse(gameData.description)}
                            </div>
                        </div>

                        <div className="sidebar-container">
                            <img src={gameData.capsuleImage} alt=""/>
                            <ul className="sidebar-genre">
                                {gameData.genres.map(genre => (
                                    <li>{genre.description}</li>
                                ))}
                            </ul>

                        </div>

                    </div>

                </div>

            )}


            {/*// <!-- product closing tag -->*/}


        </div>
    )
}
