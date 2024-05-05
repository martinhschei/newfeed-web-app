import Sheet from 'react-modal-sheet';
import { IFeed } from "../interface/IFeed.ts";
import { IUser } from '../interface/IUser.ts';
import React, { useEffect, useState } from "react";
import UserService from '../services/UserService.ts';
import { FeedService } from "../services/FeedService.ts";
import { useNavigate, useParams } from "react-router-dom";

const Feed = () => {
    const navigate = useNavigate()
    const params = useParams()
    const feedSlug = params.slug
    const [comment, setComment] = useState('')
    const [postBody, setPostBody] = useState('')
    const [feed, setFeed] = useState({} as IFeed)
    const [postTitle, setPostTitle] = useState('')
    const [userName, setUserName] = useState('' as string)
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
        const user = await UserService.storedUser() as IUser;

        if (user) {
            setCreatePostIsOpen(true)
        }

        if (! user) {
            console.log("Need to create user.")
            setCreateUserIsOpen(true)
        }
    }  
    
    const onPublishPost = async () => {
        console.log("publishing...")

        const user = await UserService.storedUser() as IUser;
        if (!user) {
            throw Error("No user id found")
        }

        await FeedService.publishPost(feed.id, {title: postTitle, body: postBody}, user.id)
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
            });
    }

    const onCommentChange = (event: any) => {
        setComment(event.target.value)
    }

    const onComment = async (post: any) => {
        console.log(post)
        if (!comment) return

        const user = await UserService.storedUser() as IUser;
        if (!user) {
            setCreateUserIsOpen(true)
        }
        if (user) {
            console.log("commenting...", comment)
            console.log("commenting on post", post)
            await FeedService.comment(feed.id, post.id, comment, user.id)
                .then(() => {
                    bySlug(feed.slug)
                    setComment('')
                })
        }   
    }

    return (
        <div style={styles.main}>
            <div className="sheet-wrapper">
                <Sheet isOpen={createUserIsOpen} onClose={() => setCreateUserIsOpen(false)} snapPoints={[-50, 0.8, 100, 0]} initialSnap={1} >
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
                <Sheet isOpen={createPostIsOpen} onClose={() => setCreatePostIsOpen(false)} snapPoints={[-50, 0.8, 100, 0]} initialSnap={1} >
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
                                <div style={styles.postTitle}>
                                    <h2 style={styles.postTitleText}>{post.title}</h2>
                                    <h5 style={styles.author}>av {post.author.name} {post.created_at}</h5>
                                </div>
                                <div key={index} style={styles.postBody}>
                                    {post.body.length > 100 ? post.body.substring(0, 100) + '...' : post.body}
                                </div>
                                <div style={styles.comments}>
                                    {post.comments && post.comments.map((comment, index) => (
                                        <div key={index} style={{ backgroundColor: 'lightgray', padding: '15px', borderRadius: '4px', marginBottom: '5px' }}>
                                            <p>{comment.body}</p>
                                            <h5 style={styles.author}>av {post.author.name} {post.created_at}</h5>  
                                        </div>
                                    ))}

                                    <textarea rows={3} style={styles.comment} value={comment} onChange={onCommentChange}></textarea>
                                    <button className="button is-info is-fullwidth" onClick={() => onComment(post)}>
                                        <span className="icon">
                                            <i className="fas fa-paper-plane"></i>
                                        </span>
                                        <div>
                                            Comment
                                        </div>
                                    </button>
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
    comments: {
        padding: '5px'
    },
    comment: {
        padding: '15px',
        width: '100%',
        borderRadius: '5px',
        border: '1px solid lightgray',
    },
    feed: {
        height: '100vh',
        marginTop: '10px',
        padding: '10px',
        minWidth: '300px',
        width: '100%',
        justifyContent: 'center',
    },
    postBody: {
        padding: '5px',
    },
    postTitle: {
        padding: '5px',
    },
    postTitleText: {
        fontWeight: 600,
    },
    feedHeader: {
        color: '#333',
        height: '50px',
        fontSize: '1.8rem',
        textAlign: 'center',
    },
    author: {
        fontSize: '10px',
        marginBotton: '15px',
    },
    feedPost: {
        color: '#333',
        padding: '5px',
        marginBottom: '5px',
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