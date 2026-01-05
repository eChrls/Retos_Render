const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Función para validar estructura HTML con validación real
async function validateHTML(htmlContent) {
  const { HtmlValidate } = require("html-validate");
  const htmlvalidate = new HtmlValidate({
    extends: ["html-validate:recommended"],
    rules: {
      "doctype-html": "error",
      "void-style": "off",
      "no-trailing-whitespace": "off",
    },
  });

  const report = await htmlvalidate.validateString(htmlContent);

  if (!report.valid) {
    // Recoger todos los errores de forma segura
    let errors = "HTML con errores de estructura";
    if (
      report.results &&
      report.results.length > 0 &&
      report.results[0].messages
    ) {
      errors = report.results[0].messages.map((msg) => msg.message).join(", ");
    }
    throw new Error(`HTML inválido: ${errors}`);
  }

  return true;
}

// Función para calcular el tiempo de uptime del servidor
function getServerUptime(startTime) {
  const uptime = Date.now() - startTime;
  return Math.floor(uptime / 1000); // segundos
}

// Función para generar respuesta de estado
function getServerStatus(startTime) {
  return {
    status: "online",
    uptime: getServerUptime(startTime),
    timestamp: new Date().toISOString(),
  };
}

const serverStartTime = Date.now();

// Middleware para servir archivos estáticos
app.use(express.static("."));

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Endpoint de salud del servidor
app.get("/health", (req, res) => {
  res.json(getServerStatus(serverStartTime));
});

// Endpoint para validar HTML
app.get("/api/validate", async (req, res) => {
  const fs = require("fs");
  try {
    const htmlContent = fs.readFileSync("index.html", "utf8");
    await validateHTML(htmlContent);
    res.json({ valid: true, message: "HTML válido" });
  } catch (error) {
    res.status(400).json({ valid: false, message: error.message });
  }
});

// Solo iniciar servidor si no estamos en modo test
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

// Exportar para tests
module.exports = { app, validateHTML, getServerUptime, getServerStatus };
