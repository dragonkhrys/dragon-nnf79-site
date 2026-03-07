export async function onRequestGet(context) {
  const key = "visits_total";
  const kv = context.env.VISIT_COUNTER;

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