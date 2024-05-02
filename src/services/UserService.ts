class UserService {
    private static baseUrl = "http://127.0.0.1:8000/api"
    
    static async createUser(username: string) {
        const result = await fetch(UserService.baseUrl + '/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });

        return await result.json();
    }
}

export default UserService