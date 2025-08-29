
import {fetchAndSavePrices} from "#services/wbprices.service.js";
import cron from "node-cron";
import { syncAllSheetsForDay } from '#services/sheets.service.js';


export async function job(){
   const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const hour =  `${String(now.getHours() + 1).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}`;

    console.log(`${today} ${hour} job started...`);
    try{
      await fetchAndSavePrices(today);
      await syncAllSheetsForDay(today); 
      console.log("Hourly job done");
      return true; 
    }catch(error:unknown){
      console.log("Hourly job failled",error);
      return false;
    }
         
    
}

export   function schedulePriceWriten(){
  cron.schedule("0 * * * *", job);
  job();
}

