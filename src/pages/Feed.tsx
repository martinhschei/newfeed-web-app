import React, { useEffect, useState } from "react";
import Sheet from 'react-modal-sheet';
import { useParams } from "react-router-dom";
import { IFeed } from "../interface/IFeed.ts";
import { FeedService } from "../services/FeedService.ts";

const Feed = () => {
    const params = useParams()
    const feedSlug = params.slug
    const [isOpen, setOpen] = useState(false);
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
            console.error("Could not get feed: ", error)
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
                <div style={styles.feedActions}>
                    <button className="button is-success">New post</button>
                </div>
            </div>
            <Sheet isOpen={isOpen} onClose={() => setOpen(false)} snapPoints={[-50, 0.5, 100, 0]} initialSnap={1} >
            <Sheet.Container className="sheet">
              <Sheet.Header />
              <Sheet.Content>
                <div className="create-feed-wrapper" style={{display: 'flex', 'justifyContent' : 'center'}}>
                  <div className="create-feed" style={{minWidth: '350px', maxWidth: '650px'}}>
                    <input className="input is-medium is-rounded" type="text" value={feedName} name="feedName" onChange={onChangeFeedName} placeholder="Feed name" />
                    <div className="create-feed__options">
                      <button className="button is-success is-medium" onClick={onSaveNew}>Start</button>
                      <button className="button is-medium" onClick={onCancelCreate}>Cancel</button>
                    </div>
                  </div>
                </div>
              </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop />
          </Sheet>
        </div>
    )
}

const styles = {
    main: {
        width: '100vh',
        padding: '10px',
        display: 'flex',
        justifyContent: 'center',
    },
    feed: {
        width: '700px',
        height: '89vh',
        marginTop: '10px',
        display: 'flex',
        justifyContent: 'center',
    },
    feedHeader: {
        color: '#333',
        fontSize: '24px',
        height: '50px',
    },
    feedActions: {
        bottom: '10px',
        height: '50px',
        marginTop: '10px',
        textAlign: 'center',
        alignItems: 'center',
        position: 'absolute',
        justifyContent: 'center',
    },
    feedPost: {
        backgroundColor: '#f9f9f9',
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
    },
}

export default Feed