export async function onRequestGet(context) {
  const kv = context.env.VISIT_COUNTER;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const key = `visits_${year}-${month}-${day}`;

  let count = await kv.get(key);
  count = count ? parseInt(count, 10) : 0;
  count += 1;

  await kv.put(key, String(count));

  return new Response(JSON.stringify({ count }), {
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "no-store"
    }
  });
}