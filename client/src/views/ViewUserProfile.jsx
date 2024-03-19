// imports
import React, { useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';

const ViewUserProfile = () => {
    const navigate = useNavigate()
    const {currentUserId, otherUserId} = useParams()
    // states
        // the current user
        const [currentUser, setCurrentUser] = useState({})
        // the other user
        const [otherUser, setOtherUser] = useState({})
        // all users the other user is following
        const [allUserTheSelectedUserIsFollowing, setAllUsersTheSelectedUserIsFollowing] = useState([])
        // all the tweets and retweets by the other user
        const [allTweetsAndRetweetsByTheSelectedUserSortedByNewest, setAllTweetsAndRetweetsByTheSelectedUserSortedByNewest] = useState([])

        // image url popup
        const [imageURL, setImageURL] = useState("")
        const [isImagePopupOpen, setIsImagePopupOpen] = useState(false)
        // tweetToEdit state
        const [tweetToEdit, setTweetToEdit] = useState({})
        // is the current user in the list of following?
        const [amIfollowingTheSelectedUser, setAmIfollowingTheSelectedUser] = useState()

        // comment popup
        const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false)
        // pendingComment
        const [pendingComment, setPendingComment] = useState({})
        // comment
        const [comment, setComment] = useState({})
        // pendingCommentErrors
        const [pendingCommentErrors, setPendingCommentErrors] = useState()
    
    // functions and postman requests

    // get the current user, set in state
    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/${currentUserId}`)
        .then((res) => {
            console.log("ViewUserProfile getOneUser currentUserId then res.data: ", res.data)
            setCurrentUser(res.data)
            const isFollowing = currentUser.users_im_following.includes(otherUserId)
            setAmIfollowingTheSelectedUser(isFollowing)
        })
        .catch((err) => {
            console.log("ViewUserProfile getOneUser currenUserId catch err: ", err)
        })
    }, [currentUserId, otherUserId])
    // get the other user, set in state
    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/${otherUserId}`)
        .then((res) => {
            console.log("ViewUserProfile getOneUser otherUserId then res.data: ", res.data)
            setOtherUser(res.data)
        })
        .catch((err) => {
            console.log("ViewUserProfile getOneUser otherUserId catch err: ", err)
        })
    }, [currentUserId, otherUserId, amIfollowingTheSelectedUser])
    // get all the users the other user is following, set in state
    useEffect(() => {
        console.log("Get all users the user is following log")
        axios.get('http://localhost:8000/api/users')
        .then(res => {
            console.log("ViewAllTweets getAllUsers then res.data: ", res.data)
            const allUsers = res.data
            if(otherUser && otherUser.users_im_following) {
                const all_users_the_selected_user_is_following = allUsers.filter(user => otherUser.users_im_following.includes(user._id))
                console.log("all users the current user is following: ", all_users_the_selected_user_is_following)
                setAllUsersTheSelectedUserIsFollowing(all_users_the_selected_user_is_following)
                setAmIfollowingTheSelectedUser(currentUser.users_im_following.includes(otherUserId))
            }
        })
        .catch(err => {
            console.log("ViewAllTweets getAllUsers catch err: ", err)
        },[])
    }, [currentUserId,otherUser])

    // get all the tweets, filter all the tweets and retweets by the current user, sort by most recent, set in state
    const fetchTweets = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/tweets')
            console.log("ViewUserProfile getAllTweets then res.data: ", response.data)
            const tweetsAndRetweetsByOtherUser = response.data.filter(tweet => tweet.user_id === otherUserId || tweet.users_that_retweeted_this_tweet.includes(otherUserId))
            const tweetsAndRetweetsByOtherUserSortedByNewest = tweetsAndRetweetsByOtherUser.sort((a, b) => {
                const dateA = new Date(a.createdAt)
                const dateB = new Date(b.createdAt)
                return dateB - dateA
            })
            setAllTweetsAndRetweetsByTheSelectedUserSortedByNewest(tweetsAndRetweetsByOtherUserSortedByNewest)
        }
        catch (err) {
            console.log("ViewUserProfile getAllTweets catch err: ", err)
        }
    }

    useEffect(() => {
        fetchTweets();
    }, [currentUserId,otherUserId])
    // open image popup
    const openImage = (image_url) => {
        setImageURL(image_url)
        setIsImagePopupOpen(true)
    }

    // close image popup
    const closeImage = () => {
        setIsImagePopupOpen(false)
    }

    // hover the tweet to edit
    const hoverOverTweetToEdit =  (tweet) => {
        setTweetToEdit(tweet)
        console.log("Tweet to edit: ", tweet)
    }

    // like the tweet
    const likeTweet = async () => {
        try {
            const updatedTweet = {...tweetToEdit}
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
                    setTweetToEdit(res.data)
                    fetchTweets()
                })
                .catch(err => {
                    console.log("ViewAllTweets likeTweet patch catch err: ", err)
                })
        }
        catch (err) {
            console.log("ViewAllTweets likeTweet main catch err", err)
            fetchTweets()
        }
    }

    // dislike the tweet
    const dislikeTweet = async () => {
        try {
            const updatedTweet = {...tweetToEdit}
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
                    setTweetToEdit(res.data)
                    fetchTweets()
                })
                .catch(err => {
                    console.log("ViewAllTweets patch catch err: ", err)
                })
        }
        catch (err) {
            console.log("ViewAllTweets dislikeTweet main catch err: ", err)
            fetchTweets()
        }
    }

    // retweet the tweet
    const retweetTweet = () => {
        try {
            const updatedTweet = {...tweetToEdit}
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
                    setTweetToEdit(res.data)
                    fetchTweets()
                })
                .catch(err => {
                    console.log("ViewAllTweets retweetTweet patch catch err: ", err)
                })
        }
        catch (err) {
            console.log("ViewAllTweets retweetTweet main catch err: ", err)
            fetchTweets()
        }
    }

    // comment popup with validations

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

    // toNewTweet 
    const toNewTweet = () => navigate(`/new_tweet/${currentUserId}`)

    // toTweeterProfile
    const toTweeterProfile = (userId) => navigate(`/profiles/${currentUserId}/${userId}`)

    // toTweet
    const toTweet = (tweetId) => navigate(`/view_tweet/${currentUserId}/${tweetId}`)

    // toHome
    const toHome = () => navigate(`/all_tweets/${currentUserId}`)

    // follow/unfollow function
    const followAndUnfollow= () => {
        const pendingCurrentUser = {...currentUser}
        // if currentUser.users_im_following.includes(otherUserId), remove otherUserId
        if(pendingCurrentUser.users_im_following.includes(otherUserId)) {
            pendingCurrentUser.users_im_following = pendingCurrentUser.users_im_following.filter(userId => userId !== otherUserId)
        }
        // else push otherUserId to currentUser.users_im_following
        else {
            pendingCurrentUser.users_im_following.push(otherUserId)
        }
        // patch otherUser with the new info
        axios.patch(`http://localhost:8000/api/users/${currentUserId}`, pendingCurrentUser)
            .then(res => {
                console.log("ViewUserProfile followAndUnfollow patch then res: ", res)
                setCurrentUser(res.data)
                setAmIfollowingTheSelectedUser(pendingCurrentUser.users_im_following.includes(otherUserId))
                // setAmIfollowingTheSelectedUser(!amIfollowingTheSelectedUser)
                console.log("Users I'm following: ", pendingCurrentUser.users_im_following)
            })
            .catch(err => {
                console.log("ViewUserProfile followAndUnfollow patch catch err: ", err)
            })
    }

    return (
        <div style={{fontFamily: 'arial'}}>
            {currentUserId == otherUserId && <h1 style={{backgroundColor: '#80aaff', marginBottom: '-20px', display: 'flex', justifyContent: 'center', color: 'white', textShadow: '0 0 5px gold'}}>My Profile</h1>}
            {currentUserId !== otherUserId && <h1 style={{backgroundColor: '#80aaff', marginBottom: '-20px', display: 'flex', justifyContent: 'center', color: 'white', textShadow: '0 0 5px gold'}}>{otherUser.username}'s Profile</h1>}
            <div style={{backgroundColor: '#80aaff', height: '100%', width: '100%', display: 'flex', justifyContent: 'center'}}>
            {/* BONUS: left sidebar with all the users the other user is following. COMPLETE MONDAY */}
            {/* buttons with: */}
                {/* username */}
                {/* user_image_url */}
                {/* link to profiles/:currentUserId/:otherUserId */}
                <div style={{backgroundColor: 'white', width: '140px', marginRight: '50px', marginTop: '20px', borderRadius: '15px', border: '2px solid black', height: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    {/* left side bar */}
                    <p style={{color: 'blue'}}>Following</p>
                    {allUserTheSelectedUserIsFollowing.map((user) => (
                        <div key={user.Id}>
                            <button style={{display: 'flex', backgroundColor: 'white', border: 'white', alignItems: 'center', flexDirection: 'column'}} onClick={() => toTweeterProfile(user._id)}>
                                <img style={{height: '40px', width: '40px', border: '2px solid blue', borderRadius: '50px', marginRight: '10px'}} src={user.user_image_url}/>
                                <p style={{color: 'blue', fontSize: '20px'}}>{user.username}</p>
                            </button>
                        </div>
                    ))}
                </div>
        {/* middle: */}
                <div style={{width: '540px', marginRight: '50px', marginTop: '20px', borderRadius: '15px', display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            {/* all_tweets and retweets by the selected user */}
            {allTweetsAndRetweetsByTheSelectedUserSortedByNewest.map((tweet) =>(
                            <div style={{backgroundColor: 'white', marginBottom: '30px', padding: '20px', borderRadius: '20px'}} key={tweet._id} onMouseOver={() => hoverOverTweetToEdit(tweet)}> {/*The tweet*/}
                                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '-20px'}}> {/*top row */}
                                    <button style={{display: 'flex', backgroundColor: 'white', border: 'white', alignItems: 'center'}} onClick={() => toTweeterProfile(tweet.user_id)}>
                                        <img style={{height: '40px', width: '40px', border: '2px solid blue', borderRadius: '50px', marginRight: '10px'}} src={tweet.user_image_url}/>
                                        <p style={{color: 'blue', fontSize: '30px'}}>{tweet.username}</p>
                                    </button>
                                    <button style={{height: '30px', borderRadius: '30px', marginTop: '20px', marginLeft: '20px', color: 'blue'}} onClick={() => toTweet(tweet._id)}>View Tweet</button>
                                </div>
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
                                            <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_four}  onClick={() => openImage(tweet.image_url_four)}/>
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
                                            <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_three} onClick={() => openImage(tweet.image_url_three)}/>
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
                                                <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_one}  onClick={() => openImage(tweet.image_url_one)}/>
                                                <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_three} onClick={() => openImage(tweet.image_url_three)}/>
                                            </div>
                                            <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_four} onClick={() => openImage(tweet.image_url_four)}/>
                                        </div>
                                    )}
                                    {!tweet.image_url_one && tweet.image_url_two && tweet.image_url_three && tweet.image_url_four && (
                                        <div>
                                            <div style={{display: 'flex', alignContent: 'top'}}>
                                                <img style={{width: '200px', objectFit: 'cover'}} src={tweet.image_url_two} onClick={() => openImage(tweet.image_url_one)}/>
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
                                    {/* BONUS: tweet images,
                                        display one image /
                                        display 2 images side by side /
                                        display 3 or 4 images in a grid /
                                        each image has a popup that onclick closes the popup */}
                                </div>
                                {isImagePopupOpen && <div style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', border: '2px solid black', borderRadius: '20px', zIndex: '1000', width: '540px'}} onClick={() => closeImage()}>
                                    <img style={{width: '500px'}} src={imageURL}/>
                                </div>}
                                <p>{tweet.text_content}</p>
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
                                        <button style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'blue', backgroundColor: 'white', border: '0px'}} onClick={() => openCommentPopup() }>
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
                                        <button style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'blue', backgroundColor: 'white', border: '0px'}} onClick={() => openCommentPopup() }>
                                            <img style={{height: "50px"}} src="https://www.freeiconspng.com/thumbs/comment-png/comment-png-0.png"/>
                                            <p>{tweet.comments_count} Comments</p>
                                        </button>
                                    </div>
                                }
                            </div>
                        ))}
                {/* tweeter user info with link to that user */}
                {/* link to that tweet */}
                {/* images */}
                {/* text_content */}
                {/* BONUS: if tweet is not by current user: */}
                    {/* likes button with likes count */}
                    {/* dislikes button with dislikes count */}
                    {/* retweets button with retweets count */}
                {/* Else: display the counts, just not in buttons */}
            {/* BONUS: comments count with comments button popup with validations COMPLETE MONDAY */}
            {/* BONUS: all_comments_for_this_tweet */}
                {/* comment user info and link to their profile */}
                {/* comment images */}
                {/* comment text */}
                </div>
                {/* right side bar: */}
                <div style={{color: 'blue', backgroundColor: 'white', width: '140px', height: '400px', display: 'flex', marginTop: '20px', borderRadius: '15px', border: '2px solid black', flexDirection: 'column', alignItems: 'center'}}>
                {/* logout button */}
                    <button style={{marginBottom: '15px', marginTop: '20px', width: '70px', height: '30px', color:'blue', borderRadius: '15px'}} onClick={() => logout()}>Log Out</button>
                {/* other user's username */}
                {/* other user's image_url if(currenUserId == otherUserId): in gold */}
                    <div style={{backgroundColor: 'white', border: 'white', color: 'blue', fontSize: '20px'}}>
                        {currentUserId == otherUserId &&
                            <img style={{border: '5px solid gold', height: '90px', width: '90px', borderRadius: '50px'}} src={otherUser.user_image_url}/>
                        }
                        {currentUserId !== otherUserId &&
                            <img style={{border: '5px solid blue', height: '90px', width: '90px', borderRadius: '50px'}} src={otherUser.user_image_url}/>
                        }
                    </div>
                    <p style={{fontSize: '20px', marginBottom: '10px'}}>{otherUser.username}</p>
                    <p></p>
            {/* home button */}
                    <button style={{marginBottom: '20px', width: '70px', height: '30px', color: 'blue', borderRadius: '15px', marginTop: '30px'}} onClick={() => toHome()}>Home</button>
            {/* if(currentUserId == otherUserId) new tweet button */}
                    {currentUserId == otherUserId &&
                        <button style={{height: '30px', color: 'blue', borderRadius: '15px'}} onClick={() => toNewTweet()}>New Tweet</button>
                    }
            {/* if(currentUserId !== otherUserId) follow buttton*/}
                    <div> {/*Follow/Unfollow button*/}
                        {currentUserId !== otherUserId && 
                            (amIfollowingTheSelectedUser ? (<button style={{height: '30px', color: 'white', backgroundColor: 'red', borderRadius: '15px'}} onClick={() => followAndUnfollow()}>Unfollow</button>) : (<button style={{height: '30px', color: 'blue', borderRadius: '15px'}} onClick={() => followAndUnfollow()}>Follow</button>))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ViewUserProfile