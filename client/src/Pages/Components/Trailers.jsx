import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import {Navigation} from "swiper/modules";

export default function Trailers({trailers}) {
    console.log(trailers);
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
                {trailers && trailers.map((item, index) => (
                    <SwiperSlide><video poster={item.thumbnail} className="w-full h-auto" src={item.trailer} controls title={item.name}/></SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}