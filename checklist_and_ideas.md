B I T T E R

Presentation:
    Register without picture 
    Register with picture 
    Login 
    Like, dislike and retweet on the main page 
    View my profile  
    unretweet a tweet 
    Create a tweet 
    Visit one of my tweets 
    Edit one of my tweets 
    Delete one of my tweets 
    Create a new tweet 
    Comment on one of my tweets with images 
    edit my comment 
    delete my comment 
    View someone else's profile 
    retweet, like and dislike one of their tweets 
    View one of their tweets 
    comment on the tweet with images 
    Visit one of someone else's tweets I retweeted 
    Like dislike and retweet 
    comment with images 
    Login as someone else 
    Post a comment 
    Edit a comment 
    Delete a comment
    Like and dislike someone else's comment 
    Follow someone 
    View my Following Feed
    View someone else's following feed

Checklist: 
Link to following feed in main page /
Link to following feed in user page /
Comments show newest first
Current user has a gold border in main page tweets /
Current user has a gold border in user page tweets /
Current user has a gold border in feed tweets /

Checklist of features:
Pages:
    RegisterAndLogin COMPLETE
    ViewAllTweets
        BONUS: Sidebar: users_im_following /
            username /
            user_image /
            both function as links to profiles/currentUserId/:other_user_id /
        Middle: all_tweets:
            button with: /
                username /
                user_image /
                link to profiles/:currentUserId/:other_user_id /
            links to view_tweet/:currentUserId/:tweet._id /
            BONUS: images display /
            BONUS: images display advanced grid /
            BONUS: image popup that disappears when clicked again /
            BONUS: like button with likes count /
            BONUS: dislike button with dislikes count /
            BONUS: retweet button with retweets count /
            BONUS: comment button with comment count that redirects to the tweet COMPLETE MONDAY
        Right sidebar: /
            logout /
            button with:
                current username /
                current user image /
                current user id /
                links to profiles/:currentUserId/:other_user_id /
            button that links to /new_tweet/:userid /
            button that links to my feed my_feed/:currentUserId/:otherUserId /

    Create accounts: /
    2 tweets each /
    Alpha afore@gmail.com https://www.publicdomainpictures.net/pictures/170000/velka/wolf-gesicht.jpg
    Bravo bfore@gmail.com https://www.clipartkey.com/mpngs/m/213-2139514_battlefield-3-soldier-png.png
    Charlie cfore@gmail.com https://upload.wikimedia.org/wikipedia/commons/9/9b/US_Flag_Backlit.jpg
    Echo efore@gmail.com https://i.insider.com/5502e4016bb3f79e4aa86ea1
    Foxtrot ffore@gmail.com https://www.reddit.com/media?url=https%3A%2F%2Fi.redd.it%2F9vy19m3z2g421.png
    Golf goforth@gmail.com https://www.reddit.com/media?url=https%3A%2F%2Fi.redd.it%2F9vy19m3z2g421.png
    Hotel hfore@gmail.com https://1.bp.blogspot.com/-3aAjklKMDkk/UcJgdN-MKyI/AAAAAAAAE6Q/FQuvZYSqF3g/s1600/P1070193.JPG
    India ifore@gmail.com https://3.bp.blogspot.com/_apTf63ffIlg/SwDIEzsxDvI/AAAAAAAAAvk/LwMMUvlXAAE/s1600/AGR+Agra+-+Taj+Mahal+panorama+with+watercourse+and+indian+visitors+after+sunrise+3008x2000.jpg
    Lima lfore@gmail.com https://images.alphacoders.com/444/444120.jpg
    Mike mfore@gmail.com mhttps://ae01.alicdn.com/kf/HTB1n0KeLpXXXXbTXXXXq6xXFXXX9/Best-Choice-EU-Plug-Handheld-Microphone-Dual-Professional-Wireless-Microphone-System-Cordless-Microphone-Mic-Kareoke-KTV.jpg
    November nfore@gmail.com https://www.findingsoutlet.com/wp-content/uploads/2019/10/1-44.jpg
    Oscar ofore@gmail.com https://wallpaperaccess.com/full/7095716.jpg

    a https://pngimg.com/uploads/pokemon/pokemon_PNG148.png
    b https://pngimg.com/uploads/pokemon/pokemon_PNG11.png
    c https://img1.wikia.nocookie.net/__cb20120603213349/sonicpokemon/images/7/77/Pikachu.png
    d https://www.cartoonbucket.com/wp-content/uploads/2015/05/Pikachu-Running-Picture.png

    BONUS: tweet images:
        a display one /
        b display one /
        c display one /
        d display one /
        ab display side-by-side /
        ac display side-by-side /
        ad display side-by-side /
        bc display side-by-side /
        bd display side-by-side /
        cd display side-by-side /
        abc display ab side-by-side, c bottom left /
        abd display ab, d bottom left /
        acd display ac, d bottom left /
        bcd display bc side-by-side, d bottom left /
        abcd display ab side-by-side, cd side-by-side /

    NewTweet COMPLETE new_tweet/:currentUserId
        right side: 
            logout /
            home /
            current user profile /
        form with:
            BONUS: inputs for image urls /
            text /
    
    ViewOneUser view_one_user/:currentUserId/:otherUserId COMPLETE SUNDAY (CURRENT PLACE)
        BONUS: left sidebar with all the users the other user is following. COMPLETE MONDAY
            buttons with:
                username
                user_image_url
                link to profiles/:user_id
        middle: /
            all_tweets and retweets by the selected user /
                tweeter user info with link to that user /
                link to that tweet /
                images /
                text_content /
                BONUS: if tweet is not by current user: /
                    likes button with likes count /
                    dislikes button with dislikes count /
                    retweets button with retweets count /
                Else: display the counts, just not in buttons /
            BONUS: comments count with comments button popup with validations COMPLETE MONDAY
            BONUS: all_comments_for_this_tweet
                comment user info and link to their profile
                comment images
                comment text
        right side bar: /
            logout button /
            other user's username /
            other user's image_url if(currenUserId == otherUserId): in gold /
            home button /
            if(currentUserId == otherUserId) new tweet button /
            if(currentUserId !== otherUserId) follow buttton /

    ViewOneTweet view_one_tweet/:currentUserId/:tweet_id COMPLETE MONDAY
        Right side bar:
            logout /
            home /
            current user's info /
            link to /profiles/:current_userId/:otheruser'sId /
            tweet /
        the tweet:
            button with:
                poster's username /
                poster's user image /
                link to profiles/:user_id /
            if tweet is by current user:
                popup edit window button with validations /
                delete button /
            tweet image urls in grid /
            tweet text_content /
            BONUS: if tweet's user_id !== current user's id
                like button with likes count /
                dislike button with dislikes count /
                retweet button with retweets count /
            BONUS: comments count with comments button popup with validations COMPLETE MONDAY
        BONUS: all_comments_for_this_tweet
            comment user info and link to their profile
            comment inmages
            comment text

    BONUS: Feed from followed users following_feed:/currentUserId/:otherUserId COMPLETE MONDAY
        Followed users otherUserId is following on the left
            Username
            User image
            Link to user profile
        All tweets and retweets by followed users
            Button with link to user profile
            View Tweet button
            Tweet images
            Tweet text
            If not post by current user
                Like button
                Dislike Button
                Retweet button
            Likes count
            Dislikes count
            Retweets count
            BONUS: comments count with comments button popup with validations COMPLETE MONDAY
        BONUS: all_comments_for_this_tweet
            comment user info and link to their profile
            comment inmages
            comment text

        Right side bar:
            logout button
            other user's username
            other user's image_url
            home button
            if(currentUserId == otherUserId) new tweet button
            if(currentUserId !== otherUserId) follow button

