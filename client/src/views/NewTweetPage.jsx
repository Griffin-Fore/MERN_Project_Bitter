// imports
import React, { useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';

const NewTweetPage = () => {
// states
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const { currentUserId } = useParams() 
    // current user from params
    const [currentUser, setCurrentUser] = useState({})
    // tweet
    const [potentialTweet, setPotentialTweet] = useState({
        user_id: currentUser._id,
        username: currentUser.username,
        user_image_url: currentUser.user_image_url,
        text_content: '',
        image_url_one: '',
        image_url_two: '',
        image_url_three: '',
        image_url_four: '',
        users_that_liked_this_tweet: [],
        likes_count: 0,
        users_that_disliked_this_tweet: [],
        dislikes_count: 0,
        users_that_retweeted_this_tweet: [],
        retweets_count: 0,
        comments_count: 0
    })

    const [potentialTweetErrors, setPotentialTweetErrors] = useState({})
// jsx
    // get current user
    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/${currentUserId}`)
        .then((res) => {
            console.log("NewTweetPage getOneUser res.data: ", res.data)
            setCurrentUser(res.data)
            setPotentialTweet(prevTweet => ({
                ...prevTweet,
                user_id: res.data._id,
                username: res.data.username,
                user_image_url: res.data.user_image_url
            }));
            setLoading(false)
        })
        .catch((err) => {
            console.log("NewTweetPage getOneUser catch err: ", err)
            setLoading(false)
        })
    },[])

    const tweetFormChangeHandler = (e) => {
        setPotentialTweet({...potentialTweet, [e.target.name]:e.target.value})
    }

    // post tweet
    const newTweetFormSubmission = (e) => {
        e.preventDefault()
        
        axios.post('http://localhost:8000/api/tweets', potentialTweet, {withCredentials:true})
            .then((res) => {
                console.log("NewTweetPage newTweetFormSubmission then res.data: ", res.data)
                navigate(`/all_tweets/${currentUserId}`)
            })
            .catch((err) => {
                console.log("NewTweetPage newTweetFormSubmission catch err.repsonse.data.errors: ", err.response.data.errors)
                setPotentialTweetErrors(err.response.data.errors)
            })
    }

    if(loading) {
        return <div>Loading...</div>
    }

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

    const toMyProfile = () => navigate(`/profiles/${currentUser._id}/${currentUser._id}`)

    const toHome = () => navigate(`/all_tweets/${currentUser._id}`)

    return (
        <div style={{backgroundColor: '#80aaff'}}>
            <div style={{backgroundColor: '#80aaff', marginBottom: '-40px', display: 'flex', justifyContent: 'center', color: 'white', textShadow: '0 0 5px gold'}}><h1>New Tweet</h1></div>
        {/* html */}
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{width: '140px', marginRight: '50px'}}></div>
                {/* tweet form with validations */}
                <form style={{backgroundColor: 'white', border: '2px solid black', width: '540px',marginTop: '20px', marginRight: '50px', display: 'flex', flexDirection: 'column', borderRadius: '20px', padding: '20px', paddingLeft: '40px'}} onSubmit={newTweetFormSubmission}>
                    {/* image urls 1-4 */}
                    <h3>Choose up to four images!</h3>
                    <div>
                        <label htmlFor="tweet_image_url_one">First Image URL:&nbsp;&nbsp;</label>
                        <input style={{width: '200px', margin: '10px'}} id="tweet_image_url_one" type="text" name="image_url_one" value={potentialTweet.image_url_one || ''} onChange={tweetFormChangeHandler}/>
                    </div>
                    <div>
                        <label htmlFor="tweet_image_url_two">Second Image URL:</label>
                        <input style={{width: '200px', margin: '10px'}} id="tweet_image_url_two" type="text" name="image_url_two" value={potentialTweet.image_url_two || ''} onChange={tweetFormChangeHandler}/>
                    </div>
                    <div>
                        <label htmlFor="tweet_image_url_three">Third Image URL:</label>
                        <input style={{width: '200px', margin: '10px'}} id="tweet_image_url_three" type="text" name="image_url_three" value={potentialTweet.image_url_three || ''} onChange={tweetFormChangeHandler}/>
                    </div>
                    <div>
                        <label htmlFor="tweet_image_url_four">Fourth Image URL:</label>
                        <input style={{width: '200px', margin: '10px'}} id="tweet_image_url_four" type="text" name="image_url_four" value={potentialTweet.image_url_four || ''} onChange={tweetFormChangeHandler}/>
                    </div>                                        
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <label htmlFor="tweet_text">Write something up to 1000 characters!</label>
                        <textarea rows={5} style={{width: '200px', margin: '10px'}} id="tweet_text" type="text" name="text_content" value={potentialTweet.text_content || ''} onChange={tweetFormChangeHandler}/>
                    </div>
                    {potentialTweetErrors && <p style={{color: "red"}}>{potentialTweetErrors.text_content?.message}</p>}

                    <button  style={{width: '200px', height: '40px', borderRadius: '20px', fontSize: '20px', marginBottom: '20px', marginTop: '-10px', marginLeft: 'auto', marginRight: 'auto', color: 'blue'}}>Post Tweet!</button>
                </form>
                {/* logout, current user profile link on the right */}
                <div style={{backgroundColor: 'white', width: '140px', display: 'flex', marginTop: '20px', borderRadius: '15px', border: '2px solid black', flexDirection: 'column', justifyContent: 'center'}}>
                    <button style={{marginRight: 'auto', marginLeft: 'auto', marginTop: '-40px', marginBottom: '15px', width: '70px', height: '30px', color: 'blue', borderRadius: '15px'}} onClick={() => logout()}>Log Out</button>
                    <button  style={{backgroundColor: 'white', border: 'white', color: 'blue', fontSize: '20px' }} onClick={() => toMyProfile()}>
                        <img style={{border: '5px solid gold', height: '90px', width: '90px', borderRadius: '50px', color: 'blue'}} src={currentUser.user_image_url}/>
                        <p>{currentUser.username}</p>
                        <p>View Profile</p>
                    </button>
                    <button style={{marginRight: 'auto', marginLeft: 'auto', marginTop: '10px', marginBottom: '20px', width: '70px', height: '30px', color: 'blue', border: '2px solid black', borderRadius: '15px'}} onClick={() => toHome()}>Home</button>
                </div>
            </div>
        </div>
    )
}

export default NewTweetPage