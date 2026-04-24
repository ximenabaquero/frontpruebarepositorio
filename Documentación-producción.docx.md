---

**💰 Valoración del sistema**

El sistema que construimos incluye:

* Autenticación con roles (ADMIN, REMITENTE)

* Gestión completa de pacientes

* Registros clínicos con procedimientos e ítems

* Facturación y PDFs

* Dashboard estadístico completo (6+ gráficas, comparativas, gauges)

* Control de imágenes clínicas

* Gestión de remitentes

* Gestión de Inventario

---

**🔧 Mantenimiento anual**

Ofrece dos modalidades:

**Básico — $450.000 COP/mes (Cluade propone 600.000)**

* Corrección de bugs

* Actualizaciones de seguridad

* Soporte por WhatsApp

**Completo — $700.000 COP/mes (Cluade propone 1.200.000)**

* Todo lo anterior

* Nuevas funcionalidades menores

* Copias de seguridad verificadas

* Monitoreo de disponibilidad

---

**📊 Sobre la imagen de costos**

Los precios de la imagen **son correctos y realistas** para 2025-2026:

* **Dominio .com \~$50.400 COP/año** ✅ — Namecheap o Porkbun están entre $10-13 USD, correcto

* **Railway \+ Hostinger \~$252.000 COP/año** ⚠️ — Railway puede subir dependiendo del uso. Para una clínica pequeña con tráfico bajo está bien, pero Railway cobra por uso real de CPU/RAM. Si el servidor duerme entre consultas puede ser más barato, pero si hay tráfico constante puede llegar a $20-25 USD/mes fácilmente

* **Vercel gratis** ✅ — Para el frontend Next.js es perfecto y gratuito

**Total \~$302.400 COP/año es optimista** — más realista es $400.000-600.000 COP/año contando imprevistos.

---

**🚀 Checklist antes de producción**

**Backend Laravel:**

□ APP\_ENV=production en .env

□ APP\_DEBUG=false (nunca true en producción)

□ APP\_KEY generado y seguro

□ Conexión DB con usuario limitado (no root)

□ CORS configurado solo para tu dominio frontend

□ Rate limiting en rutas de login (ya tienes throttle?)

□ php artisan config:cache

□ php artisan route:cache

□ php artisan view:cache

□ Sanctum configurado con dominio correcto en SESSION\_DOMAIN

□ HTTPS forzado en AppServiceProvider

□ Logs en storage/logs con permisos correctos

□ .env nunca en el repositorio (.gitignore)

**Frontend Next.js:**

□ NEXT\_PUBLIC\_API\_BASE\_URL apuntando a producción

□ npm run build sin errores ni warnings críticos

□ Variables de entorno en Vercel dashboard

□ Imágenes optimizadas (next/image)

□ Metadata y SEO básico configurado

**Base de datos:**

□ Backups automáticos configurados (diario mínimo)

□ Usuario MySQL con permisos mínimos necesarios

□ Contraseña fuerte generada

□ No exponer puerto 3306 al exterior

---

**🌐 Recomendaciones de dominio y hosting**

**Dominio — Porkbun.com** es el más barato y confiable:

* .com desde $9 USD/año (\~$37.000 COP)

* Mejor que Namecheap en precio actualmente

* WHOIS privacy gratis incluido

**Para el nombre:** algo como clinica\[nombre\].com o sistema\[nombre\].com — evita guiones.

**Backend hosting — opciones en orden de recomendación:**

1. **Railway** (\~$5-15 USD/mes) — Lo más fácil para Laravel, deploy desde GitHub, MySQL incluido, SSL automático. Ideal para empezar.

2. **Render.com** (\~$7 USD/mes) — Similar a Railway, más predecible en costos, buen plan gratuito para probar.

3. **DigitalOcean Droplet $6 USD/mes** — Más control, VPS real con Ubuntu, requiere más configuración manual (Nginx, PHP, MySQL) pero más estable y predecible a largo plazo.

4. **Hostinger VPS** (\~$4-8 USD/mes) — Barato, panel fácil, pero soporte más lento. Para clínica pequeña funciona.

**Mi recomendación:** Railway para arrancar rápido, migrar a DigitalOcean cuando el cliente esté consolidado.

**Frontend — Vercel** ✅ gratis para siempre en proyectos pequeños. No hay razón para pagar otra cosa con Next.js.

---

**🔐 Sobre el login en otro dominio**

Tienes razón en haberlo pensado — es una buena práctica de seguridad llamada **separación de subdominios**. La recomendación real es:

**No necesitas otro dominio**, sino **subdominios**:

