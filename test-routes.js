/**
 * Script de test des routes de l'application Allokoli
 * Usage: node test-routes.js
 */

const routes = [
  "/",
  "/dashboard",
  "/configurateur",
  "/vapi-configurator",
  "/assistants/new",
  "/dashboard/assistants",
  "/dashboard/phone-numbers",
  "/dashboard/settings",
  "/dashboard/usage-billing",
  "/dashboard/knowledge-bases",
];

const BASE_URL = "http://localhost:3000";

async function testRoute(route) {
  try {
    const response = await fetch(`${BASE_URL}${route}`, {
      method: "GET",
      headers: {
        "User-Agent": "Allokoli-Route-Tester/1.0",
      },
    });

    return {
      route,
      status: response.status,
      ok: response.ok,
      contentType: response.headers.get("content-type"),
      size: response.headers.get("content-length") || "unknown",
    };
  } catch (error) {
    return {
      route,
      status: "ERROR",
      ok: false,
      error: error.message,
    };
  }
}

async function testAllRoutes() {
  console.log("🚀 Test des routes Allokoli...\n");

  const results = [];

  for (const route of routes) {
    console.log(`Testing ${route}...`);
    const result = await testRoute(route);
    results.push(result);

    const statusIcon = result.ok ? "✅" : "❌";
    console.log(`${statusIcon} ${route} - ${result.status}`);

    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }

    // Petit délai pour éviter de surcharger le serveur
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("\n📊 Résumé:");
  const successCount = results.filter((r) => r.ok).length;
  const errorCount = results.filter((r) => !r.ok).length;

  console.log(`✅ Succès: ${successCount}/${routes.length}`);
  console.log(`❌ Erreurs: ${errorCount}/${routes.length}`);

  if (errorCount > 0) {
    console.log("\n🚨 Routes en erreur:");
    results
      .filter((r) => !r.ok)
      .forEach((r) => {
        console.log(`   ${r.route} - ${r.status} ${r.error || ""}`);
      });
  }

  console.log("\n🎉 Test terminé !");
}

// Vérifier si le serveur est démarré
fetch(`${BASE_URL}/`)
  .then(() => {
    testAllRoutes();
  })
  .catch(() => {
    console.log("❌ Serveur non accessible sur http://localhost:3000");
    console.log(
      "💡 Assurez-vous que le serveur de développement est démarré avec: pnpm dev"
    );
  });
