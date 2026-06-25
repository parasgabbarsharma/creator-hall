async function run() {
  const html = await (await fetch('https://www.instagram.com/one8world/reel/DZ5Wq2BSFMN/', {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    }
  })).text();
  const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
  const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
  console.log("Image:", imageMatch ? imageMatch[1] : null);
  console.log("Title:", titleMatch ? titleMatch[1] : null);
}
run();