app.tuclinica.com      → Frontend (Vercel)

api.tuclinica.com      → Backend Laravel (Railway/DO)

auth.tuclinica.com     → Opcional, solo si usas OAuth externo

Para tu caso con Laravel Sanctum \+ Next.js, lo importante es:

// .env Laravel

SESSION\_DOMAIN=.tuclinica.com  // el punto al inicio es clave

SANCTUM\_STATEFUL\_DOMAINS=app.tuclinica.com

// next.js

NEXT\_PUBLIC\_API\_BASE\_URL=https://api.tuclinica.com

El **login en subdominio separado** (auth.) tiene sentido cuando usas OAuth2/SSO con múltiples aplicaciones. Para una sola clínica con un sistema, **no es necesario** y agrega complejidad innecesaria. Lo que sí es obligatorio es **HTTPS en ambos subdominios** y cookies con Secure y SameSite=Lax.

---

**⚠️ Cosas críticas antes de entregar al cliente**

1. **Nunca subas .env al repo** — revisa el historial de git con git log \--all \-- .env

2. **Cambia todas las contraseñas** que usaste en desarrollo

3. **Prueba el flujo completo** en staging antes de producción

4. **Configura un dominio de correo** para notificaciones del sistema (Mailtrap en dev, Mailgun/Resend en producción, \~$0 para volumen bajo)

5. **Documenta las credenciales** en un gestor seguro (Bitwarden) y entrégaselas al cliente de forma segura, nunca por WhatsApp en texto plano

   

**Railway \+ Vercel — ¿Son seguros?**

**Sí, ambos son seguros para producción:**

* Railway usa infraestructura de Google Cloud, tiene SSL automático, variables de entorno encriptadas y no expone puertos innecesariamente

* Vercel es la empresa detrás de Next.js, usado por empresas grandes, CDN global y SSL automático

---

**¿Cómo funciona Railway?**

**Railway tiene plan gratuito para probar:**

* $5 USD de crédito gratis al registrarte

* Suficiente para probar el deploy completo sin pagar nada

* Cuando se acaba el crédito, pagas solo lo que usas (pay-as-you-go)

**Flujo para empezar:**

1\. Crear cuenta en railway.app (gratis)

2\. Conectar tu repositorio de GitHub

3\. Railway detecta Laravel automáticamente

4\. Agregar MySQL como servicio adicional (un clic)

5\. Configurar variables de entorno (.env de producción)

6\. Deploy automático

**No pagas nada hasta que el crédito gratis se acabe.** Ideal para configurar todo primero y pagar cuando ya esté funcionando.

---

**¿El subdominio hay que pagarlo aparte?**

**No.** Los subdominios son gratis — los creas tú mismo en el panel de tu dominio (Porkbun/Namecheap). Solo pagas el dominio principal una vez al año.

tuclinica.com          → pagas \~$37.000 COP/año

api.tuclinica.com      → GRATIS, tú lo configuras

app.tuclinica.com      → GRATIS, tú lo configuras

En Railway asignas api.tuclinica.com a tu backend. En Vercel asignas app.tuclinica.com al frontend. Ambos te dan SSL gratis automáticamente.

**Sobre el login en subdominio separado** — como te dije antes, para este sistema **no es necesario**. El login vive en app.tuclinica.com/login y se comunica con api.tuclinica.com. No necesitas auth.tuclinica.com a menos que en el futuro tengas múltiples sistemas.

---

**Arquitectura final recomendada**

Porkbun

└── tuclinica.com (\~$37.000 COP/año)

    ├── app.tuclinica.com → Vercel (gratis)

    └── api.tuclinica.com → Railway (\~$5-15 USD/mes)

                              ├── Laravel (backend)

                              └── MySQL (base de datos)

**Costo real mensual:** \~$5-10 USD Railway \+ $0 Vercel \= **\~$21.000 \- $42.000 COP/mes**

---

**Backups de la base de datos**

Railway **no hace backups automáticos en el plan básico** — esto es importante saberlo. Tienes tres opciones:

**Opción 1 — Script manual con cron (recomendado y gratis):**

Crea un comando Laravel que se ejecute diario:

![][image1]

![][image2]

**Opción 2 — Spatie Laravel Backup (el más completo):**

composer require spatie/laravel-backup

Hace backup de DB \+ archivos, comprime, encripta y puede enviar a Google Drive, S3, Dropbox. Con notificación por correo si falla.

**Opción 3 — Railway Pro ($20 USD/mes)** incluye backups automáticos con punto de restauración. Vale la pena si el cliente paga mantenimiento.

