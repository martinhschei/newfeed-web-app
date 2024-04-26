import { IFeedPost } from "./IFeedPost";

export interface IFeed 
{
    id: number;
    name: string;
    slug: string;
    posts: IFeedPost[]
    created_at: string;
    updated_at: string;
}