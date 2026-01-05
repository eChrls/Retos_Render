const request = require("supertest");
const {
  app,
  validateHTML,
  getServerUptime,
  getServerStatus,
} = require("./server");

describe("Tests Unitarios - Funciones del servidor", () => {
  test("validateHTML debe validar HTML correcto", () => {
    const htmlValido = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Test</title>
</head>
<body>
  <h1>Test</h1>
</body>
</html>`;
    expect(() => validateHTML(htmlValido)).not.toThrow();
    expect(validateHTML(htmlValido)).toBe(true);
  });

  test("validateHTML debe fallar si el HTML está malformado", () => {
    const htmlInvalido = `<!DOCTYPE html>
<html>
<head></head>
<body>
  <>Título roto</h1>
</body>
</html>`;
    expect(() => validateHTML(htmlInvalido)).toThrow("HTML inválido");
  });

  test("validateHTML debe fallar si falta DOCTYPE", () => {
    const htmlInvalido = "<html><head></head><body></body></html>";
    expect(() => validateHTML(htmlInvalido)).toThrow("HTML inválido");
  });

  test("getServerUptime debe retornar segundos transcurridos", () => {
    const startTime = Date.now() - 5000; // 5 segundos atrás
    const uptime = getServerUptime(startTime);
    expect(uptime).toBeGreaterThanOrEqual(4);
    expect(uptime).toBeLessThanOrEqual(6);
  });

  test("getServerStatus debe retornar objeto con propiedades correctas", () => {
    const startTime = Date.now();
    const status = getServerStatus(startTime);
    expect(status).toHaveProperty("status", "online");
    expect(status).toHaveProperty("uptime");
    expect(status).toHaveProperty("timestamp");
  });
});

describe("Tests de Integración - Endpoints HTTP", () => {
  test("GET / debe retornar código 200", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });

  test("GET / debe retornar HTML válido", async () => {
    const response = await request(app).get("/");
    expect(response.text).toContain("<!DOCTYPE html>");
    expect(response.text).toContain("<html");
    expect(response.text).toContain("</html>");
  });

  test("GET /health debe retornar estado del servidor", async () => {
    const response = await request(app).get("/health");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "online");
    expect(response.body).toHaveProperty("uptime");
  });

  test("GET /api/validate debe validar el HTML actual", async () => {
    const response = await request(app).get("/api/validate");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("valid", true);
  });
});