Steps:
    Create the basic project
    Create the models
    Create the controllers
    Create the routes
    Get the login and registration working /
    Create the required pages and put the outline into the pages
        What imports do you need
        what props do you need
        What states do you need
        What js do you need:
            functions
            postman requets
        What HTML do you need

    Complete the functionality of one page at a time, before moving onto the next
        Complete the required pages and functionality first
        Create placeholders in the js and html for the bonuses
        Once the required functionality is done, complete the css

    Create the bonus pages and put the outline into the pages:
        What imports do you need
        What props do you need
        What states do you need
        What js do you need:
            functions
            postman requests

    Complete the bonus pages one at a time
    Complete the css for each page once done

Models:
    User model:
        _id string
        username string /
        user_image_url string /
        password string /
        users_im_following array [String] (user_id) /

    Tweet Model:
        _id String /
        user_id string /
        username string /
        user_image_url string /
        text_content string /
        bonus: image_urls 1-4 array [String] (user_id) /
        bonus: users_that_liked array [String] (user_id) /
        bonus: users_that_disliked array [String] (user_id) /
        bonus: likes_count integer /
        bonus: dislikes_count integer /
        bonus: users_that_retweeted array [String] (user_id) /
        bonus: retweet_count integer /
        bonus: comment_ids array [String] (user_id)
        bonus: comments_count integer

    Bonus: Comment model:
        _id String
        parent_comment_id string
        user_id string
        username string
        user_image_url string
        tweet_id string
        text_content string
        bonus: image_urls 1-4
        comment likes count
        comment userswholikedthiscomment array
        comment dislikes count
        comment userswhodilikedthiscomment array

