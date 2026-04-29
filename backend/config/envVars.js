import dotenv from "dotenv";

dotenv.config(); 

export const ENV_VARS = {
    OSR_API_KEY: process.env.NEXT_PUBLIC_OSR_API_KEY,
}

console.log("API KEY:", process.env.OSR_API_KEY);