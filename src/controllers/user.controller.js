import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'

const generateAccesssAndRefreshTokens = async(userId) => {
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()


        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

    }catch(error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access Token")
    }
}


const registerUser = asyncHandler( async (req, res) => {

    // get user details from the frontend
    const {email, username, password, role} = req.body
    console.log("FullName = ",username) 

    // validation - not empty
    if(
        [email, username, password, role].some((field)=>
        field?.trim() === "")
    ) // ek bhi field mein true hua too field empty hai
    throw new ApiError(400, "All fields are required")
    
    //check if user already exit : username and email
    const exitedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if(exitedUser) throw new ApiError(409, "User with email or username already exit")

    //create user object - create entry in DB
    const user = await User.create({
        email,
        password,
        username: username.toLowerCase(),
        role,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser) throw new ApiError(500, "Something went wrong while registering the user")
    
        return res.status(201).json(
            new ApiResponse(201, 
                {
                    user: createdUser,  
                    userDetails: { email, username, role }
                }, 
                "User registered successfully"
            )
        );        

})

const loginUser = asyncHandler( async (req, res) => {

    // get data from req.body
    const {email, username, password} = req.body
    console.log("email = ",email)

    // validation - not empty
    if(!username && !email) throw new ApiError(400, "Username or Email is required");

    // find the user
    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user) throw new ApiError(404, "User does not exist");
    
    // check password
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!password) throw new ApiError(404, "Invalid user credentials");

    // refresh and access Token
    const { accessToken, refreshToken } = await generateAccesssAndRefreshTokens(user._id)

    // send tokens in the cookies
    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In successfully"
        )
    )

})

const logoutUser = asyncHandler( async (req, res) => {
    // remove all cookies
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "User logged out"))
    
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccesssAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})


export { registerUser, loginUser, logoutUser, refreshAccessToken }