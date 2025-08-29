import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const wbConfSchema = z.object({
   
  WB_API_URL: z.string().url(),
  WB_API_TOKEN: z.string(),
  
});

const wbConf = wbConfSchema.parse({
    
    WB_API_URL: process.env.WB_API_URL,
    WB_API_TOKEN: process.env.WB_API_TOKEN,

});

export default wbConf;
