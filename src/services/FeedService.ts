class FeedService {
    private static baseUrl = "http://127.0.0.1:8000"

    static async getBySlug(slug: string) {
        const result = await fetch(FeedService.baseUrl + '/api/feed/' + slug, {
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
        return await fetch(FeedService.baseUrl + '/api/feed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
    }
}

export { FeedService }