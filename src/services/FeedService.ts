class FeedService {
    private static baseUrl = "http://127.0.0.1:8000"

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