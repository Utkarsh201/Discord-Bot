export function isAllowedContest(c) {
  const platform = c.resource.name.toLowerCase();
  const title = c.event.toLowerCase();
  
  if (platform === "codechef") {
        if(!title.includes("starters")) return false;
  }
  if (platform === "atcoder") {
        if(!title.includes("beginner contest") && !title.includes("regular contest")) return false;
  }
  return true;
}
