exports.handler = async () => {
  const feeds = [
    { name: "BBC News", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
    { name: "The Hindu", url: "https://www.thehindu.com/news/national/feeder/default.rss" }
  ];
  const decode = s => s.replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/<[^>]*>/g,"").trim();
  try {
    let items = [], source = "";
    for (const feed of feeds) {
      try {
        const res = await fetch(feed.url, { headers: { "User-Agent": "SUMANSMART/4.0" } });
        if (!res.ok) continue;
        const xml = await res.text();
        const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
        const parsed = blocks.slice(0, 8).map(block => {
          const get = tag => { const m = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i")); return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,"$1").trim() : ""; };
          return { title: decode(get("title")), link: get("link").replace(/<!\[CDATA\[|]]>/g,"").trim(), date: decode(get("pubDate")), source: feed.name };
        }).filter(x => x.title && /^https?:\/\//i.test(x.link));
        if (parsed.length) { items = parsed; source = feed.name; break; }
      } catch (_) {}
    }
    return { statusCode: 200, headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=1800" }, body: JSON.stringify({ items, source }) };
  } catch (_) { return { statusCode: 502, body: JSON.stringify({ items: [], error: "News feed unavailable" }) }; }
};