**Mi recomendación:** Spatie Laravel Backup \+ Google Drive gratis (15GB) para guardar los .sql comprimidos. Configurado una vez, funciona solo para siempre.

---

**Resumen del orden para ir a producción**

Semana 1 — Preparar

□ Crear cuenta Railway y conectar repo backend

□ Crear cuenta Vercel y conectar repo frontend

□ Comprar dominio en Porkbun

Semana 2 — Configurar

□ Variables de entorno de producción en Railway

□ Correr migraciones en DB de producción

□ Configurar subdominios en Porkbun

□ Apuntar app. a Vercel y api. a Railway

□ Verificar HTTPS en ambos

Semana 3 — Verificar

□ Probar login completo

□ Probar registro de paciente end-to-end

□ Probar generación de PDF

□ Probar estadísticas

□ Configurar Spatie Backup

□ Hacer primer backup manual y verificarlo

Entregar al cliente ✅

**¿Qué es un dominio y cómo funciona?**

El dominio **no es solo el frontend** — es tu dirección en internet que apunta a donde tú quieras:

tuclinica.com          → puede apuntar a cualquier cosa

app.tuclinica.com      → apunta a Vercel (frontend)

api.tuclinica.com      → apunta a Railway (backend)

Pagas el dominio una vez al año (\~$37.000 COP) y tú decides a dónde apunta cada subdominio. Vercel y Railway son los servidores donde vive el código — el dominio es solo el nombre bonito.

---

**¿Qué es Porkbun?**

Es una empresa registradora de dominios — básicamente donde compras el nombre. Es la más barata y confiable actualmente. Se paga con tarjeta de crédito/débito internacional o PayPal. Alternativas similares: Namecheap, Google Domains (ahora Squarespace).

---

**Costos estimados reales**

**Mensual:**

Railway (backend \+ MySQL)   \~$8-12 USD    \~$33.000-50.000 COP

Vercel (frontend)           $0            gratis

─────────────────────────────────────────────────────

Total mensual               \~$33.000-50.000 COP

**Anual:**

Railway x 12 meses          \~$100-140 USD  \~$415.000-580.000 COP

Dominio Porkbun             \~$9 USD        \~$37.000 COP

Vercel                      $0             gratis

─────────────────────────────────────────────────────

Total anual                 \~$450.000-620.000 COP

La imagen que me mostraste de \~$302.400 COP/año es **optimista** — más realista es **\~$500.000 COP/año** contando que Railway cobra por uso real.

**Mantenimiento que puedes cobrar:**

Básico   $500.000-700.000 COP/mes   bugs \+ soporte

Completo $1.000.000-1.500.000/mes   bugs \+ features \+ backups verificados

---

**Backups — ¿mejor en la nube?**

**Sí, siempre en la nube.** Si Railway tiene un problema y pierdes el servidor, también pierdes los backups si están ahí mismo.

La mejor opción gratis es **Google Drive con Spatie Laravel Backup:**

composer require spatie/laravel-backup

Configuras una vez y cada noche a las 2am hace el backup, lo comprime y lo sube a Google Drive automáticamente. Si falla te manda un correo. 15GB gratis en Drive es suficiente para años de backups de una clínica pequeña.

---

**HTTPS — ¿dónde se configura?**

**No tienes que hacer nada en el código.** Railway y Vercel dan SSL/HTTPS automático cuando conectas tu dominio. El proceso es:

1\. En Railway: Settings → Domain → agregar api.tuclinica.com

2\. Railway te da un registro DNS (CNAME)

3\. En Porkbun: pegas ese CNAME en la configuración del dominio

4\. En 5-10 minutos Railway activa HTTPS automáticamente

Lo mismo con Vercel para el frontend. El certificado SSL es gratis y se renueva automático.

---

**Lo del login — subdominio vs ocultar botón**

Entiendo lo que quieres — que el cliente/paciente no vea el botón de login en la página principal. Tienes dos opciones:

**Opción 1 — Simplemente quitar el botón (más simple):** La ruta /login existe pero no hay botón visible. El médico/admin accede escribiendo directamente tuclinica.com/login en el navegador. Es lo más común y perfectamente válido — no necesitas subdominio para esto.

**Opción 2 — Subdominio para el panel:**

tuclinica.com           → página informativa del negocio (sin login)

app.tuclinica.com/login → panel del sistema (con login)

Esta opción tiene más sentido si en el futuro quieres tener una página de marketing en el dominio principal y el sistema en app.. Es la arquitectura más profesional.

