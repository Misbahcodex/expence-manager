// quick import trick for fetch in Node
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function runAuthTests() {
  console.log(" Starting quick auth checks...\n");

  try {
    // --- SIGNUP ---
    console.log("[1] Signup test...");
    const signupRes = await fetch("http://localhost:4000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      }),
    });
    const signupData = await signupRes.json();
    console.log("Signup says:", signupData);

    if (!signupRes.ok) {
      console.log(" Signup failed:", signupData.error || signupData);
      return;
    }
    console.log(" Signup worked");

    // --- LOGIN BEFORE VERIFY ---
    console.log("\n[2] Login (should fail, email not verified)...");
    const loginRes = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });
    const loginData = await loginRes.json();
    console.log("Login says:", loginData);
    if (!loginRes.ok) {
      console.log(" Login blocked as expected (unverified email)");
    }

    // --- FORGOT PASSWORD ---
    console.log("\n[3] Forgot password...");
    const forgotRes = await fetch("http://localhost:4000/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });
    const forgotData = await forgotRes.json();
    console.log("Forgot password says:", forgotData);

    if (forgotRes.ok)
      console.log(" Reset link email should be logged in backend.");
  } catch (err) {
    console.error(" Test run failed:", err);
  }

  console.log("\n💡 Check backend logs for any verification links / emails.\n");
}

runAuthTests();
