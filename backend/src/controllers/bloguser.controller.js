import express from 'express';
import BlogUser from '../models/bloguser.model';

export const signUpUser = async (request, response) => {
    try {
        const user = request.body;
        const newUser = new BlogUser(user);
        await newUser.save();

        return response.status(200).json({msg: `User signed up successfully`});
    }
    catch (error) {
        return response.status(500).json({msg: `Error: ${error}`});
    }
}