import React from "react";
import ProfilePicture from '../assets/img/ProfilePicture.svg';
import LocationIcon from '../assets/img/LocationIcon.svg';
import CodeIcon from '../assets/img/CodeIcon.svg';
import CalendarIcon from '../assets/img/CalendarIcon.svg';
import CardList from "./CardList";
import KaylaBackground from '../assets/img/kayla.png';
interface Props { }

function Hero(props: Props) {

    return (
        <div className="pt-15 font-title ">
            <div className="my-8 grid grid-cols-5 grid-rows-2" >

                <div className=" bg-[#BDE8F5] col-span-2 row-span-2 place-content-center rounded-br-2xl relative">
                    <div
                        className="absolute inset-0 rounded-br-2xl opacity-20"
                        style={{ backgroundImage: `url(${KaylaBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                    <img src={ProfilePicture} className="h-50 mx-auto relative z-10" />
                </div>

                <div className=" bg-[#BDE8F5] col-span-3 -mb-3">
                    <p className="text-[#0A2463] text-xl font-semibold  mb-2 pt- ml-4">Aaron Ezra Male</p>
                    <div className="ml-6">
                        <p className="font-semibold">
                            &gt;
                            <span className="font-medium text-sm">  23 Years Old</span>
                        </p>
                        <p className="font-semibold">
                            &gt;
                            <span className="font-medium text-sm">  Based in Molde, Norway</span>
                        </p>
                        <p className="font-semibold">
                            &gt;
                            <span className="font-medium text-sm"> Full stack developer </span>
                        </p>
                        <div className="h-5 flex-shrink-0"></div>
                    </div>
                </div>

                <div className="bg-white -mt-1 p-2 col-span-3 col-start-3 text-xs font-body rounded-tl-2xl">
                    <CardList />
                </div>
            </div>
        </div>
    );

};

export default Hero;