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
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');

    useEffect(() => {
        if (!feedSlug) return

        const loadBySlug = async () => {
            await bySlug(feedSlug)
        }

        loadBySlug()
    }, [feedSlug])

    const bySlug = async (slug: string) => {
        try {
            const feed = await FeedService.getBySlug(slug)
            setFeed(feed.data)
        } catch (error) {
            console.error("Could not get feed: ", error)
        }
    }

    const onChangePostTitle = (event: any) => {
        setPostTitle(event.target.value)
    }

    const onChangePostBody = (event: any) => {
        setPostBody(event.target.value)
    }

    const onCreateNewPost = async () => {
        setOpen(true)
    }  
    
    const onPublishPost = async () => {
        console.log("publishing...")

        await FeedService.publishPost(feed.id, {title: postTitle, body: postBody})
            .then((response) => {
                setOpen(false)
                bySlug(feed.slug)
                setPostTitle('')
                setPostBody('')
            })
    }

    const onCancelPost = async () => {
        console.log("on cancel...")
        setOpen(false)
    }

    return (
        <div style={styles.main}>
            <div className="sheet-wrapper">
                <Sheet isOpen={isOpen} onClose={() => setOpen(false)} snapPoints={[-50, 0.6, 100, 0]} initialSnap={1} >
                    <Sheet.Container className="sheet">
                    <Sheet.Header />
                        <Sheet.Content>
                            <div className="create-post-wrapper" style={{display: 'flex', 'justifyContent' : 'center'}}>
                                <div className="create-post" style={styles.createPost}>
                                    <div>
                                        <input className="input is-medium is-rounded mb-2" type="text" value={postTitle} name="feedName" onChange={onChangePostTitle} placeholder="Post title" />
                                        <textarea className="textarea is-medium is-rounded" value={postBody} name="feedContent" onChange={onChangePostBody} placeholder="Post body" />
                                    </div>
                                    <div className="create-feed__options">
                                        <button className="button is-success is-medium" onClick={onPublishPost}>Publish</button>
                                        <button className="button is-medium" onClick={onCancelPost}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </Sheet.Content>
                    </Sheet.Container>
                    <Sheet.Backdrop />
                </Sheet>
            </div>

            <div style={styles.feed}>
                <div style={styles.feedHeader}>{feed.name}</div>
                <div style={styles.feedActions}>
                    <button className="button is-success is-fullwidth" onClick={onCreateNewPost}>New post</button>
                </div>
                <div>
                    {feed.posts && feed.posts.map((post, index) => (
                        <div style={styles.feedPost}>
                            <h2 style={styles.postTitle}>{post.title}</h2>
                            <div key={index}>
                                {post.body.length > 100 ? post.body.substring(0, 100) + '...' : post.body}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
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
        width: '100%',
        marginTop: '10px',
        justifyContent: 'center',
    },
    feedHeader: {
        color: '#333',
        height: '50px',
        fontSize: '1.8rem',
        textAlign: 'center',
    },
    postTitle: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
    },
    feedPost: {
        color: '#333',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
    },
    createPost: {
        padding: '10px',
    },
    feedActions: {
        bottom: '10px',
        height: '50px',
        marginTop: '10px',
        position: 'aboslute',
    },
}

export default Feed