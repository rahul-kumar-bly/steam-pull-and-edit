import {useState, useEffect} from "react";
import { SmallRedButton } from "../../Components/SmallButtons.jsx";

export default function Screenshots({screenshots}) {

    const [isLoaded, setIsLoaded] = useState(false);
    const [currentImage, setCurrentImage] = useState("");

    useEffect(() => {
        if (!isLoaded) return;
        const handleCloseOnEscape = (e) => {
            console.log("modal closed")
            if (e.key === "Escape") {
                setCurrentImage("");
                closeModal();
            }
        };

        document.addEventListener("keydown", handleCloseOnEscape);

        return () => {
            document.removeEventListener("keydown", handleCloseOnEscape);
        };
    }, [[isLoaded]]);


    const handleImage = (index) => {
        console.log(`>>> INFO: index is ${index}, url is ${screenshots[index]}`);
        setCurrentImage(screenshots[index]?.replace('600x338', "1920x1080"));
        const imgModal = document.getElementById("imgModal");
        const imgOverlay = document.getElementById("imgOverlay");
        imgModal.classList.remove("hidden");
        imgOverlay.classList.remove("hidden");
    }


    const closeModal = () => {
        document.getElementById("imgModal").classList.add("hidden");
        document.getElementById("imgOverlay").classList.add("hidden");
        setIsLoaded(false);
        setCurrentImage("");
    };


    return (
        <>
                {screenshots && screenshots.map((screenshot, index) => (
                        <img src={screenshot || null} key={index} onClick={()=>handleImage(index)} alt="" className="cursor-pointer w-[400px]"/> 
                ))}

    <div id="imgOverlay" className="hidden fixed top-0 left-0 w-full h-full bg-black opacity-90 z-40" onClick={closeModal} >
    </div>
    <div id="imgModal"
         className=
             "fixed z-50 bg-[#5a88af] max-w-4xl grid grid-cols-1 place-items-center left-1/4 top-1/4"
    >
        {isLoaded && (
            <div>
            <SmallRedButton classProps={"absolute top-1 right-1 cursor-pointer bg-red-500"} onClickHandle={closeModal} text={"x"} tooltip={"Close"}/>       
            </div>

        )}

        <img id="modalImage" src={currentImage || null} className="shadow-lg" onLoad={()=> setIsLoaded(true)}/>
        {isLoaded && (
            <div className="flex ">
                <a  href={currentImage} target={"_blank"}>
                    <p className="text-black p-2 font-semibold hover:underline">View Full Size</p>
                </a>
            </div>
        )}
    </div>
        </>
    )
}