**Mi recomendación:** quita el botón por ahora y usa tuclinica.com/login directamente. Cuando el cliente quiera página de presentación, migras el sistema a app.tuclinica.com. No vale la pena complicarlo al inicio.

---

**Base de datos en producción — ¿cómo probar?**

**Nunca uses la DB de producción para pruebas.** El flujo correcto es:

Local (desarrollo)     → tu DB local, datos de prueba con seeders

Staging (opcional)     → copia de producción para verificar antes de subir

Producción             → datos reales del cliente, nadie prueba aquí

Para verificar que todo funciona antes de entregar al cliente:

1\. Subir el código a Railway

2\. Correr: php artisan migrate \--force

3\. Correr: php artisan db:seed \--class=RolesSeeder (solo roles/permisos básicos)

4\. Crear UN usuario admin manualmente

5\. Hacer login y probar el flujo completo

6\. Si algo falla, corriges en local y vuelves a hacer deploy

7\. Cuando todo funciona, entregas acceso al cliente

Los seeders con datos de prueba (pacientes falsos, procedimientos de ejemplo) **no los corras en producción** — solo los seeders de configuración base como roles y tipos de procedimientos si los tienes

---

Railway te permite tener **ambientes separados** en el mismo proyecto:

**rama main       → producción    (lo que ve el cliente)**

**rama staging    → pruebas       (donde verificas antes)**

Entonces el flujo sería:

1\. En tu repo de GitHub creas rama: staging

2\. En Railway conectas esa rama a un servicio separado

3\. Subes tu código a staging primero

4\. Pruebas todo ahí con datos falsos

5\. Cuando funciona todo, haces merge a main

6\. Railway hace deploy automático a producción

**¿Pero vale la pena para una clínica pequeña?**

Honestamente, para este proyecto no es necesario al inicio. Lo que sí puedes hacer es más simple:

1\. Subes a Railway (main \= producción)

2\. Corres migraciones

3\. Creas usuario admin

4\. Pruebas el flujo completo tú mismo

5\. Si algo falla, corriges y haces nuevo deploy

6\. Cuando todo está bien, le das acceso al cliente

La diferencia clave es que **en producción sin datos reales del cliente no hay riesgo**. El peligro es cuando ya hay pacientes registrados y haces cambios — ahí sí necesitas staging para no dañar datos reales.

**Resumen práctico:**

* Al inicio: sube directo, prueba tú, luego entrega al cliente ✅

* Cuando el cliente ya tenga datos: crea rama staging antes de cualquier cambio grande ✅

Revisé la documentación oficial de Railway. Hay cambios importantes respecto a lo que te dije antes — te corrijo todo:

---

**⚠️ Correcciones importantes**

**El nixpacks.toml que te di está desactualizado.** Railway ahora usa **Railpack** (reemplazó a Nixpacks) y además detecta Laravel automáticamente. Lo que significa:

**No necesitas crear ningún archivo de configuración.** Railway detecta solo que es Laravel y configura php-fpm \+ nginx automáticamente.

---

**Paso a paso corregido y actualizado**

**PASO 1 — Prepara el código**

Lo único que necesitas agregar al backend es esto:

**Fuerza HTTPS en producción** en app/Providers/AppServiceProvider.php:

public function boot(): void

{

    if (config('app.env') \=== 'production') {

        \\URL::forceScheme('https');

    }

}

**Configura TrustProxies** en app/Http/Middleware/TrustProxies.php:

protected $proxies \= '\*';

Railway usa proxies internos y sin esto las IPs y HTTPS no funcionan bien.

**Agrega una ruta de health check** en routes/web.php:

Route::get('/health', fn() \=\> response()-\>json(\['status' \=\> 'ok'\]));

Esto le dice a Railway que el servidor está listo antes de redirigir tráfico.

**Verifica que .env está en .gitignore** — nunca debe subir al repo.

---

**PASO 2 — Compra el dominio en Porkbun**

1. Ve a **porkbun.com**

2. Busca tu dominio

3. Paga con tarjeta internacional (\~$9 USD)

4. **No configures DNS todavía**

---

**PASO 3 — Configura Railway**

**3.1 — Crea cuenta:**

1. Ve a **railway.app**

2. Sign up con GitHub

**3.2 — Crea el proyecto:**

1. Click New Project → Deploy from GitHub repo

2. Selecciona tu repo del backend Laravel

3. Railway detecta Laravel automáticamente — **no necesitas nixpacks.toml**

**3.3 — Agrega MySQL:**

1. En el proyecto click \+ New → Database → MySQL

2. Railway crea la DB en segundos

3. Click en la DB → pestaña Variables → copia estos valores:

