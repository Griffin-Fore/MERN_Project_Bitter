import {BrowserRouter, Routes, Route} from 'react-router-dom'
import RegisterAndLogin from './views/RegisterAndLogin'
import ViewAllTweets from './views/ViewAllTweets'
import NewTweetPage from './views/NewTweetPage'
import ViewOneTweet from './views/ViewOneTweet'
import ViewUserProfile from './views/ViewUserProfile'
import FollowingFeed from './views/FollowingFeed'
import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RegisterAndLogin />} />
          <Route path="/all_tweets/:currentUserId/" element={<ViewAllTweets />} />
          <Route path="/new_tweet/:currentUserId" element={<NewTweetPage />} />
          <Route path="/view_tweet/:currentUserId/:tweetId" element={<ViewOneTweet />} />
          <Route path="/profiles/:currentUserId/:otherUserId" element={<ViewUserProfile />} />
          <Route path="/following_feed/:currentUserId/:otherUserId" element={<FollowingFeed />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
