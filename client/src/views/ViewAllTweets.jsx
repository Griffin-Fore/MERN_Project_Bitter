import React, { useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';

const ViewAllTweets = () => {
    const navigate = useNavigate();
    const { currentUserId } = useParams();
    // current_user /
    const [currentUser, setCurrentUser ] = useState({})
    // BONUS: all users postman and put in state
    // filter all users based on users im following
    const [allUsersImFollowing, setAllUsersImFollowing ] = useState([])
    // get all tweets from postman and put in state
    // all tweets, ordered by most recent
    const [allTweetsSortedByNewest, setAllTweetsSortedByNewest] = useState([])

    const [isTweetEditPopupOpen, setIsTweetEditPopupOpen] = useState(false)
    const[imageURL, setImageURL] = useState("")
    const [isImagePopupOpen, setIsImagePopupOpen] = useState(false)

    const [tweetToEdit, setTweetToEdit] = useState({}) // for liking, disliking and retweeting

    const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false)
    const [pendingComment, setPendingComment] = useState({})
    const [pendingCommentErrors, setPendingCommentErrors ] = useState()

    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/${currentUserId}`)
        .then((res) => {
            console.log("ViewAllTweets getOneUser res.data: ", res.data)
            setCurrentUser(res.data)
        })
        .catch((err) => {
            console.log("ViewAllTweets getOneUser catch err: ", err)
        })
    }, [])

    useEffect(() => {
        axios.get('http://localhost:8000/api/users')
        .then((res) => {
            console.log("ViewAllTweets getAllUsers then res.data: ", res.data)
            const allUsers = res.data
            if(currentUser && currentUser.users_im_following) {
                const all_users_im_following = allUsers.filter(user => currentUser.users_im_following.includes(user._id))
                console.log("all users the current user is following: ", all_users_im_following)
                setAllUsersImFollowing(all_users_im_following)
            }
        })
        .catch((err) => {
            console.log("ViewAllTweets getAllUsers catch err: ", err)
        },[])
    }, [currentUser])
    
    const fetchTweets =  async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/tweets')
            console.log("ViewAllTweets getAllTweets then res.data: ", response.data)
            const tweetsSortedByNewest = response.data.sort((a, b) => {
                const dateA = new Date(a.createdAt)
                const dateB = new Date(b.createdAt)
                return dateB - dateA
            })
            setAllTweetsSortedByNewest(tweetsSortedByNewest)
        }
        catch (err) {
            console.log("ViewAllTweets getAllTweets catch err: ", err)
        }
    }

    useEffect(() => {
        fetchTweets();
    }, []);

    // BONUS: Image Popup feature
    const openImage = (image_url) => {
        setImageURL(image_url)
        setIsImagePopupOpen(true)
    }

    const closeImage = () => {
        setIsImagePopupOpen(false)
    }

    // fetch the one tweet
    const hoverOverTweetToEdit = (tweet) => {
        setTweetToEdit(tweet)
        console.log("Tweet to edit: ", tweet)
    }
    // BONUS: like feature
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
    // BONUS: dislike feature
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
    // BONUS: retweet feature
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
    // BONUS: comments feature popup redirects to view_tweet
    // const openCommentPopup = () => {
    //     setIsCommentPopupOpen(true)
    // }

    // const handleCommentStateChange = (e) => {
    //     setPendingComment({...pendingComment, [e.target.name]:e.target.value})
    // }

    // const submitComment = (tweetToEdit, currentUser) => {
           // post request pendingComment with tweetToEdit info and currentUser info,
        //    setComment res.data
        // push to the comment_IDs of the tweetToEdit the comment._id
        // set the comments_count to tweetToEdit.comment_IDs.length
        // patch the tweet at tweetToEdit._id witth tweetToEdit
    // }

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
    // toUserProfile
    const toMyProfile = () => navigate(`/profiles/${currentUserId}/${currentUserId}`)

    const toNewTweet = () => navigate(`/new_tweet/${currentUserId}`)

    const toTweeterProfile = (userId) => navigate(`/profiles/${currentUserId}/${userId}`)

    const toTweet = (tweetId) => navigate(`/view_tweet/${currentUserId}/${tweetId}`)

    return (
        // left column
            // users im following side-bar:
                // users image
                // users name
                // both link to that user's profile
        // middle column
            // all tweets with 
                // user image and name and link to user profile /
                // like button
                // dislike button
                // retweet button
                // comments count
                // view tweet button /
        // right columns
            // logout button /
            // my profile with image and name and link to my profile /
            //  new tweet link button /
        <div style={{fontFamily: 'arial'}}>
            <h1 style={{backgroundColor: '#80aaff', marginBottom: '-20px', display: 'flex', justifyContent: 'center', color: 'white', textShadow: '0 0 5px gold'}}>BITTER HOME</h1>
            <div style={{backgroundColor: '#80aaff', height: '100%', width: '100%', display: 'flex', justifyContent: 'center'}}>
                <div style={{backgroundColor: 'white', width: '140px', marginRight: '50px', marginTop: '20px', borderRadius: '15px', border: '2px solid black', height: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    {/* left side bar */}
                    <p style={{color: 'blue'}}>Following</p>
                    {allUsersImFollowing.map((user) => (
                        <div key={user.Id}>
                            <button style={{display: 'flex', backgroundColor: 'white', border: 'white', alignItems: 'center', flexDirection: 'column'}} onClick={() => toTweeterProfile(user._id)}>
                                <img style={{height: '40px', width: '40px', border: '2px solid blue', borderRadius: '50px', marginRight: '10px'}} src={user.user_image_url}/>
                                <p style={{color: 'blue', fontSize: '20px'}}>{user.username}</p>
                            </button>
                        </div>
                    ))}
                </div>
                <div style={{width: '540px', marginRight: '50px', marginTop: '20px', borderRadius: '15px', display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                    {/* all tweets go here with:
                        // user image and name and link to user profile /
                        // like button
                        // dislike button
                        // retweet button
                        // comments count
                        // view tweet button /*/} 
                        {allTweetsSortedByNewest.map((tweet) =>(
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
                                        <button style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'blue', backgroundColor: 'white', border: '0px'}} onClick={() => openCommentPopup() }>
                                            <img style={{height: "50px"}} src="https://www.freeiconspng.com/thumbs/comment-png/comment-png-0.png"/>
                                            <p>{tweet.comments_count} Comments</p>
                                        </button>
                                    </div>
                                }
                            </div>
                        ))}
                </div>
                {/* tweet comment popup window with form with validations*/}
                <div style={{backgroundColor: 'white', width: '140px', height: '400px', display: 'flex', marginTop: '20px', borderRadius: '15px', border: '2px solid black', flexDirection: 'column', justifyContent: 'center'}}>
                    <button style={{marginRight: 'auto', marginLeft: 'auto', marginTop: '-30px', marginBottom: '15px', width: '70px', height: '30px', color:'blue', borderRadius: '15px'}} onClick={() => logout()}>Log Out</button>
                    <button  style={{backgroundColor: 'white', border: 'white', color: 'blue', fontSize: '20px' }} onClick={() => toMyProfile()}>
                        <img style={{border: '5px solid gold', height: '90px', width: '90px', borderRadius: '50px', color: 'blue'}} src={currentUser.user_image_url}/>
                        <p style={{}}>{currentUser.username}</p>
                        <p>View Profile</p>
                    </button>
                    <button style={{width: '100px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '30px', height: '40px', borderRadius: '20px', color: 'blue'}} onClick={() => toNewTweet()}>New Tweet</button>
                </div>
            </div>
        </div>
    )
}

export default ViewAllTweets