Routes:
    User controller/routes:
        .get getaLLUsers /
        .post createUser /
        .get(id) findUserById /
        .patch(id) editUser
        .delete(id) deleteUser /

    Tweet controller/routes:
        .post createTweet /
        .get getAllTweets /
        .get(id) findTweetById /
        .patch(id) updateTweet /
        .delete(id) deleteTweetById /

    Bonus: Comment controller/routes:
        .post createComment
        .get getAllComments
        .get(id) findCommentById
        .patch(id) updateComment
        .delete(id) deleteCommentById

App.jsx: current_user, setCurrentUser =  ({})

Pages:
    Required: Login and Registration Page "/" (Reg_And_Login_Page) /
    JSX:
        Create user post postman, if a user_image is not provided one will be provided for you, 
            redirects to home feed, has errors
        Login user post postman url, sets the user in state, redirects to home feed, has errors
    HTML:
        Create user form with validations
        Login user from with validations

    Required: All tweets page view_all_tweets "/home"
        JSX:
            get current_user from props /
            get getAllUsers url postman /
            set all_users in state /
            get getAllTweets url postman /
            set all_tweets in state /
            const followed_users = all_users.filter(user => currentUser.following.includes(user._id)); /
            
            selected_tweet states: users_that_liked, users_that_disliked, likes_count, dislikes_count

            Bonus: popup to display one image large:
                close upon clicking the popup window

            Bonus: Like and Dislike Buttons
                So to allow likes to persist across pages and prevent a user from making multiple likes and dislikes, I want to first set in the tweet model two arrays of user_ids: usersthatliked and usersthatdisliked. Then I want to handle an onclick like and dislike buttons, and for the like button, I get request the selected tweet by id, then I set in state the tweet's info, particularly the usersthatliked and  usersthatdisliked, and the likecount and dislikecount. Then, for the like onclick, I want to check if the selectedtweet.usersthatliked.includes current_user._id, and if it does, remove the current_user._id from the usersthatliked state array. Else, I want to push the current_user._id to the usersthatliked state array. Then outside the if block I want to set the state for the likedcount to the usersthatlikedarray.length, and remove from the usersthatdisliked the current_user._id if it exists, and finally, patch the tweet with the updated state values.

            Bonus: Retweet button: toggle
                pass in the id of the tweet,
                get postman request the tweet by id,
                set in state the tweet
                set in state the retweeter_ids
                if(tweet.user_that_retweeted.includes(current_user._id) {
                                    .push the current_user._id to the state retweeter array of user ids:
                const updatedRetweeterIds = [...fetchedTweet.retweeter_ids, currentUser._id]
                })
                else{
                    remove the user from the retweeter arrays state
                }
                set the state of the retweets_count to users_that_retweeted.length
                post postman request with the state tweet information and retweets_count
                reset the tweet state

                sort through all comments and filter by comments that have that tweet_id and pass the length of that array as the comments count? 
        HTML: 
            button my profile: { /
                <img src=`${current_user.user_image}`
                current_user.username
                <Link to=`/profiles/${current_user._id}>
            }
            
            button: new tweet button <Link to="/new_tweet">
            
            Bonus: sidebar for followed_users: foreach loop for followed_users:
                followed_users.forEach(user =>
                    user.username
                    user.user_image
                    <link to=`profiles/${user._id}`> 
                )

            foreach loop for all_tweets:
                all_tweets.forEach((tweet) => {
                    Bonus: foreach tweet.image_urls
                        if (tweet.image_urls && tweet.urls.length > 0) {
                            tweet.image_url.forEach((url) => {
                                if(tweet.image_urls.length == 1){
                                    (display large)<button onclick popupimage(url)><img src="${url}"></button>
                                }
                                else if(tweet.image_urls.length == 2) {
                                    (display side-by-side)
                                }
                                else {
                                    (display grid)
                                }
                            });
                        } else { "" })
                tweet.text
                button with:
                    tweet.username
                    tweet.user_image
                    <Link to=`/profiles/${tweet.user_id}`>
                Bonus: buttons: like and dislike
                Bonus: button: retweet
                Bonus: button: comment <Link to `/view_one_tweet/${tweet._id}`>

    Bonus: Feed from followed users "/following_feed"
        JSX:
            pass the current_user through props
            get postman all_users
            get postman all_tweets
            let followed_users = all_users.filter(user => current_user.following.includes(user._id))
            let tweetsAndRetweetsByUsersImFollowing = all_tweets.filter(tweet => 
                if (followed_users.some(user => user.id == tweet.user_id)) {
                    return true;
                }
                if (tweet.retweeter && tweet.retweeter.some(retweeterId => followed_users.some(user => user._id == retweeterId))) {
                    return true;
                }
            let tweetsAndRetweetsByUsersImFollowingSortedByMostRecent = tweetsAndRetweetsByUsersImFollowing.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) 
            Like and dislike functions
            Retweet function
        HTML:
            followed_users sidebar:
                followed_users.foreach(followed_user => {
                    followed_user._id <Link to=`/profiles/${followed_user._id}`>
                    followed_user.user_image
                    followed_user.username
                })
                    
            tweetsAndRetweetsByUsersImFollowingSortedByMostRecent.foreach(tweet => (
                Button:
                    <Link to=`/profiles/${tweet.user_id}`>
                    tweet.user_image
                    tweet.username

                if (tweet.image_urls && tweet.image_urls.length > 0) {
                    tweet.image_urls.forEach((url) => {
                        <img src="${url}">
                    });
                } else { "" })
                
                tweet.text
                Bonus: buttons: like and dislike
                Bonus: button: retweet
                Bonus: button: comment <Link to `view_one_tweet/${tweet._id}`>
            ))
                    
    Required: My profile (all my tweets) "/profiles/user_id"
        JSX:
            edit User button
            pass the current_user through props
            const myTweetsAndRetweets = all_tweets.filter(tweet =>
                tweet.user_id == current_user._id || tweet.retweets.includes(current_user._id)
            );
            Bonus: like and dislike buttons
        HTML:
            <img src="current_user.user_image">
            current_user.username
            Bonus: edit user button, leads to popup edit form with validations
            button: new tweet link <Link to="/new_tweet>
            myTweetsAndRetweets.forEach(tweet => {
                button with:
                    tweet.username, tweet.user_image, <Link to="`/profiles/${tweet.user_id}`>
                if(tweet.user_id != current_user._id){
                    buttons for like/dislike
                }
                button comments <Link to={`one_tweet/${tweet._id}`}>
            })
                

    Rewquired: New tweet page "/new_tweet"
        JSX:
            pass the current_user through props
            set the states for user_id, username and user_image
            set the empty states for the tweet
            post postman a new tweet
                pass in the states of the user's information
                pass in the states changed by the form
        HTML:
            In side-bar
                <Link to={`/profiles/${current_user._id}`}>
                current_user.user_image
                cuurrent_user.username
            Tweet form with validations:
                Bonus: image_urls
                text

    Required: View one tweet page "/view_one_tweet/tweet_id"
        JSX:
            States:
                pass the current_user from props
                get findTweetById pass id from params
                pass the tweet into state
                get getAllComments
                pass all_comments into state
                allCommentsAboutThisTweet = all_comments.filter(comment => comment.tweet_id == selected_tweet._id)
                tweet states:
                    image_urls
                    text
                comment states: 
                    set comment_user_id = current_user._id
                    set comment_username = current_user.username
                    set comment_user_image = current_user.user_image
                    comment.image_url
                    comment.text
            Bonus: like and dislike functions
            Bonus: retweet function
            
            patch editTweet(tweet_id) {
                image_urls
                text
            }

            delete deleteTweetById(tweet_id){
            }

            Bonnus: create comment:
                post postman createComment:
                    pass in the current user states
                    pass in the comment states
                reset comment states
            
            Bonus: edit comment:
                patch postman editComment(comment_id){
                    pass in comment_image_url
                    pass in comment_text
                }
            
            delete deleteCommentById(comment_id)
        HTML
            side-bar:
                Button:
                    <Link to={`/profiles/${current_user._id}}>
                    current_user.user_image
                    current_user.username
                <Link to="/new_tweet">
            button: 
                tweet.username
                tweet.user_image
                <Link to=`profiles/${tweet.user_id}`>
            if(tweet.user_id != current_user._id){
                like and dislike buttons
                retweet button
            }
            
            if(tweet.user_id == current_user._id) {
                tweet edit button, leads to popup form with validations, image_urls and text, 
                tweet delete button,
            }

            Bonus: comment form window: with validations
                comment image_url
                text

            Bonus: allCommentsAboutThisTweet.foreach(comment =>{
                comment.username
                comment.image
                button Link to=`/profiles/${comment.user_id}`
                foreach comment.media
                comment.text
                if(comment.user_id == current_user._id) {
                    edit_comment(comment._id) popup form with validations
                        comment image_url
                        comment_text
                
            })

    Bonus: Other one user profile (all their tweets) /profile/user_id (OTHER CURRENT PLACE)
        JSX:
            get all_tweets, pass into state
            get findUserById(url param)
            set selected_user into state
            foreach loop for usersTweetsAndRetweets = all_tweets.filter(tweet => tweet.user_id == selected_user._id ||
            tweet.retweets.includes(selected_user._id))
            let usersTweetsAndRetweetsSortedBytMostRecent = usersTweetsAndRetweets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            like and dislike buttons
            retweet button
            Unfollow button:
                get the current user from lifted state
                set the following list in state
                const updatedFollowing = current_user.following.filter(userId => userId !== selected_user._id);
                patch the user with the updated following
        HTML:
            Home button link
            Username and image
            Unfollow button
            forEach usersTweetsAndRetweets
                Username and image link to user's profile
                like and dislike buttons
                Retweet button
                Comment link