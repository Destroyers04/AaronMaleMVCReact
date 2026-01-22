import React from "react";
import AMLogoBlue from '../assets/img/am-logo-blue.svg';
import { Link } from "react-router-dom";
interface Props { }

function NavBar(props: Props) {

    return (
        <nav className="fixed bg-white w-full z-40 top-0 start-0 -b bg-gray-600 px-4">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 border-b border-gray-600">
                <Link to="/" className="flex items-center space-x-2 underline-effect">
                    <img src={AMLogoBlue} className="h-7 -translate-y-1" alt="Aaron Male Logo" />
                    <span className=" font-title text-[#0A2463] self-center text-xl font-semibold">Home</span>
                </Link>
            </div>
        </nav>

    )
 
};

export default NavBar;