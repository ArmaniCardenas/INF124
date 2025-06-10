import axios from "axios";
import React, { useState } from "react";
export default axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true, 
});