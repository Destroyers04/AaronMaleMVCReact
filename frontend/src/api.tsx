import axios from "axios";

export interface GithubEvent {
    id: string;
    type: string;
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

export const fetchDataApi = async (): Promise<GithubEvent[]> => {
    try {
        const response = await axios.get<GithubEvent[]>(
            "https://api.github.com/users/Destroyers04/events"
        );
        return response.data;
    } catch (error) {
        console.log("Error fetching data:", error);
        return [];
    }
};