MYSQL\_HOST

MYSQL\_USER  

MYSQL\_PASSWORD

MYSQL\_DATABASE

MYSQL\_PORT

**3.4 — Agrega variables de entorno al backend:**

Click en tu servicio Laravel → Variables → Raw Editor y pega:

APP\_NAME="Nombre Clinica"

APP\_ENV=production

APP\_DEBUG=false

APP\_URL=https://api.tuclinica.com

APP\_KEY=         \# genera con: php artisan key:generate \--show

DB\_CONNECTION=mysql

DB\_HOST=${{MySQL.MYSQL\_HOST}}

DB\_PORT=${{MySQL.MYSQL\_PORT}}

DB\_DATABASE=${{MySQL.MYSQL\_DATABASE}}

DB\_USERNAME=${{MySQL.MYSQL\_USER}}

DB\_PASSWORD=${{MySQL.MYSQL\_PASSWORD}}

SESSION\_DRIVER=cookie

SESSION\_DOMAIN=.tuclinica.com

SANCTUM\_STATEFUL\_DOMAINS=app.tuclinica.com

FRONTEND\_URL=https://app.tuclinica.com

**Nota importante:** Railway permite referenciar variables de otros servicios con ${{MySQL.MYSQL\_HOST}} — úsalo para no copiar valores manualmente.

**3.5 — Configura el comando de inicio:**

En tu servicio Laravel → Settings → Deploy → Custom Start Command:

php artisan migrate \--force && php artisan optimize && php-fpm

**3.6 — Configura health check:**

En Settings → Deploy → Health Check Path:

/health

**3.7 — Agrega dominio:**

1. Settings → Networking → Custom Domain

2. Escribe api.tuclinica.com

3. Railway te da un CNAME — **cópialo**

---

**PASO 4 — Configura Vercel**

1. Ve a **vercel.com** → Sign up con GitHub

2. Add New → Project → selecciona repo frontend

3. Agrega variable de entorno:

NEXT\_PUBLIC\_API\_BASE\_URL \= https://api.tuclinica.com

4. Click Deploy

5. Settings → Domains → agrega app.tuclinica.com

6. Vercel te da un CNAME — **cópialo**

---

**PASO 5 — Configura DNS en Porkbun**

1. Ve a Porkbun → tu dominio → DNS Records

2. Agrega:

Type: CNAME  |  Host: api  |  Value: (CNAME de Railway)  |  TTL: 300

Type: CNAME  |  Host: app  |  Value: (CNAME de Vercel)   |  TTL: 300

3. Espera 5-15 minutos

4. **HTTPS se activa automático** en Railway y Vercel — no tocas nada en el código

---

**PASO 6 — Verifica en orden**

□ https://api.tuclinica.com/health        → {"status":"ok"}

□ https://app.tuclinica.com               → carga el frontend

□ Login con usuario admin

□ Crear paciente de prueba

□ Crear registro clínico

□ Generar PDF

□ Ver estadísticas

□ Probar desde celular

□ Probar desde otro navegador

---

**PASO 7 — Backups con Spatie**

composer require spatie/laravel-backup

php artisan vendor:publish \--provider="Spatie\\Backup\\BackupServiceProvider"

En config/backup.php:

'destination' \=\> \[

    'disks' \=\> \['google'\],

    'filename\_prefix' \=\> 'clinica-backup-',

\],

En app/Console/Kernel.php:

$schedule-\>command('backup:run')-\>dailyAt('02:00');

$schedule-\>command('backup:clean')-\>dailyAt('03:00');

**Sí, Google Drive es la mejor opción** — 15GB gratis, automático, y si Railway tiene problemas tus backups están seguros en otro lugar.

| Ahora  |
| :---- |
| Railway detecta Laravel solo |
| Railway usa php-fpm \+ nginx automático |
| Usa ${{MySQL.MYSQL\_HOST}} para referenciar |
| Agrega /health route |
| Necesario para HTTPS correcto en Railway |
|  |

**tener el subdominio app. configurado en Vercel de todas formas. Entonces:**

**coldesthetic.com       → landing page (lo que se ve en la imagen)**

**app.coldesthetic.com   → todo el sistema de gestión**

**Quitas el botón "Iniciar sesión" del navbar de la landing, y los médicos acceden por app.coldesthetic.com/login — URL que solo ellos conocen.**

**Es limpio, profesional, y no agrega ningún costo ni complejidad extra porque ya tenías planeado usar subdominios.**

[image1]: <data:image/png;base64,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>

[image2]: <data:image/png;base64,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>