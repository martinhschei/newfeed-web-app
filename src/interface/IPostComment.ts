export interface IPostComment {
    id: number,
    body: string,
    author: {
        id: number,
        name: string
    },
    created_at: string,
    updated_at: string,
}
