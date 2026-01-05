# Sistema de Despliegue Automático con Render + GitHub

Proyecto de despliegue continuo con Node.js + Express, integración de tests automatizados y rollback funcional.

## Información del Proyecto

**Nombre:** hito1-render-deploy  
**Tecnología:** Node.js + Express  
**Testing:** Jest + Supertest + html-validate  
**Repositorio:** https://github.com/eChrls/Retos_Render.git  
**URL Producción:** https://hito1-render-deploy.onrender.com/  
**Usuario GitHub:** eChrls  

## Estructura del Proyecto

```
hito1-render-deploy/
├── server.js
├── server.test.js
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

## Arquitectura del Pipeline CI/CD

### Flujo Completo

1. **Desarrollo Local:** El desarrollador realiza cambios en el código
2. **Commit & Push:** Los cambios se suben al repositorio GitHub (rama main)
3. **Auto-Deploy Activado:** Render detecta el nuevo commit automáticamente
4. **Ejecución de Tests:** Se ejecuta `npm test` (Build Command)
5. **Validación:** Si los tests pasan, continúa el despliegue. Si fallan, se bloquea
6. **Despliegue:** Si todo es correcto, la nueva versión se despliega en producción
7. **Rollback:** En caso de fallo, se puede revertir a versión anterior

### Diferenciación de Entornos

**Entorno Local:**
- Desarrollo y pruebas en Ubuntu
- Ejecución manual de tests con `npm test`
- Servidor local en `http://localhost:3000`

**Repositorio GitHub:**
- Almacenamiento del código fuente
- Control de versiones con Git
- Historial de commits

**Render (Producción):**
- Servidor en la nube (región Oregon, US West)
- Auto-deploy configurado en cada push
- Tests ejecutados automáticamente antes de desplegar
- URL pública: https://hito1-render-deploy.onrender.com/

## Configuración de Render

**Service Type:** Web Service  
**Build Command:** `npm test`  
**Start Command:** `node server.js`  
**Auto Deploy:** Yes (On Every Push)  
**Branch:** main  
**Region:** Oregon (US West)  
**Instance Type:** Free  

## Endpoints de la Aplicación

**GET /** - Página principal con HTML  
**GET /health** - Estado del servidor (uptime, timestamp)  
**GET /api/validate** - Validación del HTML actual  

## Tests Implementados

El proyecto incluye 9 tests divididos en dos categorías:

### Tests Unitarios (5 tests)

1. Validación de HTML correcto
2. Detección de HTML malformado
3. Detección de falta de DOCTYPE
4. Cálculo de uptime del servidor
5. Generación de objeto de estado del servidor

### Tests de Integración (4 tests)

1. Respuesta HTTP 200 en ruta principal
2. Validación de HTML retornado
3. Funcionamiento del endpoint /health
4. Funcionamiento del endpoint /api/validate

## Estrategia CI/CD Implementada

**Integración Continua (CI):**
Los tests se ejecutan automáticamente en cada push. Si algún test falla, el despliegue se detiene y la versión en producción no se modifica.

**Despliegue Continuo (CD):**
Cuando todos los tests pasan, Render despliega automáticamente la nueva versión sin intervención manual.

**Protección de Producción:**
El sistema garantiza que ningún código defectuoso llegue a producción. Si un build falla, la versión estable anterior permanece activa.

## Historial de Hitos

### Hito 1: Integración Render con Git + Auto Deploy

Se configuró la conexión entre GitHub y Render mediante OAuth. Se creó el servidor Express básico y se realizó el primer despliegue automático exitoso.

### Hito 2: Pruebas Unitarias e Integración Automática

Se implementó Jest como framework de testing. Se crearon 9 tests (5 unitarios + 4 de integración) y se configuró Render para ejecutar tests antes de cada deploy.

### Hito 3: Rollback Automático y Manual

Se provocó un fallo controlado con HTML malformado. Render detectó el error y bloqueó el despliegue. Se ejecutó rollback manual desde el Dashboard y se corrigió el código.

### Hito 4: Pipeline Completo con Documentación Final

Documentación completa del pipeline CI/CD, capturas de logs y verificación del flujo completo desde commit hasta producción.

## Cómo Ejecutar el Proyecto Localmente

**Clonar el repositorio:**
```bash
git clone https://github.com/eChrls/Retos_Render.git
cd hito1-render-deploy
```

**Instalar dependencias:**
```bash
npm install
```

**Ejecutar tests:**
```bash
npm test
```

**Iniciar servidor:**
```bash
npm start
```

**Acceder a la aplicación:**
Abrir navegador en `http://localhost:3000`

## Verificación de Correspondencia Commit-Deploy

Cada deploy en Render muestra el hash del commit correspondiente. Para verificar:

1. Ir a Render Dashboard > hito1-render-deploy > Events
2. Verificar que el commit "Live" coincide con el último commit en GitHub
3. El mensaje del commit debe ser visible en ambos lugares

## Rollback: Procedimiento

En caso de necesitar revertir a una versión anterior:

1. Acceder a Render Dashboard
2. Ir a la sección "Events"
3. Localizar el último deploy exitoso
4. Hacer clic en los tres puntos (menú)
5. Seleccionar "Rollback to this version"
6. Confirmar la acción

El sistema restaurará automáticamente la versión seleccionada.

## Logs y Monitorización

**Build Logs:** Muestran la ejecución de tests y el proceso de construcción  
**Deploy Logs:** Indican el progreso del despliegue  
**Runtime Logs:** Registran errores y eventos durante la ejecución del servidor  

Los logs se retienen por 7 días en el plan gratuito de Render.

## Autor

Proyecto realizado como parte del módulo de Despliegue de Aplicaciones (DAW 2).
