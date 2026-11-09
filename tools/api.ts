// Calls the platform's admin API with a token from the environment, and prints only the answer. The token itself never shows.
// npm run api -- <GET|PATCH> <path> ['<json body>'] [--readonly]
// It sends ROUTA_TOKEN, or ROUTA_READONLY_TOKEN with --readonly. ROUTA_URL points it at a copy on another port.
const args = process.argv.slice(2);
const readonly = args.includes("--readonly");
const [method, path, body] = args.filter((a) => a !== "--readonly");
if (!method || !path?.startsWith("/")) {
  console.error("Usage: npm run api -- <GET|PATCH> <path> ['<json body>'] [--readonly]");
  console.error("For example: npm run api -- GET /admin/v1/settings");
  process.exit(2);
}

const name = readonly ? "ROUTA_READONLY_TOKEN" : "ROUTA_TOKEN";
const token = process.env[name];
if (!token) {
  console.error(`Set ${name} first.`);
  process.exit(2);
}

const url = process.env.ROUTA_URL || "http://localhost:4010";
const res = await fetch(`${url}${path}`, {
  method: method.toUpperCase(),
  headers: { Authorization: `Bearer ${token}`, ...(body ? { "Content-Type": "application/json" } : {}) },
  body,
}).catch(() => null);
if (!res) {
  console.error(`Nothing answered at ${url}. Is the test environment running?`);
  process.exit(2);
}

const text = await res.text();
console.log(`${res.status} ${res.statusText}`);
try {
  console.log(JSON.stringify(JSON.parse(text), null, 2));
} catch {
  console.log(text);
}
if (!res.ok) process.exitCode = 1;
