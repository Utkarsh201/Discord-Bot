import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function getContest() {
  try {
    const currentTime = new Date();
    const oneHourLater = new Date(
      currentTime.getTime() + 3*24 * 60 * 60 * 1000
    );

    console.log("1. Preparing parameters...");
    const params = {
      start__gt: currentTime.toISOString(),
      start__lt: oneHourLater.toISOString(),
      order_by: "start",
      resource__in: "codeforces.com,leetcode.com,codechef.com,atcoder.jp",
      limit: 5, 
    };

    console.log("2. Sending Request...");
    
    const response = await axios.get("https://clist.by:443/api/v4/contest/", {
      params,
      headers: {
        Authorization: `ApiKey ${process.env.CLIST_USERNAME}:${process.env.CLIST_API_KEY}`,
      },
    });

    console.log(
      "3. Success! Found:",
      response.data.objects.length,
      "contests."
    );

    return response.data.objects;
  } catch (error) {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
    } else {
      console.error("Network/Code Error:", error.message);
    }
  }
}

// import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

// export async function getContest() {
//   const now = new Date();

//   // Get start of week (Monday UTC)
//   const day = now.getUTCDay();
//   const diffToMonday = (day === 0 ? -6 : 1) - day;

//   const weekStart = new Date(now);
//   weekStart.setUTCDate(now.getUTCDate() + diffToMonday);
//   weekStart.setUTCHours(0, 0, 0, 0);

//   // End of week (Sunday UTC)
//   const weekEnd = new Date(weekStart);
//   weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
//   weekEnd.setUTCHours(23, 59, 59, 999);

//   const params = {
//     username: process.env.CLIST_USERNAME,
//     api_key: process.env.CLIST_API_KEY,
//     start__gte: weekStart.toISOString(),
//     start__lte: weekEnd.toISOString(),
//     order_by: "start",
//     resource__in: "codeforces,leetcode,codechef,atcoder",
//   };

//   const response = await axios.get("https://clist.by/api/v2/contest/", {
//     params,
//   });

//   return response.data.objects;
// }
