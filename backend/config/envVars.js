import dotenv from "dotenv";

dotenv.config(); 

export const ENV_VARS = {
    ORS_API_KEY: process.env.ORS_API_KEY,
}
