import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const googleConfSchema = z.object({
 
  // Google Service Account
  GOOGLE_PRIVATE_KEY: z.string().transform((value) => value.replace(/\\n/g, "\n")),
  GOOGLE_CLIENT_EMAIL: z.string().email(),

  // Default sheet for test
  DEFAULT_SPREADSHEETS_ID: z.string(),
});

const googleConf = googleConfSchema.parse({

    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    DEFAULT_SPREADSHEETS_ID: process.env.DEFAULT_SPREADSHEETS_ID,
});

export default googleConf;
