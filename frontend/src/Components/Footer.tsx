import PhoneIcon from '../assets/img/PhoneIcon.svg';
import EmailIcon from '../assets/img/EmailIcon.svg';
import AMLogoWhite from '../assets/img/am-logo-white.svg';

function Footer() {

    return (
        <footer className=" bg-[#0A2463] text-white font-body">
            <div className="px-4 py-4">
                <div className="flex flex-col items-center justify-between gap-4">

                    <div className="flex items-center space-x-3">
                        <img src={AMLogoWhite} className="h-8" alt="Aaron Male Logo" />
                        <div className="font-title">
                            <p className="text-lg font-semibold">Aaron Ezra Male</p>
                            <p className="text-sm text-gray-300">Full Stack Developer</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center font-body gap-2">
                        <div className="flex items-center gap-2">
                            <img src={PhoneIcon} className="h-5 w-5" alt="Phone icon" />
                            <span className="text-sm">+47 979 12 321</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <img src={EmailIcon} className="h-5 w-5" alt="Email icon" />
                            <span className="text-sm">aaronmale429@gmail.com</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-600 text-center">
                    <p className="text-xs text-gray-400 font-body">
                        &copy; {new Date().getFullYear()} Aaron Ezra Male. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )

};

export default Footer;