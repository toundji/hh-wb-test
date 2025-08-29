import googleConf from "#config/env/google.config.js";
import { google } from "googleapis";

const auth = new google.auth.JWT({
  email: googleConf.GOOGLE_CLIENT_EMAIL,
  key: googleConf.GOOGLE_PRIVATE_KEY,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"  ],
});

export const sheets = google.sheets({ version: "v4", auth });
