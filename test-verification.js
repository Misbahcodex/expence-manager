// quick import trick for fetch in Node
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function verifyFlowTest() {
  console.log(" Running email verification flow...\n");

  try {
    // --- SIGNUP ---
    const email = `test${Date.now()}@example.com`;
    console.log(`[1] Signup: ${email}`);

    const signupRes = await fetch("http://localhost:4000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "testuser",
        email,
        password: "password123",
      }),
    });

    const signupData = await signupRes.json();
    console.log("Signup says:", signupData);

    if (!signupRes.ok || !signupData.verificationUrl) {
      console.log(" Signup failed");
      return;
    }
    console.log(" Signup worked");

    // --- VERIFY EMAIL ---
    const token = signupData.verificationUrl.split("token=")[1];
    console.log("\n[2] Verifying email with token:", token);

    const verifyRes = await fetch("http://localhost:4000/api/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const verifyData = await verifyRes.json();
    console.log("Verify says:", verifyData);

    if (!verifyRes.ok) {
      console.log(" Email verification failed");
      return;
    }
    console.log(" Email verified");

    // --- LOGIN ---
    console.log("\n[3] Logging in...");
    const loginRes = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: "password123" }),
    });

    const loginData = await loginRes.json();
    console.log("Login says:", loginData);

    if (loginRes.ok) {
      console.log(" Login successful — flow works!");
    } else {
      console.log(" Login failed");
    }
  } catch (err) {
    console.error(" Test crashed:", err);
  }

  console.log("\n Check backend logs for full details.");
}

verifyFlowTest();
