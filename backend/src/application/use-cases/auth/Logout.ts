const express = require('express');
import { RequestHandler } from 'express';


export const Logout: RequestHandler = async (req, res, next) => {
    
  // Clear the 'token' cookie by setting an expired value
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0, // Expire the cookie immediately
  });

  res.json({ success: true, message: 'Logged out successfully' });
};

