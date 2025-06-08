export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received webhook data:", body);

    // Process the webhook data as needed
    // For example, you can save it to a database or perform some action

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
export async function GET(request: Request) {
  try {
    const body = await request.json();
    console.log("Received webhook data:", body);

    // Process the webhook data as needed
    // For example, you can save it to a database or perform some action

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}