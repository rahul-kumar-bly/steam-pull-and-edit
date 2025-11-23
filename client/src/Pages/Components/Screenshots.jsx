import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import {Navigation} from "swiper/modules";
import { IoIosCloseCircle } from "react-icons/io";
import {useState} from "react";
import {Link} from 'react-router-dom';

export default function Screenshots({screenshots}) {

    console.log(`screenshots are ${screenshots}`);

    const [imgSrc, setImgSrc] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const handleImage = (e) => {
        setImgSrc(e.target.currentSrc.replace(".600x338", ""));
        const imgModal = document.getElementById("imgModal");
        const imgOverlay = document.getElementById("imgOverlay");
        const imgElement = document.getElementById("modalImage");
        imgModal.classList.remove("hidden");
        imgOverlay.classList.remove("hidden");
        imgElement.src = e.target.currentSrc.replace(".600x338", "")
    }

    document.body.addEventListener("keydown", function(e) {
        if (document.getElementById('modalImage').width){
            console.log("modal exists")
            if (e.key === "Escape") {
                closeModal()
            }
        }

    });

    const closeModal = () => {
        document.getElementById("imgModal").classList.add("hidden");
        document.getElementById("imgOverlay").classList.add("hidden");
        setIsLoaded(false)
    };


    return (
        <>
        <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={50}
            slidesPerView={1}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
        >
                {screenshots && screenshots.map(screenshot => (
                    <SwiperSlide> <img src={screenshot} onClick={handleImage} alt="" className="cursor-pointer"/> </SwiperSlide>
                ))}

        </Swiper>

    <div id="imgOverlay" className="hidden fixed top-0 left-0 w-full h-full bg-black opacity-90 z-40" onClick={closeModal} >
    </div>

    <div id="imgModal"
         className=
             "hidden fixed
                 top-1/3 left-1/3
                 transform
                 -translate-x-1/4 -translate-y-1/4
                 bg-white p-4 rounded-lg shadow-lg
                 z-50 flex flex-col items-center"
    >
        {isLoaded && (
            <button
                onClick={closeModal}
                className="absolute top-1 right-1 cursor-pointer"
            >
                <IoIosCloseCircle className="h-5 w-5" />
            </button>
        )}

        <img id="modalImage" className="rounded-lg shadow-lg" onLoad={()=> setIsLoaded(true)} />
        {isLoaded && (
            <div className="flex ">
                <a  href={imgSrc} target={"_blank"}>
                    <p className="text-red-800 font-semibold hover:underline">View Full Size</p>
                </a>
            </div>
        )}
    </div>
        </>
    )
}