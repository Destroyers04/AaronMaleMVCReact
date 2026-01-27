import { useEffect, useState } from "react";
import { fetchDataApi, type GithubEvent } from "../api";
import HweiBackground from '../assets/img/Hwei.png';

function GithubActivity() {
    const [event, setEvent] = useState<GithubEvent | null>(null);

    const getDaysAgo = (dateString: string): string => {
        const eventDate = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - eventDate.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        return `${diffDays} days ago`;
    };

    useEffect(() => {
        const fetchEvents = async () => {
            const events = await fetchDataApi();
            const pushEvents = events.filter(e => e.type === "PushEvent");
            setEvent(pushEvents[0] || null);
        };
        fetchEvents();
    }, []);

    return (
        <div className="my-8 grid bg-[#BDE8F5] relative">
            <div
                className="absolute inset-0 opacity-20"
                style={{ backgroundImage: `url(${HweiBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <div className=" justify-self-center p-4 relative z-10">
                <h1 className="font-title text-[#0A2463] text-l font-semibold" >Latest Github Activity</h1>
                {event && (
                    <div className="flex items-stretch items-center mt-4">
                        <div className="">
                           <a href="https://github.com/Destroyers04">
                               <img src={event.actor.avatar_url} className="flex h-20 mx-auto rounded-full" />
                               <p className="flex font-title">{event.actor.display_login}</p>
                           </a>
                        </div>
                        <div className=" ml-8 text-sm md:text-base">
                            <h2 className="font-title font-semibold ">{getDaysAgo(event.created_at)}</h2>
                            <a href={`https://github.com/${event.repo.name}`}>
                                <p className="mt-2 md:ml-8 md:mt-4">Pushed commits to {event.repo.name}</p>
                            </a>
                        </div>
                    </div>
            )}
            </div>
        </div>
    );
}

export default GithubActivity;