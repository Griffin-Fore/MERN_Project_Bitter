import React, { useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';

const ViewOneTweet = () => {
    // states:
        const navigate = useNavigate();
        const {currentUserId, tweetId} = useParams()
        // the current user
        const [currentUser, setCurrentUser] = useState({})
        // the selected tweet
        const [tweet, setTweet] = useState({})
        // a state for the pending tweet to be updated into the selected tweet
        const [pendingEditedTweet, setPendingEditedTweet] = useState({})
        // error messages for the tweet update form
        const [pendingEditedTweetErrorMessage, setPendingEditedTweetErrorMessage] = useState()
        // all the comments about the tweet
        const [allCommentsForTheTweet, setAllCommentsForTheTweet] = useState([])
        // a state for a comment, reuse this state when updating the comment
        const [pendingComment, setPendingComment] = useState({})
        // error messages for the comment update form
        const [errorMessageForPendingComment, setErrorMessageForPendingComment] = useState("")
        // state for the open status of the tweet edit popup
        const [pendingEditComment, setPendingEditComment] = useState({})
        const [pendingEditedCommentErrorMessage, setPendingEditedCommentErrorMessage] = useState()
        const [isTweetEditPopupOpen, setIsTweetEditPopupOpen] = useState(false)
        const[imageURL, setImageURL] = useState("")

        const [isImagePopupOpen, setIsImagePopupOpen] = useState(false)
        // state for the open status of the comment edit popup
        const [isEditCommentPopupOpen, setIsEditCommentPopupOpen] = useState(false)
    // functions

    // get the current user
    const fetchCurrentUser = async () => {
        axios.get(`http://localhost:8000/api/users/${currentUserId}`)
        .then((res) => {
            console.log("ViewOneTweet getOneUser res.data: ", res.data)
            setCurrentUser(res.data)
            setPendingComment(prevComment => ({
                ...prevComment,
                user_id: res.data._id,
                username: res.data.username,
                user_image_url: res.data.user_image_url
            }))
        })
        .catch((err) => {
            console.log("ViewOneTweet getOneTweet catch err: ", err)
        })
    }

    useEffect(() => {
        fetchCurrentUser()
        fetchTweet();
        fetchComments();
    }, [tweetId])

    // get the tweet
    const fetchTweet = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/tweets/${tweetId}`)
            console.log("ViewOneTweet getOneTweet try res.data", response.data)
            setTweet(response.data)
            setPendingEditedTweet(response.data)
            setPendingComment(prevComment => ({
                ...prevComment,
                tweet_id: response.data._id
            }))
        }
        catch (err) {
            console.log("ViewOneTweet getOneTweet catch err: ", err)
        }
    }
    // BONUS: get the comments
    const fetchComments = async () => { 
        axios.get(`http://localhost:8000/api/comments`)
            .then((res) => {
                console.log("ViewOneTweet getAllComments res.data: ", res.data)
                const allComments = res.data
                const allCommentsForThisTweet = allComments.filter(comment => comment.tweet_id === tweetId)
                const allCommentsForThisTweetSortedByNewest = allCommentsForThisTweet.sort((a, b) => 
                new Date(b.date_added) - new Date(a.date_added))
                setAllCommentsForTheTweet(allCommentsForThisTweetSortedByNewest)
            })
            .catch((err) => {
                console.log("ViewOneTweet getAllComments catch err: ", err)
            })
    }

    // logout
    const logout = () => {
        axios.post('http://localhost:8000/api/logout', {}, {withCredentials:true})
            .then((res) => {
                localStorage.removeItem("currentUser");
                navigate('/')
            })
            .catch((err) => {
                console.log("ViewAllTweets logout catch err: ", err)
            })
    }

    // toHome
    const toHome = () => navigate(`/all_tweets/${currentUserId}`)

    // toMyProfile
    const toMyProfile = () => navigate(`/profiles/${currentUserId}/${currentUserId}`)

    // toNewTweet
    const toNewTweet = () => navigate(`/new_tweet/${currentUserId}`)

    // toTweeterProfile
    const toTweeterProfile = (userId) => navigate(`/profiles/${currentUserId}/${userId}`)

    // edit tweet function form in a popup
    const openEditTweetPopup = () => {
        setIsTweetEditPopupOpen(true)
    }

    const editTweetHandler = (e) => {
        setPendingEditedTweet({...pendingEditedTweet, [e.target.name]:e.target.value})
    }

    const submitTweetEdit = (e) => {
        // patch the tweet with the editedTweet info
        e.preventDefault()
        axios.patch(`http://localhost:8000/api/tweets/${tweetId}`, pendingEditedTweet)
        .then( res => {
            console.log("ViewOneTweet submitTweetEdit res: ", res)
            setPendingEditedTweet(res.data)
            setTweet(res.data)
            setIsTweetEditPopupOpen(false)
            fetchTweet()
        })
        .catch(err => {
            console.log("ViewOneTweet submitTweetEdit catch err: ", err.response.data.errors.text_content.message)
            setPendingEditedTweetErrorMessage(err.response.data.errors.text_content.message)
        })
    }

    const cancelTweetEdit = () => {
        setPendingEditedTweet(tweet)
        setIsTweetEditPopupOpen(false)
    }
    // delete tweet function
    const deleteTweet = () => {
        console.log("ViewOneTweet deleteTweet beenClicked")
        console.log("tweet to delete id: ", tweet._id)
        axios.delete(`http://localhost:8000/api/tweets/${tweetId}`)
        .then(res => {
            console.log("ViewOneTweet deleteTweet res: ", res)
            navigate(`/all_tweets/${currentUser._id}`)
        })
        .catch(err => {
            console.log("ViewOneTweet deleteTweet catch err: ", err)
        })
    }

    // BONUS: image popup
    const openImage = (image_url) => {
        setImageURL(image_url)
        setIsImagePopupOpen(true)
    }

    const closeImage = () => {
        setIsImagePopupOpen(false)
    }
    // BONUS: like function
    const likeTweet = async () => {
        try {
            const updatedTweet = {...tweet}
            console.log("likeTweet clicked")
            if(updatedTweet.users_that_disliked_this_tweet.includes(currentUserId)){
                updatedTweet.users_that_disliked_this_tweet = updatedTweet.users_that_disliked_this_tweet.filter(userId => userId !== currentUserId)
                updatedTweet.dislikes_count = updatedTweet.users_that_disliked_this_tweet.length
            }
            if(updatedTweet.users_that_liked_this_tweet.includes(currentUserId)){
                updatedTweet.users_that_liked_this_tweet = updatedTweet.users_that_liked_this_tweet.filter(userId => userId !== currentUserId)
                updatedTweet.likes_count = updatedTweet.users_that_liked_this_tweet.length
            }
            else {
                updatedTweet.users_that_liked_this_tweet.push(currentUserId)
                updatedTweet.likes_count = updatedTweet.users_that_liked_this_tweet.length
            }
            axios.patch(`http://localhost:8000/api/tweets/${updatedTweet._id}`, updatedTweet)
                .then( res => {
                    console.log("ViewAllTweets likeTweet patch then res: ", res)
                    fetchTweet()
                })
                .catch(err => {
                    console.log("ViewAllTweets likeTweet patch catch err: ", err)
                })
        }
        catch (err) {
            console.log("ViewAllTweets likeTweet main catch err", err)
            fetchTweet()
        }
    }
    // BONUS: dislike function
    const dislikeTweet = async () => {
        try {
            const updatedTweet = {...tweet}
            if(updatedTweet.users_that_liked_this_tweet.includes(currentUserId)){
                updatedTweet.users_that_liked_this_tweet = updatedTweet.users_that_liked_this_tweet.filter(userId => userId !== currentUserId)
                updatedTweet.likes_count = updatedTweet.users_that_liked_this_tweet.length
            }
            if(updatedTweet.users_that_disliked_this_tweet.includes(currentUserId)) {
                updatedTweet.users_that_disliked_this_tweet = updatedTweet.users_that_disliked_this_tweet.filter(userId => userId !== currentUserId)
                updatedTweet.dislikes_count = updatedTweet.users_that_disliked_this_tweet.length
            }
            else {
                updatedTweet.users_that_disliked_this_tweet.push(currentUserId)
                updatedTweet.dislikes_count = updatedTweet.users_that_disliked_this_tweet.length
            }
            axios.patch(`http://localhost:8000/api/tweets/${updatedTweet._id}`, updatedTweet)
                .then( res => {
                    console.log("ViewAllTweets dislikeTweet patch then res: ", res)
                    fetchTweet()
                })
                .catch(err => {
                    console.log("ViewAllTweets patch catch err: ", err)
                })
        }
        catch (err) {
            console.log("ViewAllTweets dislikeTweet main catch err: ", err)
            fetchTweet()
        }
    }

    // BONUS: retweet function
    const retweetTweet = () => {
        try {
            const updatedTweet = {...tweet}
            if(updatedTweet.users_that_retweeted_this_tweet.includes(currentUserId)){
                updatedTweet.users_that_retweeted_this_tweet = updatedTweet.users_that_retweeted_this_tweet.filter(userId => userId !== currentUserId)
                updatedTweet.retweets_count = updatedTweet.users_that_retweeted_this_tweet.length
            }
            else {
                updatedTweet.users_that_retweeted_this_tweet.push(currentUserId)
                updatedTweet.retweets_count = updatedTweet.users_that_retweeted_this_tweet.length
            }
            axios.patch(`http://localhost:8000/api/tweets/${updatedTweet._id}`, updatedTweet)
                .then( res =>{
                    console.log("ViewAllTweets retweetTweet patch then res: ", res)
                    fetchTweet()
                })
                .catch(err => {
                    console.log("ViewAllTweets retweetTweet patch catch err: ", err)
                })
        }
        catch (err) {
            console.log("ViewAllTweets retweetTweet main catch err: ", err)
            fetchTweet()
        }
    }

    // BONUS: create comment form in a popup
    const commentFormChangeHandler = (e) => {
        setPendingComment({...pendingComment, [e.target.name]:e.target.value})
    }

    const newCommentFormSubmission = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8000/api/comments', pendingComment)
            .then((res) => {
                console.log("ViewOneTweet newCommentFormSubmission then res.data: ", res.data)
                const commentId = res.data._id
                const updatedCommentIds = [...tweet.comment_IDs, commentId]
                const updatedTweet = {
                    ...tweet,
                    comment_IDs: updatedCommentIds,
                    comments_count: updatedCommentIds.length
                }
                axios.patch(`http://localhost:8000/api/tweets/${tweet._id}`, updatedTweet)
                    .then((res) => {
                        console.log("ViewOneTweet newCommentFormSubmission updateTweet then res: ", res)
                        setTweet(updatedTweet)
                    })
                    .catch((err) => {
                        console.log("ViewOneTweet newCommentFormSubmission updateTweet catch err: ", err)
                    })
                setPendingComment({})
                fetchCurrentUser()
                fetchTweet()
                fetchComments()
            })
            .catch((err) => {
                console.log("ViewOneTweet newCommentFormSubmission catch err: ", err)
                setErrorMessageForPendingComment(err.response.data.errors)
            })
    }

    // edit comment form in a popup
    const hoverOverCommentToEdit = (comment) => {
        setPendingEditComment(comment)
        console.log("Comment to edit: ", comment)
    }

    const editCommentPopup = () => {
        setIsEditCommentPopupOpen(true)
    }

    const editCommentFormChangeHandler = (e) => {
        setPendingEditComment({...pendingEditComment, [e.target.name]:e.target.value})
    }

    const editCommentFormSubmission = (e) => {
        e.preventDefault()
        axios.patch(`http://localhost:8000/api/comments/${pendingEditComment._id}`, pendingEditComment)
            .then((res) => {
                console.log("ViewOneTweet editCommentFormSubmission then res.data: ", res.data)
                fetchCurrentUser()
                fetchTweet()
                fetchComments()
                setIsEditCommentPopupOpen(false)
            })
            .catch((err) => {
                console.log("ViewOneTweet editCommentFormSubmission catch err: ", err)
            })
    }

    const cancelEditComment = () => {
        setIsEditCommentPopupOpen(false)
    }

    // delete comment button
    const deleteComment = () => {
        console.log("ViewOneTweet deleteComment beenClicked")
        console.log("Comment to delete id: ", pendingComment._id)
        axios.delete(`http://localhost:8000/api/comments/${pendingEditComment._id}`)
            .then(res => {
                console.log("ViewOneTweet deleteComment res: ", res)
                const updatedCommentIDs = tweet.comment_IDs.filter(commentId => commentId != pendingEditComment._id)
                const updatedCommentIdsCount = updatedCommentIDs.length
                const updatedTweet = {...tweet, comments_count: updatedCommentIdsCount, comment_IDs: updatedCommentIDs}
                axios.patch(`http://localhost:8000/api/tweets/${tweet._id}`, updatedTweet)
                    .then((res) => {
                        console.log("ViewOneTweet newCommentFormSubmission updateTweet then res: ", res)
                        setTweet(updatedTweet)
                    })
                    .catch((err) => {
                        console.log("ViewOneTweet newCommentFormSubmission updateTweet catch err: ", err)
                    })
                fetchCurrentUser()
                fetchTweet()
                fetchComments()
            })
            .catch(err => {
                console.log("ViewOneTweet deleteComment catch err: ", err)
            })
    }

    const toCommenterProfile = (user_id) => navigate(`/profiles/${currentUserId}/${user_id}`)
    // BONUS: like comment
    const likeComment = async () => {
        try {
            // users_who_liked_this_comment, likes_count, users_who_disliked_this_comment, dislikes_count
            const updatedComment = {...pendingEditComment}
            console.log("ViewOneTweet likeComment clicked")
            if(updatedComment.users_who_disliked_this_comment.includes(currentUserId)){
                updatedComment.users_who_disliked_this_comment = updatedComment.users_who_disliked_this_comment.filter(userId => userId !== currentUserId)
                updatedComment.dislikes_count = updatedComment.users_who_disliked_this_comment.length
            }
            if(updatedComment.users_who_liked_this_comment.includes(currentUserId)){
                updatedComment.users_who_liked_this_comment = updatedComment.users_who_liked_this_comment.filter(userId => userId !== currentUserId)
                updatedComment.likes_count = updatedComment.users_who_liked_this_comment.length
            }
            else {
                updatedComment.users_who_liked_this_comment.push(currentUserId)
                updatedComment.likes_count = updatedComment.users_who_liked_this_comment.length
            }
            axios.patch(`http://localhost:8000/api/comments/${updatedComment._id}`, updatedComment)
                .then( res => {
                    console.log("ViewOneTweet likeComment patch then res: ", res);
                    setPendingEditComment(res.data)
                    fetchComments()
                })
                .catch(err => {
                    console.log("ViewOneTweet likeComment patch catch err: ", err)
                })
        }
        catch (err) {
            console.log("ViewOneTweet likeComment main catch err: ", err)
            fetchComments()
        }
    }

    // BONUS: dislike comment
    const dislikeComment = async () => {
        try {
            const updatedComment = {...pendingEditComment}
            console.log("ViewOneTweet dislikeComment clicked")
            if(updatedComment.users_who_liked_this_comment.includes(currentUserId)){
                updatedComment.users_who_liked_this_comment = updatedComment.users_who_liked_this_comment.filter(userId => userId !== currentUserId)
                updatedComment.likes_count = updatedComment.users_who_liked_this_comment.length
            }
            if(updatedComment.users_who_disliked_this_comment.includes(currentUserId)){
                updatedComment.users_who_disliked_this_comment = updatedComment.users_who_disliked_this_comment.filter(userId => userId !== currentUserId)
                updatedComment.dislikes_count = updatedComment.users_who_disliked_this_comment.length
            }
            else {
                updatedComment.users_who_disliked_this_comment.push(currentUserId)
                updatedComment.dislikes_count = updatedComment.users_who_disliked_this_comment.length
            }
            axios.patch(`http://localhost:8000/api/comments/${updatedComment._id}`, updatedComment)
                .then( res => {
                    console.log("ViewOneTweet dislikeComment patch then res: ", res)
                    setPendingEditComment(res.data)
                    fetchComments()
                })
                .catch(err => {
                    console.log("ViewOneTweet dislikeComment patch catch err: ", err)
                })
        }
        catch (err) {
            console.log("ViewOneTweet dislikeComment main catch err: ", err)
            fetchComments()
        }
    }

    // BONUS: comment on comment
        // fetchComments
    return (
        <div style={{backgroundColor: '#80aaff', fontFamily: 'arial'}}> {/*Whole page*/}
            <h1 style={{marginBottom: '-20px', display: 'flex', justifyContent: 'center', color: 'white', textShadow: '0 0 5px gold'}}>VIEW ONE TWEET</h1>
            <div style={{height: '100px', width: '100%', display: 'flex', justifyContent: 'center'}}> {/* Main content*/}
                <div style={{width: '140px', marginRight: '50px', marginTop: '20px'}}></div> {/* Left side spaceholder */}
                <div style={{width: '540px', marginRight: '50px', marginTop: '20px'}}> {/* The middle column*/}
                    <div style={{backgroundColor: 'white', marginBottom: '30px', padding: '20px', borderRadius: '20px', border: '2px solid black'}}> {/* The tweet*/}
                        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '-20px'}}> {/*top row */}
                            <button style={{display: 'flex', backgroundColor: 'white', border: 'white', alignItems: 'center'}} onClick={() => toTweeterProfile(tweet.user_id)}>
                                <img style={{height: '40px', width: '40px', border: '2px solid blue', borderRadius: '50px', marginRight: '10px'}} src={tweet.user_image_url}/>
                                <p style={{color: 'blue', fontSize: '30px'}}>{tweet.username}</p>
                            </button>
                            {tweet.user_id == currentUserId &&
                                <div style={{marginTop: '20px'}}>
                                    {/* edit button */}
                                    <button style={{height: '30px', borderRadius: '30px', color: 'blue',  marginRight: '20px'}}  onClick={() => openEditTweetPopup()}>Edit</button>
                                    {/* delete button */}
                                    <button style={{height: '30px', borderRadius: '30px', color: 'white', backgroundColor: 'red'}} onClick={() =>  deleteTweet()}>Delete</button>
                                </div>
                            }
                        </div>
                        {isTweetEditPopupOpen &&
                            <div style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'lightgray', padding: '20px', border: '2px solid black', borderRadius: '20px', zIndex: '1000', width: '540px'}}>
                                <button onClick={() => cancelTweetEdit()}>Cancel</button>{/* The cancel button*/}
                                <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={submitTweetEdit}>
                                    <h3>Choose up to four images!</h3>
                                    <div>
                                        <label htmlFor="image_url_one">Image URL One</label>
                                        <input id="image_url_one" type="text" value={pendingEditedTweet.image_url_one} name="image_url_one" onChange={editTweetHandler}/>
                                        {/* error message */}
                                    </div>
                                    <div>
                                        <label htmlFor="image_url_two">Image URL Two</label>
                                        <input id="image_url_two" type="text" value={pendingEditedTweet.image_url_two} name="image_url_two" onChange={editTweetHandler}/>
                                    </div>
                                    <div>
                                        <label htmlFor="image_url_three">Image URL Three</label>
                                        <input id="image_url_three" type="text" value={pendingEditedTweet.image_url_three} name="image_url_three" onChange={editTweetHandler}/>
                                    </div>
                                    <div>
                                        <label htmlFor="image_url_four">Image URL Four</label>
                                        <input id="image_url_four" type="text" value={pendingEditedTweet.image_url_four} name="image_url_four" onChange={editTweetHandler}/>
                                    </div>
                                    <div>
                                        <label htmlFor="text_content">Tweet Text</label>
                                        <input id="text_content" type="text" value={pendingEditedTweet.text_content} name="text_content" onChange={editTweetHandler}/>
                                        <div>{pendingEditedTweetErrorMessage && <p style={{color: "red"}}>{pendingEditedTweetErrorMessage}</p>}</div>
                                    </div>
                                    <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                                        <button style={{height: '30px', borderRadius: '30px', color: 'blue'}}>Post Edit</button>
                                    </div>
                                </form>
                            </div>
                        }
                            {/* tweet image urls in grid with display algorithm*/}
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            {tweet.image_url_one && !tweet.image_url_two && !tweet.image_url_three && !tweet.image_url_four && ( 
                                <img style={{width: '400px'}} src={tweet.image_url_one}/>
                            )}
                            {!tweet.image_url_one && tweet.image_url_two && !tweet.image_url_three && !tweet.image_url_four && (
                                <img style={{width: '400px'}} src={tweet.image_url_two}/>
                            )}
                            {!tweet.image_url_one && !tweet.image_url_two && tweet.image_url_three && !tweet.image_url_four && (
                                <img style={{width: '400px'}} src={tweet.image_url_three}/>
                            )}
                            {!tweet.image_url_one && !tweet.image_url_two && !tweet.image_url_three && tweet.image_url_four && (
                                <img style={{width: '400px'}} src={tweet.image_url_four}/>
                            )}
                            {tweet.image_url_one && tweet.image_url_two && !tweet.image_url_three && !tweet.image_url_four && (
                                <div style={{display: 'flex', alignContent: 'top'}}>
                                    <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_one} onClick={() => openImage(tweet.image_url_one)}/>
                                    <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_two} onClick={() => openImage(tweet.image_url_two)}/>
                                </div>
                            )}
                            {tweet.image_url_one && !tweet.image_url_two && tweet.image_url_three && !tweet.image_url_four && (
                                <div style={{display: 'flex', alignContent: 'top'}}>
                                    <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_one} onClick={() => openImage(tweet.image_url_one)}/>
                                    <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_three} onClick={() => openImage(tweet.image_url_three)}/>
                                </div>
                            )}
                            {tweet.image_url_one && !tweet.image_url_two && !tweet.image_url_three && tweet.image_url_four && (
                                <div style={{display: 'flex', alignContent: 'top'}}>
                                    <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_one} onClick={() => openImage(tweet.image_url_one)}/>
                                    <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_four} onClick={() => openImage(tweet.image_url_four)}/>
                                </div>
                            )}
                            {!tweet.image_url_one && tweet.image_url_two && tweet.image_url_three && !tweet.image_url_four && (
                                <div style={{display: 'flex', alignContent: 'top'}}>
                                    <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_two} onClick={() => openImage(tweet.image_url_two)}/>
                                    <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_three} onClick={() => openImage(tweet.image_url_three)}/>
                                </div>
                            )}
                            {!tweet.image_url_one && tweet.image_url_two && !tweet.image_url_three && tweet.image_url_four && (
                                <div style={{display: 'flex', alignContent: 'top'}}>
                                    <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_two} onClick={() => openImage(tweet.image_url_two)}/>
                                    <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_four} onClick={() => openImage(tweet.image_url_four)}/>
                                </div>
                            )}
                            {!tweet.image_url_one && !tweet.image_url_two && tweet.image_url_three && tweet.image_url_four && (
                                <div style={{display: 'flex', alignContent: 'top'}}>
                                    <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_three} onClick={() => openImage(tweet.image_url_three)}/>
                                    <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_four} onClick={() => openImage(tweet.image_url_four)}/>
                                </div>
                            )}
                            {tweet.image_url_one && tweet.image_url_two && tweet.image_url_three && !tweet.image_url_four && (
                                <div>
                                    <div style={{display: 'flex', alignContent: 'top'}}>
                                        <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_one} onClick={() => openImage(tweet.image_url_one)}/>
                                        <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_two} onClick={() => openImage(tweet.image_url_two)}/>
                                    </div>
                                    <img style={{width: '200px'}} src={tweet.image_url_three} onClick={() => openImage(tweet.image_url_three)}/>
                                </div>
                            )}
                            {tweet.image_url_one && tweet.image_url_two && !tweet.image_url_three && tweet.image_url_four && (
                                <div>
                                    <div style={{display: 'flex', alignContent: 'top'}}>
                                        <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_one} onClick={() => openImage(tweet.image_url_one)}/>
                                        <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_two} onClick={() => openImage(tweet.image_url_two)}/>
                                    </div>
                                    <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_four} onClick={() => openImage(tweet.image_url_four)}/>
                                </div>
                            )}
                            {tweet.image_url_one && !tweet.image_url_two && tweet.image_url_three && tweet.image_url_four && (
                                <div>
                                    <div style={{display: 'flex', alignContent: 'top'}}>
                                        <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_one} onClick={() => openImage(tweet.image_url_one)}/>
                                        <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_three} onClick={() => openImage(tweet.image_url_three)}/>
                                    </div>
                                    <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_four} onClick={() => openImage(tweet.image_url_four)}/>
                                </div>
                            )}
                            {!tweet.image_url_one && tweet.image_url_two && tweet.image_url_three && tweet.image_url_four && (
                                <div>
                                    <div style={{display: 'flex', alignContent: 'top'}}>
                                        <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_two} onClick={() => openImage(tweet.image_url_two)}/>
                                        <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_three} onClick={() => openImage(tweet.image_url_three)}/>
                                    </div>
                                    <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_four} onClick={() => openImage(tweet.image_url_four)}/>
                                </div>
                            )}
                            {tweet.image_url_one && tweet.image_url_two && tweet.image_url_three && tweet.image_url_four && (
                                <div>
                                    <div style={{display: 'flex', alignContent: 'top'}}>
                                        <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_one} onClick={() => openImage(tweet.image_url_one)}/>
                                        <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_two} onClick={() => openImage(tweet.image_url_two)}/>
                                    </div>
                                    <div style={{display: 'flex', alignContent: 'top'}}>
                                        <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_three} onClick={() => openImage(tweet.image_url_three)}/>
                                        <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_four} onClick={() => openImage(tweet.image_url_four)}/>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* each image has a popup that onclick closes the popup */}
                        {isImagePopupOpen && <div style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', border: '2px solid black', borderRadius: '20px', zIndex: '1000', width: '540px'}} onClick={() => closeImage()}>
                                <img style={{width: '500px'}} src={imageURL}/>
                            </div>}
                        {/* tweet text_content */}
                        <p1>{tweet.text_content}</p1>
                        {/* bottom bar: */}
                            {/* BONUS: if tweet's user_id !== current user's id */}
                                {/* like button with likes count */}
                                {/* dislike button with dislikes count */}
                                {/* retweet button with retweets count */}
                            {/* BONUS: comments count*/}
                        {tweet.user_id == currentUserId && 
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'blue'}}>
                                        <img style={{height: "50px"}} src="https://www.pngall.com/wp-content/uploads/5/Like-Button-PNG-HD-Image.png"/>
                                        <p>{tweet.likes_count} Likes</p>
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'blue'}}>
                                        <img style={{height: "50px"}} src="https://purepng.com/public/uploads/medium/flat-design-dislike-button-8c4.png"/>
                                        <p>{tweet.dislikes_count} Dislikes</p>
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'blue'}}>
                                        <img style={{height: "50px"}} src="https://cdn0.iconfinder.com/data/icons/twitter-ui-flat/48/Twitter_UI-13-512.png"/>
                                        <p>{tweet.retweets_count} Retweets</p>
                                    </div>
                                    <button style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'blue', backgroundColor: 'white', border: '0px'}} onClick={() => commentOnTweet() }>
                                        <img style={{height: "50px"}} src="https://www.freeiconspng.com/thumbs/comment-png/comment-png-0.png"/>
                                        <p>{tweet.comments_count} Comments</p>
                                    </button>
                                </div>
                            }
                            {tweet.user_id !== currentUserId &&
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <button style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'blue', backgroundColor: 'white', border: '0px'}} onClick={() => likeTweet()}>
                                        <img style={{height: "50px"}} src="https://www.pngall.com/wp-content/uploads/5/Like-Button-PNG-HD-Image.png"/>
                                        <p>{tweet.likes_count} Likes</p>
                                    </button>
                                    <button style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'blue', backgroundColor: 'white', border: '0px'}} onClick={() => dislikeTweet()}>
                                        <img style={{height: "50px"}} src="https://purepng.com/public/uploads/medium/flat-design-dislike-button-8c4.png"/>
                                        <p>{tweet.dislikes_count} Dislikes</p>
                                    </button>
                                    <button style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'blue', backgroundColor: 'white', border: '0px'}} onClick={() => retweetTweet()}>
                                        <img style={{height: "50px"}} src="https://cdn0.iconfinder.com/data/icons/twitter-ui-flat/48/Twitter_UI-13-512.png"/>
                                        <p>{tweet.retweets_count} Retweets</p>
                                    </button>
                                    <button style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'blue', backgroundColor: 'white', border: '0px'}} onClick={() => commentOnTweet() }>
                                        <img style={{height: "50px"}} src="https://www.freeiconspng.com/thumbs/comment-png/comment-png-0.png"/>
                                        <p>{tweet.comments_count} Comments</p>
                                    </button>
                                </div>
                            }
                    </div>
                    <p>{tweet.comments_count} Comments</p>
                    <div style={{width: '450px', marginLeft: 'auto', display: 'flex', flexDirection: 'column'}}>{/* comments container */}
                        <div style={{border: '2px solid black', borderRadius: '15px', paddingLeft: '20px', paddingBottom: '20px', display: 'flex', flexDirection: 'column'}}>
                            <p style={{marginBottom: '30px'}} >Leave a Comment!</p>
                            {/* BONUS: comment form */}
                            <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={newCommentFormSubmission}>
                                <p>Choose up to 4 images!</p>
                                <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between', marginRight: '40px'}}>
                                    <label htmlFor="comment_image_url_one">Image URL One:  </label>
                                    <input id="comment_image_url_one" type="text"  name="image_url_one" value={pendingComment.image_url_one || ''} onChange={commentFormChangeHandler}/>
                                </div>
                                <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between', marginRight: '40px'}}>
                                    <label htmlFor="comment_image_url_two">Image URL Two: </label>
                                    <input id="comment_image_url_two" type="text" name="image_url_two" value={pendingComment.image_url_two || ''} onChange={commentFormChangeHandler} />
                                </div>
                                <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between', marginRight: '40px'}}>
                                    <label htmlFor="comment_image_url_three">Image URL Three: </label>
                                    <input id="comment_image_url_three" type="text" name="image_url_three" value={pendingComment.image_url_three || ''} onChange={commentFormChangeHandler} />
                                </div>
                                <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between', marginRight: '40px'}}>
                                    <label htmlFor="comment_image_url_four">Image URL Four: </label>
                                    <input id="comment_image_url_four" type="text" name="image_url_four" value={pendingComment.image_url_four || ''} onChange={commentFormChangeHandler} />
                                </div>
                                <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between', marginRight: '40px'}}>
                                    <label htmlFor="comment_text_content">Text: </label>
                                    <textarea rows={5} id="comment_text_content" type="text" name="text_content" value={pendingComment.text_content || ''} onChange={commentFormChangeHandler} />
                                </div>
                                <div>{errorMessageForPendingComment && <p style={{color: 'red'}}>{errorMessageForPendingComment}</p>}</div>
                                <button style={{marginLeft: 'auto', marginRight: '40px', marginTop: '10px', color: 'blue', height: '30px', borderRadius: '15px'}}>Post Comment</button>
                            </form>
                        </div>
                    {/* BONUS: all_comments_for_this_tweet */}
                        {/* comment user info and link to their profile */}
                        {/* comment text */}
                        {/* comment images */}
                        {/* the comment column */}
                        {allCommentsForTheTweet.map((comment) => (
                            <div style={{backgroundColor: 'white', marginBottom: '10px', padding: '20px', borderRadius: '20px', border: '2px solid black'}} key={comment._id} onMouseOver={() => hoverOverCommentToEdit(comment)}>
                                {/* comment user */}
                                <div style={{display: 'flex', justifyContent: 'space-between'}}> {/* comment top bar*/}
                                    <button style={{backgroundColor: 'white', color: 'blue', display: 'flex', border: 'white', alignItems: 'center'}} onClick={() => toCommenterProfile(comment.user_id)}>
                                        {currentUserId == comment.user_id && <img style={{width: '20px', height: '20px', border: '2px solid gold', borderRadius: '20px'}} src={comment.user_image_url}/>}
                                        {currentUserId !== comment.user_id && <img style={{width: '20px', height: '20px', border: '2px solid blue', borderRadius: '20px'}} src={comment.user_image_url}/>}
                                        <p style={{fontSize: '15px'}}>{comment.username}</p>
                                    </button>
                                    {/* comment edit and delete (if by same userr in same line */}
                                    {currentUserId == comment.user_id &&
                                        <div>
                                            <button style={{borderRadius: '10px', color: 'blue', marginRight: '10px'}} onClick={() => editCommentPopup()}>Edit</button>
                                            <button style={{borderRadius: '10px', color: 'white', backgroundColor: 'red'}} onClick={() => deleteComment()}>Delete</button>
                                        </div>
                                    }
                                </div>
                                {/* comment images */}
                                <div>
                                    <div style={{display: 'flex', alignContent: 'top'}}>
                                        {comment.image_url_one && <img style={{width: '200px', objectFit: 'cover'}} src={comment.image_url_one} onClick={() => openImage(tweet.image_url_one)}/>}
                                        {comment.image_url_two && <img style={{width: '200px', objectFit: 'cover'}} src={comment.image_url_two} onClick={() => openImage(tweet.image_url_two)}/>}
                                    </div>
                                    <div style={{display: 'flex', alignContent: 'top'}}>
                                        {comment.image_url_three && <img style={{width: '200px', objectFit: 'cover'}} src={comment.image_url_three} onClick={() => openImage(tweet.image_url_three)}/>}
                                        {comment.image_url_four && <img style={{width: '200px', objectFit: 'cover'}} src={comment.image_url_four} onClick={() => openImage(tweet.image_url_four)}/>}
                                    </div>
                                </div>
                                {/* comment text */}
                                <p>{comment.text_content}</p>
                                {/* comment like and dislike if not by same user */}
                                {currentUserId !== comment.user_id &&
                                    <div style={{display: 'flex', marginTop: '50px', marginBottom: '-20px'}}>
                                        <button style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'blue', backgroundColor: 'white', border: '0px'}} onClick={() => likeComment()}>
                                            <img style={{height: "20px"}} src="https://www.pngall.com/wp-content/uploads/5/Like-Button-PNG-HD-Image.png"/>
                                            <p>{comment.likes_count} Likes</p>
                                        </button>
                                        <button style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'blue', backgroundColor: 'white', border: '0px'}} onClick={() => dislikeComment()}>
                                            <img style={{height: "20px"}} src="https://purepng.com/public/uploads/medium/flat-design-dislike-button-8c4.png"/>
                                            <p>{comment.dislikes_count} Dislikes</p>
                                        </button>
                                    </div>
                                }
                                {currentUserId === comment.user_id &&
                                    <div style={{display: 'flex', marginTop: '50px', marginBottom: '-20px'}}>
                                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'blue', marginRight: '30px'}}>
                                            <img style={{height: "20px"}} src="https://www.pngall.com/wp-content/uploads/5/Like-Button-PNG-HD-Image.png"/>
                                            <p>{comment.likes_count} Likes</p>
                                        </div>
                                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'blue'}}>
                                            <img style={{height: "20px"}} src="https://purepng.com/public/uploads/medium/flat-design-dislike-button-8c4.png"/>
                                            <p>{comment.dislikes_count} Dislikes</p>
                                        </div>
                                    </div>
                                }
                            </div>
                        ))}
                    {/* popup comment edit form*/}
                    {isEditCommentPopupOpen && 
                        <div style={{position: 'fixed', top: '50%', left: '50%', width: '400px', transform: 'translate(-50%, -50%)', backgroundColor: 'white', border: '2px solid black', borderRadius: '15px', padding: '20px', zIndex: '999'}}>
                            <button style={{color: 'white', backgroundColor: 'red', height: '30px', borderRadius: '30px', marginLeft: 'auto'}} onClick={() => cancelEditComment()}>Cancel</button>
                            <form style={{display: 'flex', flexDirection: 'column'}}onSubmit={editCommentFormSubmission}>
                                <p style={{marginBottom: '-10px'}}>Edit your comment!</p>
                                <p>Choose up to 4 images!</p>
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                                    <label htmlFor="comment_image_url_one">First Image URL:</label>
                                    <input id="comment_image_url_one" type="text" name="image_url_one" value={pendingEditComment.image_url_one || ''} onChange={editCommentFormChangeHandler}/>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                                    <label htmlFor="comment_image_url_two">Second Image URL:</label>
                                    <input id="comment_image_url_two" type="text" name="image_url_two" value={pendingEditComment.image_url_two || ''} onChange={editCommentFormChangeHandler}/>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                                    <label htmlFor="comment_image_url_three">Third Image URL:</label>
                                    <input id="comment_image_url_three" type="text" name="image_url_three" value={pendingEditComment.image_url_three || ''} onChange={editCommentFormChangeHandler}/>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                                    <label htmlFor="comment_image_url_four">Fourth Image URL:</label>
                                    <input id="comment_image_url_four" type="text" name="image_url_four" value={pendingEditComment.image_url_four || ''} onChange={editCommentFormChangeHandler}/>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                                    <label htmlFor="comment_text_content">Text Content:</label>
                                    <input id="comment_text_content" type="text" name="text_content" value={pendingEditComment.text_content} onChange={editCommentFormChangeHandler}/>
                                </div>
                                <button style={{marginLeft: 'auto', width: '70px', height: '30px', borderRadius: '30px', color: 'blue'}}>Submit!</button>
                            </form>
                        </div>
                    }
                    </div>
                </div>
                <div style={{backgroundColor: 'white', width: '140px', height: '400px', display: 'flex', marginTop: '20px', borderRadius: '15px', border: '2px solid black', flexDirection: 'column'}}>
                {/* Right side bar: */}
                    {/* logout */}
                    <button style={{marginRight: 'auto', marginLeft: 'auto', width: '70px', marginTop: '20px', marginBottom: '20px', height: '30px', color: 'blue', borderRadius: '15px'}} onClick={() => logout()}>Log Out</button>
                    {/* current user's info */}
                    {/* link to /profiles/:current_userId/:otherUsersId */}
                    <button  style={{backgroundColor: 'white', border: 'white', color: 'blue', fontSize: '20px', marginBottom: '-20px' }} onClick={() => toMyProfile()}>
                        <img style={{border: '5px solid gold', height: '90px', width: '90px', borderRadius: '50px', color: 'blue'}} src={currentUser.user_image_url}/>
                        <p style={{marginBottom: '10px'}}>{currentUser.username}</p>
                        <p>View Profile</p>
                    </button>
                    <button style={{marginRight: 'auto', marginLeft: 'auto', marginBottom: '20px', width: '70px', height: '30px', color: 'blue', borderRadius: '15px', marginTop: '30px'}} onClick={() => toHome()}>Home</button>
                    {/* new_tweet */}
                    <button style={{width: '100px', marginLeft: 'auto', marginRight: 'auto', height: '30px', color: 'blue', borderRadius: '30px'}} onClick={() => toNewTweet()}>New Tweet</button>
                </div>
            </div>
        </div>
    )
}

export default ViewOneTweet