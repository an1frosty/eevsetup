const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, max-age=60"
};
function json(data, status=200) {
  return new Response(JSON.stringify(data), { status, headers: { ...cors, "Content-Type": "application/json; charset=utf-8" } });
}
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "GET") return json({ error: "Only GET is supported" }, 405);
    const ccRaw = (url.searchParams.get("cc") || "ru").toLowerCase();
    const cc = ["ru", "kz"].includes(ccRaw) ? ccRaw : "ru";
    try {
      if (url.pathname === "/api/search") {
        const term = (url.searchParams.get("term") || "").trim();
        if (term.length < 2) return json({ items: [] });
        const upstream = new URL("https://store.steampowered.com/api/storesearch/");
        upstream.searchParams.set("term", term);
        upstream.searchParams.set("cc", cc);
        upstream.searchParams.set("l", "russian");
        upstream.searchParams.set("start", "0");
        upstream.searchParams.set("count", "12");
        const response = await fetch(upstream.toString(), { headers: { "User-Agent": "WINSETUP Steam Deals" } });
        if (!response.ok) return json({ error: "Steam search failed", status: response.status }, 502);
        return json(await response.json());
      }
      if (url.pathname === "/api/details") {
        const appid = url.searchParams.get("appid");
        if (!appid || !/^\d+$/.test(appid)) return json({ error: "Invalid appid" }, 400);
        const upstream = new URL("https://store.steampowered.com/api/appdetails/");
        upstream.searchParams.set("appids", appid);
        upstream.searchParams.set("cc", cc);
        upstream.searchParams.set("l", "russian");
        const response = await fetch(upstream.toString(), { headers: { "User-Agent": "WINSETUP Steam Deals" } });
        if (!response.ok) return json({ error: "Steam details failed", status: response.status }, 502);
        const payload = await response.json();
        const entry = payload[appid];
        return json({ success: !!entry?.success, data: entry?.data || null });
      }
      return json({ error: "Not found" }, 404);
    } catch (error) {
      return json({ error: "Upstream request failed", detail: String(error) }, 502);
    }
  }
};
