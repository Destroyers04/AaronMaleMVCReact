import React from "react";
import ProfilePicture from '../assets/img/ProfilePicture.svg';
import LocationIcon from '../assets/img/LocationIcon.svg';
import CodeIcon from '../assets/img/CodeIcon.svg';
import CalendarIcon from '../assets/img/CalendarIcon.svg';
import { Link } from "react-router-dom";
import CardList from "./CardList";
interface Props { }

function Hero(props: Props) {

    return (
        <div className="pt-16 font-body flex flex-col md:flex-row flex-wrap max-w-screen-xl mx-auto w-full justify-between justify-center gap-2">
            <div className="mx-8 mt-2 flex flex-row bg-orange-200 shadow-lg rounded-t-lg">
                <div className="m-2 mr-1 place-content-center">
                    <img src={ProfilePicture} className="h-30" />
                </div>
                <div className="m-2 ml-1">
                    <p className="font-title text-[#0A2463] text-xl font-semibold mt-2 mb-3">Aaron Ezra Male</p>
                    <p className="font-title font-semibold text-xs flex items-center gap-2 mb-1">
                        <span>
                            <img className="h-5" src={CalendarIcon} alt="Calendar icon" />
                        </span>
                        23 years old
                    </p>
                    <p className="font-title font-semibold text-xs flex items-center gap-2 mb-1">
                        <span>
                            <img className="h-5" src={LocationIcon} alt="Location icon" />
                        </span>
                        Based in Molde, Norway
                    </p>
                    <p className="font-title font-semibold text-xs flex items-center gap-2">
                        <span>
                            <img className="h-5" src={CodeIcon} alt="Code icon" />
                        </span>
                        Full stack Developer
                    </p>
                </div>
            </div>
            <div className="mx-8" >
                <CardList/>
            </div>
            

            <div className="mx-14 mt-4 flex-1 place-content-center text-sm font-body">
                    <p>I am a Software developer with a Bachelor's in Information Science from the University of Bergen.
                        I have experience with Python, building projects including a machine learning predictor for bycatch and a Discord bot.
                        Through my studies, I gained hands-on experience in UI/UX design, creating an application for hikers and conducting user experience workshops.</p>
                    <br />
                    <p>I am currently seeking a software development <b>internship or junior position.</b></p>
                CardList</div>
            </div>
    );

};

export default Hero;