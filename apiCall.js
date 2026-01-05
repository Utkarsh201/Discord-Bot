import axios from "axios";
import dotenv from "dotenv"
dotenv.config();
// making an api to CLIST using axios

export async function getContest() {
    
    const currentTime = new Date();
    const oneHourLater = new Date(currentTime.getTime() + 60*60*1000);

    const params = {
      username: process.env.CLIST_USERNAME,
      api_key: process.env.CLIST_API_KEY,
      start__gt: now.toISOString(),
      start__lt: oneHourLater.toISOString(),
      //   toISOString() converts a Date object into a standardized string format called ISO 8601, always expressed in UTC time.
      order_by: "start",
      resource__name__in: "codeforces,leetcode,codechef,atcoder",
    };

    const response = await axios.get(
        "https://clist.by/api/v2/contest/",
        {params}
    );

    return response.data.object;
}