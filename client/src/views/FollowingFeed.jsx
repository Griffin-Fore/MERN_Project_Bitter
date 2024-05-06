import React, {useEffect, useState } from "react"
import axios from 'axios'
import {useNavigate, useParams } from 'react-router-dom';

const FollowingFeed = () => {
    const navigate = useNavigate();

    const {currentUserId, otherUserId} = useParams()

    const [currentUser, setCurrentUser] = useState({})
    const [otherUser, setOtherUser] = useState({})
    const [allUsersTheOtherUserIsFollowing, setAllUsersTheOtherUserIsFollowing] = useState([])
    const [amIfollowingTheSelectedUser, setAmIfollowingTheSelectedUser] = useState()
    const [allTweetsSortedByNewest, setAllTweetsSortedByNewest] = useState([])
    const [imageURL, setImageURL] = useState("")
    const [isImagePopupOpen, setIsImagePopupOpen] = useState(false)
    const [tweetToEdit, setTweetToEdit] = useState({})

    // useEffect get current user, dependency currentUserId, otherUserId
    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/${currentUserId}`)
        .then((res) => {
            console.log("FollowingFeed.jsx getCurrentUser then res.data: ", res.data)
            setCurrentUser(res.data)
            const isFollowing = currentUser.users_im_following.includes(otherUserId)
            setAmIfollowingTheSelectedUser(isFollowing)
        })
        .catch((err) => {
            console.log("FollowginFeed.jsx getCurrentUser catch err: ", err)
        })
    }, [currentUserId, otherUserId])

    // useEffect get all users the other user is following, dependency otherUserId, otherUser
    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/${otherUserId}`)
        .then((res) => {
            console.log("FollowingFeed.jsx getOtherUser then res.data: ", res.data)
            setOtherUser(res.data)
        })
        .catch((err) => {
            console.log("FollowingFeed.jsx getOtherUser catch err: ", err)
        })
    }, [currentUserId, otherUserId, amIfollowingTheSelectedUser])

    // get following feed
    useEffect(() => {
        console.log("FollowingFeed getFollowedAccounts")
        axios.get('http://localhost:8000/api/users')
        .then(res => {
            console.log("FollowingFeed.jsx getFollowedAccounts then res.data: ", res.data)
            const allUsers = res.data
            if(otherUser && otherUser.users_im_following) {
                const all_users_the_other_user_is_following = allUsers.filter(user => otherUser.users_im_following.includes(user._id))
                console.log("FollowingFeed.jsx all_users_the_other_user_is_following: ", all_users_the_other_user_is_following)
                setAllUsersTheOtherUserIsFollowing(all_users_the_other_user_is_following)
            }
        })
    }, [currentUserId,otherUser])

    // fetch tweets
    const fetchTweets = async () => {
        try {
            // for loop filter by if the tweet user id or users that retweeted includes a followed user id
            const response = await axios.get('http://localhost:8000/api/tweets')
            const allTweets = []
            console.log("FollowingFeed.jsx fetchTweets then response.data: ", response.data)
            for (const followedUser of allUsersTheOtherUserIsFollowing) {
                const tweetsAndRetweetsByUser = response.data.filter(tweet => tweet.user_id === followedUser._id || tweet.users_that_retweeted_this_tweet.includes(followedUser._id))
                console.log("FollowingFeed.jsx fetchTweets tweetsAndRetweetsByUser: ", tweetsAndRetweetsByUser)
                allTweets.push(...tweetsAndRetweetsByUser)
            }
            // remove duplicates
            const uniqueTweetIds = new Set();
            const uniqueTweets = allTweets.filter(tweet => {
                if(!uniqueTweetIds.has(tweet._id)) {
                    uniqueTweetIds.add(tweet._id);
                    return true;
                }
                return false;
            })
            console.log("FollowingFeed.jsx fetchTweets allTweets", uniqueTweets)
            const allTweetsAndRetweetsSortedByNewest = uniqueTweets.sort((a, b) => {
                const dateA = new Date(a.createdAt)
                const dateB = new Date(b.createdAt)
                return dateB - dateA
            })
            setAllTweetsSortedByNewest(allTweetsAndRetweetsSortedByNewest)
            console.log("FollowingFeed.jsx fetchTweets allTweetsAndRetweetsSortedByNewest", allTweetsAndRetweetsSortedByNewest)
        }
        catch (err) {
            console.log("FollowingFeed fetchTweets catch err: ", err)
        }
    }

    useEffect(() => {
        fetchTweets();
    }, [currentUserId,otherUserId,allUsersTheOtherUserIsFollowing])

    // openImage popup
    const openImage = (image_url) => {
        setImageURL(image_url)
        console.log(image_url)
        setIsImagePopupOpen(true)
    }

    // closeImage
    const closeImage = () => {
        setIsImagePopupOpen(false)
    }

    // hoverOverTweetToEdit
    const hoverOverTweetToEdit =  (tweet) => {
        setTweetToEdit(tweet)
        console.log("Tweet to edit: ", tweet)
    }

    // likeTweet
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

    // dislikeTweet
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

    // retweetTweet
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

    // toTweeterProfile
    const toTweeterProfile = (userId) => navigate(`/profiles/${currentUserId}/${userId}`)

    // toTweet
    const toTweet = (tweetId) => navigate(`/view_tweet/${currentUserId}/${tweetId}`)

    // toHome
    const toHome = () => navigate(`/all_tweets/${currentUserId}`)

    // toNewTweet
    const toNewTweet = () => navigate(`/new_tweet/${currentUserId}`)

    return (
        <div style={{fontFamily: 'arial'}}>
            {currentUserId == otherUserId && <h1 style={{backgroundColor: '#80aaff', marginBottom: '-20px', display: 'flex', justifyContent: 'center', color: 'white', textShadow: '0 0 5px gold'}}>My Feed</h1>}
            {currentUserId !== otherUserId && <h1 style={{backgroundColor: '#80aaff', marginBottom: '-20px', display: 'flex', justifyContent: 'center', color: 'white', textShadow: '0 0 5px gold'}}>{otherUser.username}'s Feed</h1>}
            <div style={{backgroundColor: '#80aaff', height: '100%', width: '100%', display: 'flex', justifyContent: 'center'}}>
                {/* left side column */}
                <div style={{backgroundColor: 'white', width: '140px', marginRight: '50px', marginTop: '20px', borderRadius: '15px', border: '2px solid black', height: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <p style={{color: 'blue'}}>Following</p>
                    {allUsersTheOtherUserIsFollowing.map((user) => (
                        <div key={user.Id}>
                            <button style={{display: 'flex', backgroundColor: 'white', border: 'white', alignItmes: 'center', flexDirection: 'column'}} onClick={() => toTweeterProfile(user._id)}>
                                <img style={{height: '40px', width: '40px', border: '2px solid blue', borderRadius: '50px', marginRight: '10px'}} src={user.user_image_url}/>
                                <p style={{color: 'blue', fontSize: '20px'}}>{user.username}</p>
                            </button>
                        </div>
                    ))}
                </div>
                {/* middle column containing tweets */}
                <div style={{width: '540px', marginRight: '50px', marginTop: '20px', borderRadius: '15px', display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                {allTweetsSortedByNewest.map((tweet) =>(
                            <div style={{backgroundColor: 'white', marginBottom: '30px', padding: '20px', borderRadius: '20px'}} key={tweet._id} onMouseOver={() => hoverOverTweetToEdit(tweet)}> {/*The tweet*/}
                                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '-20px'}}> {/*top row */}
                                    <button style={{display: 'flex', backgroundColor: 'white', border: 'white', alignItems: 'center'}} onClick={() => toTweeterProfile(tweet.user_id)}>
                                        {currentUserId == tweet.user_id ? <img style={{height: '40px', width: '40px', border: '2px solid gold', borderRadius: '50px', marginRight: '10px'}} src={tweet.user_image_url}/> :
                                        <img style={{height: '40px', width: '40px', border: '2px solid blue', borderRadius: '50px', marginRight: '10px'}} src={tweet.user_image_url}/>}
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
                </div>
                {/* right side column */}
                <div style={{color: 'blue', backgroundColor: 'white', width: '140px', height: '450px', display: 'flex', marginTop: '20px', borderRadius: '15px', border: '2px solid black', flexDirection: 'column', alignItems: 'center'}}>                
                {/* logout */}
                    <button style={{marginBottom: '15px', marginTop: '20px', width: '70px', height: '30px', color:'blue', borderRadius: '15px'}} onClick={() => logout()}>Log Out</button>
                {/* view profile button*/}
                    <button  style={{backgroundColor: 'white', border: 'white', color: 'blue', fontSize: '20px', marginBottom: '-20px' }} onClick={() => toTweeterProfile(otherUserId)}>
                        {currentUserId == otherUserId &&
                                <img style={{border: '5px solid gold', height: '90px', width: '90px', borderRadius: '50px'}} src={otherUser.user_image_url}/>
                            }
                            {currentUserId !== otherUserId &&
                                <img style={{border: '5px solid blue', height: '90px', width: '90px', borderRadius: '50px'}} src={otherUser.user_image_url}/>
                            }
                            <p>{otherUser.username}</p>
                            <p>View Profile</p>
                    </button>
                {/* CURRENT PLACE */}
                {/* home button */}
                    <button style={{marginBottom: '20px', width: '70px', height: '30px', color: 'blue', borderRadius: '15px', marginTop: '30px'}} onClick={() => toHome()}>Home</button>
                    <button style={{width: '100px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px', height: '30px', borderRadius: '20px', color: 'blue'}} onClick={() => toNewTweet()}>New Tweet</button>
                </div>
            </div>
        </div>
    )
}

export default FollowingFeed