import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// TODO: fix any type parameter
export const createSecretToken = (id: String) => {
    return jwt.sign({ id }, process.env.TOKEN_KEY || "secret_key", {
      expiresIn: 3 * 24 * 60 * 60,
    });
  };