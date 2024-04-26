import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { FeedService } from "../services/FeedService.ts";
import { IFeed } from "../interface/IFeed.ts";

const Feed = () => {
    const params = useParams();
    const feedSlug = params.slug
    const [feed, setFeed] = useState({} as IFeed)
    
    useEffect(() => {
        if (!feedSlug) return

        const loadSlug = async () => {
            await getFeed(feedSlug)
        }

        loadSlug()
    }, [])

    const getFeed = async (slug: string) => {
        try {
            const feed = await FeedService.getBySlug(slug)
            setFeed(feed.data)
        } catch (error) {
            console.error("Could not get feed: ", error);
        }
    }

    return (
        <div style={styles.main}>
            <div style={styles.feed}>
                <div style={styles.feedHeader}>{feed.name}</div>
                {feed.posts && feed.posts.map((post, index) => (
                    <div key={index} style={styles.feedPost}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

const styles = {
    feedHeader: {
        color: '#333',
        display: 'flex',    
        fontSize: '24px',
        justifyContent: 'center',
    },
    feed: {
        width: '100%',
        marginTop: '20px',
    },
    feedPost: {
        backgroundColor: '#f9f9f9',
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
    },
    main: {
        width: '100vh',
        padding: '10px',
        display: 'flex',
    }
}

export default Feed