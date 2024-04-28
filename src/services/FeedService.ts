import { ICreatePost } from "../interface/ICreatePost";

class FeedService {
    private static baseUrl = "http://127.0.0.1:8000/api"

    static async publishPost(feedId: number, post: ICreatePost) {
        return await fetch(`${FeedService.baseUrl}/feed/${feedId}/post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        });
    }
    
    static async getBySlug(slug: string) {
        const result = await fetch(FeedService.baseUrl + '/feed/' + slug, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }

        return await result.json();
    }


    static async createFeed(name: string) {
        return await fetch(FeedService.baseUrl + '/feed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
    }
}

export { FeedService }