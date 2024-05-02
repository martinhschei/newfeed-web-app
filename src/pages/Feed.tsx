import Sheet from 'react-modal-sheet';
import { useNavigate, useParams } from "react-router-dom";
import { IFeed } from "../interface/IFeed.ts";
import React, { useEffect, useState } from "react";
import UserService from '../services/UserService.ts';
import { FeedService } from "../services/FeedService.ts";

const Feed = ({user}: {user: any}) => {
    const navigate = useNavigate()
    const params = useParams()
    const feedSlug = params.slug
    const [postBody, setPostBody] = useState('')
    const [feed, setFeed] = useState({} as IFeed)
    const [postTitle, setPostTitle] = useState('')
    const [userName, setUserName] = useState('' as string)
    const [createdUser, setCreatedUser] = useState({id: ''})
    const [createPostIsOpen, setCreatePostIsOpen] = useState(false)
    const [createUserIsOpen, setCreateUserIsOpen] = useState(false)

    useEffect(() => {
        if (!feedSlug) return

        const loadBySlug = async () => {
            await bySlug(feedSlug)
        }

        loadBySlug()
    }, [feedSlug])

    useEffect(() => {
        console.log(userName)
    }, [userName])

    const bySlug = async (slug: string) => {
        try {
            const feed = await FeedService.getBySlug(slug)
            setFeed(feed.data)
        } catch (error) {
            navigate("/den-feeden-fins-ikke")
        }
    }

    const onChangePostTitle = (event: any) => {
        setPostTitle(event.target.value)
    }

    const onChangePostBody = (event: any) => {
        setPostBody(event.target.value)
    }

    const onChangeUserName = (event: any) => {
        setUserName(event.target.value)
    }

    const onCreateNewPost = async () => {
        if (user) {
            setCreatePostIsOpen(true)
        }

        if (! user && ! createdUser.id) {
            console.log("Need to create user.")
            setCreateUserIsOpen(true)
        }
    }  
    
    const onPublishPost = async () => {
        console.log("publishing...")

        const userId = user ? user.id : createdUser.id
        if (!userId) {
            throw Error("No user id found")
        }

        await FeedService.publishPost(feed.id, {title: postTitle, body: postBody}, userId)
            .then(() => {
                setCreatePostIsOpen(false)
                bySlug(feed.slug)
                setPostTitle('')
                setPostBody('')
            })
    }

    const onCancelPost = async () => {
        console.log("on cancel...")
        setCreatePostIsOpen(false)
    }

    const cancelCreateUser = async () => {
        setCreateUserIsOpen(false)
        setUserName('')
    }
    
    const onCreateUser = async () => {
        await UserService.createUser(userName)
            .then((response) => {
                setCreateUserIsOpen(false)
                setCreatePostIsOpen(true)
                localStorage.setItem('user', JSON.stringify(response))
                setCreatedUser(response)
            });
    }

    return (
        <div style={styles.main}>
            <div className="sheet-wrapper">
                <Sheet isOpen={createUserIsOpen} onClose={() => setCreateUserIsOpen(false)} snapPoints={[-50, 0.6, 100, 0]} initialSnap={1} >
                    <Sheet.Container className="sheet">
                    <Sheet.Header />
                        <Sheet.Content>
                            <div className="sheet-content-wrapper">
                                <p className="sheet-content">
                                    For å opprette en post må du har et brukernavn. Brukernavnet kan være akkurat hva du vil.
                                </p>
                                <div className="sheet-content">
                                    <input className="input is-medium is-rounded mb-2" type="text" value={userName} name="userName" onChange={onChangeUserName} placeholder="Brukernavn" />
                                    <div className="sheet-actions">
                                        <button className="button is-success is-medium" onClick={onCreateUser}>Ok</button>
                                        <button className="button is-medium" onClick={cancelCreateUser}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </Sheet.Content>
                    </Sheet.Container>
                    <Sheet.Backdrop />
                </Sheet>
            </div>

            <div className="sheet-wrapper">
                <Sheet isOpen={createPostIsOpen} onClose={() => setCreatePostIsOpen(false)} snapPoints={[-50, 0.6, 100, 0]} initialSnap={1} >
                    <Sheet.Container className="sheet">
                    <Sheet.Header />
                        <Sheet.Content>
                            <div className="sheet-content-wrapper">
                                <div className="sheet-content">
                                    <div>
                                        <input className="input is-medium is-rounded mb-2" type="text" value={postTitle} name="feedName" onChange={onChangePostTitle} placeholder="Post title" />
                                        <textarea className="textarea is-medium is-rounded" value={postBody} name="feedContent" onChange={onChangePostBody} placeholder="Post body" />
                                    </div>
                                    <div className="create-feed__options">
                                        <button className="button is-success is-medium" disabled={postBody.length === 0} onClick={onPublishPost}>Publish</button>
                                        <button className="button is-medium" onClick={onCancelPost}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </Sheet.Content>
                    </Sheet.Container>
                    <Sheet.Backdrop />
                </Sheet>
            </div>
            {feed.id && (
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
            )}  
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
        height: '100vh',
        marginTop: '10px',
        padding: '10px',
        minWidth: '300px',
        width: '100%',
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