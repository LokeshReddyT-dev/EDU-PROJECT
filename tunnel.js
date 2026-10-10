// tunnel.js — Persistent public tunnel with auto-reconnect
import localtunnel from "localtunnel";

async function startTunnel() {
  try {
    const tunnel = await localtunnel({ port: 3000 });
    console.log(`====================================================`);
    console.log(`🌐 Live Public Link: ${tunnel.url}`);
    console.log(`📡 API Health Check:  ${tunnel.url}/api/health`);
    console.log(`🔑 Tunnel Password:   117.205.72.73`);
    console.log(`====================================================`);

    tunnel.on("close", () => {
      console.log("[Tunnel] Closed. Reconnecting in 3s...");
      setTimeout(startTunnel, 3000);
    });

    tunnel.on("error", (err) => {
      console.error("[Tunnel] Error:", err.message);
      tunnel.close();
    });
  } catch (err) {
    console.error("[Tunnel] Failed to connect:", err.message);
    setTimeout(startTunnel, 3000);
  }
}

startTunnel();
