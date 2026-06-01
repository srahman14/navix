import dotenv from "dotenv";

dotenv.config(); 

export const ENV_VARS = {
    ORS_API_KEY: process.env.NEXT_PUBLIC_ORS_API_KEY,
}
