// imports
import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterAndLogin = () => {
// states
    const navigate = useNavigate()
    const [registrationUser, setRegistrationUser] = useState({
        username: '',
        user_image_url: 'https://www.pinclipart.com/picdir/big/157-1578186_user-profile-default-image-png-clipart.png',
        email: '',
        password: '',
        confirmPassword:'',
        users_im_following: []
    })
    const [registrationErrors, setRegistrationErrors] = useState({})
    
    const [loginUser, setLoginUser] = useState({
        username: '',
        user_image_url: '',
        email: '',
        password: '',
        confirmPassword: '',
        users_im_following: []
    })
    const [loginErrors, setLoginErrors] = useState({})
// jsx
    const registrationChangeHandler = (e) => {
        setRegistrationUser({...registrationUser, [e.target.name]:e.target.value})
    }

    const registrationSubmitHandler = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8000/api/users', registrationUser, {withCredentials:true})
            .then((res) => {
                console.log("registrationHandler then")
                console.log(res)
                navigate(`/all_tweets/${res.data._id}`)
            })
            .catch((err) => {
                console.log("registrationHandler catch error")
                console.log(err)
                console.log("registrationHandler err.response.data.error.errors",err.response.data.error.errors)
                setRegistrationErrors(err.response.data.error.errors);
            })
    }

    const loginChangeHandler = (e) => {
        setLoginUser({...loginUser, [e.target.name]:e.target.value})
    }

    const loginSubmitHandler = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8000/api/login', loginUser, {withCredentials:true})
            .then((res) => {
                console.log("loginSubmitHandler then", res)
                console.log(res.data)
                navigate(`/all_tweets/${res.data._id}`)
            })
            .catch((err) => {
                console.log("loginSubmitHandler catch error")
                console.log(err)
                console.log("loginSubmitHandler err.response.data", err.response.data)
                setLoginErrors(err.response.data)
            })
    }

    return (
        <>
        <div style={{width: '100%', backgroundColor: '#80aaff', height: '50px', display: 'flex', justifyContent: 'center'}}><h1 style={{fontFamily:'Calibri', color: 'gold', fontSize: '60px', textShadow: '0 0 5px Blue'}}>BITTER</h1></div>
        <div style={{backgroundColor: '#80aaff', height: '100vh', display: 'flex', justifyContent: 'center', padding: '5%', margin: 'auto', fontFamily: 'Calibri Light'}}>
            {/* // register form with valiations */}
            <div>
                <form style={{display: 'flex', flexDirection: 'column', width: '400px', backgroundColor: 'white', borderRadius: '20px', borderColor: 'blue'}} onSubmit={registrationSubmitHandler}>
                <h1 style={{marginLeft: 'auto', marginRight: 'auto', color: 'gold', textShadow: '0 0 3px blue'}}>Register</h1>
                    <div style={{ display: 'flex', alignItems: 'left', marginLeft: '30px'}}>
                        <label htmlFor="username">Username:&nbsp;&nbsp;</label>
                        <div>
                            <input id="username" type="text" value={registrationUser.username} name="username" onChange={registrationChangeHandler}/>
                            {registrationErrors && <p style={{color: "red"}}>{registrationErrors.username?.message}</p>}
                        </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'left', marginLeft: '30px'}}>
                        <p style={{marginBottom: '-18px'}}>If you do not have a profile picture,</p>
                        <p style={{marginBottom: '5px'}}>one will be provided for you</p>
                    </div>
                    <div style={{display: 'flex', alignItems: 'left', marginBottom: '20px', marginLeft: '30px'}}>
                    <label htmlFor="user_image_url">Profile Picture URL:&nbsp;&nbsp;</label>
                        <input id="user_image_url" type="text" value={registrationUser.user_image_url} name="user_image_url" onChange={registrationChangeHandler}/>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'left', marginBottom: '20px', marginLeft: '30px'}}>
                        <label htmlFor="registerEmail">Email Address:&nbsp;&nbsp;</label>
                        <div>
                            <input id="registerEmail" type="text" value={registrationUser.email} name="email" onChange={registrationChangeHandler}/>
                            {registrationErrors && <p style={{color: "red"}}>{registrationErrors.email?.message}</p>}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'left', marginBottom: '20px', marginLeft: '30px'}}>
                        <label htmlFor="registerPassword">Password:&nbsp;&nbsp;</label>
                        <div>
                            <input id="registerPassword" type="password" value={registrationUser.password} name="password" onChange={registrationChangeHandler}/>
                            {registrationErrors && <p style={{color: "red"}}>{registrationErrors.password?.message}</p>}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'left', marginBottom: '20px', marginLeft: '30px'}}>
                        <label htmlFor="confirmPassword">Confirm Password:&nbsp;&nbsp;</label>
                        <div>
                            <input id="confirmPassword" type="password" value={registrationUser.confirmPassword} name="confirmPassword" onChange={registrationChangeHandler}/>
                            {registrationErrors && <p style={{color: "red"}}>{registrationErrors.confirmPassword?.message}</p>}
                        </div>
                        
                    </div>
                    <div style={{marginLeft: 'auto', marginRight: 'auto', marginTop: '30px', marginBottom: '30px'}}>
                        <button style={{height: '40px', backgroundColor: 'gold', borderColor: 'blue', borderRadius: '20px'}}>Register Your Account</button>
                    </div>
                </form>
            </div>
            {/* // login form with validations */}
            <div>
                
                <form style={{display: 'flex', flexDirection: 'column', width: '400px', marginLeft: '50px', backgroundColor: 'white', borderRadius: '15px'}} onSubmit={loginSubmitHandler}>
                    <h1 style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: '50px', color: 'gold', textShadow: '0 0 3px blue'}}>Log In</h1>
                    <div style={{ display: 'flex', alignItems: 'left', marginBottom: '20px', marginLeft: '30px'}}>
                        <label htmlFor="loginEmail">Email</label>
                        <div>
                            <input id="loginEmail" type="text" value={loginUser.email} name="email" onChange={loginChangeHandler}/>
                            {loginErrors.email && <p style={{color: "red"}}>{loginErrors.email}</p>}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'left', marginBottom: '20px', marginLeft: '30px'}}>
                        <label htmlFor="loginPassword">Password:</label>
                        <div>
                            <input id="loginPassword" type="password" value={loginUser.password} name="password" onChange={loginChangeHandler}/>
                            {loginErrors.password && <p style={{color: "red"}}>{loginErrors.password}</p>}
                        </div>
                    </div>
                    <div style={{marginLeft: 'auto', marginRight: 'auto', marginTop: '30px', marginBottom: '30px'}}>
                        <button style={{height: '40px', backgroundColor: 'gold', borderColor: 'blue', borderRadius: '20px'}}>Log In</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default RegisterAndLogin