import axios from "axios";
interface GithubEvent {
    id: string;
    created_at: string;
    actor: {
        display_login: string;
        avatar_url: string;
        url: string;
    };
    repo: {
        name: string;
        url: string;
    };
}
export const fetchDataApi = async () => {
    try {
        const data = await axios.get<GithubEvent[]>(
            "https://api.github.com/users/Destroyers04/events"
        );
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Error fetching data:", error.message);
            return error.message;
        } else {
            console.log("Unexpected error:", error);
            return "An unexpected error has occurred";
        }
    }
};