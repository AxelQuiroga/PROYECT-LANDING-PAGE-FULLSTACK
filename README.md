# Landing Page Fitness - HARD GYM

Landing one-page enfocada en conversion para servicios de entrenamiento personalizado.

El proyecto combina una interfaz moderna (frontend estatico) con un backend Express que recibe y guarda leads en MongoDB.

## Objetivo del proyecto

Construir una landing comercial que:

- presente propuesta de valor clara,
- muestre planes y testimonios,
- genere contacto rapido por WhatsApp,
- capture leads mediante formulario,
- y sea responsive en mobile, tablet y desktop.

## Que construimos

### 1) Landing one-page orientada a ventas

- Secciones principales: `Hero`, `Beneficios`, `Planes`, `Testimonios`, `CTA final` y `Formulario`.
- Diseño visual estilo gym (alto contraste, CTA fuertes, foco en conversion).
- Botones con jerarquia visual y estados hover.

### 2) Navegacion interna moderna

- Menu sticky siempre visible.
- Navegacion por anclas con scroll suave.
- Menu hamburguesa en mobile.
- Link activo por seccion usando `IntersectionObserver`.

### 3) UX y performance visual

- Loader de pantalla completa al iniciar.
- Ocultado suave del loader cuando la pagina termina de cargar.
- Microinteracciones (hover, elevacion de cards, boton flotante WhatsApp).

### 4) Formulario funcional de leads

- Validaciones en frontend (campos obligatorios, formato y longitud).
- Validaciones y sanitizacion en backend (doble validacion).
- Persistencia en MongoDB.
- Respuestas de exito/error mostradas en UI.

### 5) Integracion con WhatsApp

- Boton flotante global de WhatsApp generado dinamicamente.
- Botones de planes con mensaje contextual segun plan elegido.

## Tecnologias y lenguajes utilizados

### Frontend

- **HTML5**: estructura semantica de la landing.
- **CSS3**: layout, responsive design, animaciones y estilos visuales.
- **JavaScript (Vanilla)**: interactividad (menu mobile, loader, validaciones de formulario, estados activos de seccion).

### Backend

- **Node.js**: entorno de ejecucion.
- **Express 5**: API REST para recepcion de leads.
- **Mongoose**: modelado y conexion con MongoDB.
- **Validator**: sanitizacion y validacion robusta de datos.
- **express-rate-limit**: proteccion basica contra abuso de endpoints.
- **dotenv**: gestion de variables de entorno.

### Base de datos

- **MongoDB**: almacenamiento de leads.

## Arquitectura del proyecto

```text
landiing_pagge/
  public/
    index.html
    css/styles.css
    js/main.js
    js/whatsapp.js
    img/*
  server/
    config/db.js
    middleware/rateLimiter.js
    middleware/validateLead.js
    models/Lead.js
    routes/leads.js
  server.js
  package.json
  .env (local)
```

## Como funciona (flujo funcional)

### Flujo de navegacion

1. El usuario entra a la landing.
2. Se muestra un loader full-screen.
3. Al completar la carga, el loader se oculta con fade.
4. El usuario navega por secciones con menu sticky/hamburguesa.
5. El menu marca automaticamente la seccion activa durante el scroll.

### Flujo de conversion por formulario

1. Usuario completa `Nombre`, `Email` y `Consulta`.
2. Frontend valida antes de enviar.
3. Se envia `POST /api/leads` con JSON.
4. Backend valida/sanitiza de nuevo.
5. Si es valido, se guarda en MongoDB.
6. UI muestra mensaje de confirmacion o error.

### Flujo de conversion por WhatsApp

- CTA y botones de planes abren chat de WhatsApp con mensaje precargado.
- En planes, el mensaje incluye automaticamente el nombre del plan.

## API

### `POST /api/leads`

Guarda un lead nuevo.

**Body esperado**

```json
{
  "name": "Juan Perez",
  "email": "juan@email.com",
  "consulta": "Quiero mejorar fuerza y bajar grasa."
}
```

**Respuestas**

- `201`: lead guardado correctamente.
- `400`: datos invalidos o contenido no permitido.
- `500`: error interno del servidor.

## Seguridad y validaciones implementadas

- Campos obligatorios en frontend y backend.
- Validacion de formato de email.
- Restriccion de longitud de consulta.
- Sanitizacion de texto contra entradas maliciosas.
- Filtro de palabras sospechosas en consulta.
- Rate limiting sobre rutas API.

## Responsive design

Se definieron breakpoints para:

- **Desktop**: layout completo y menu horizontal.
- **Tablet**: ajuste de tipografias y grillas.
- **Mobile**: menu hamburguesa, cards en 1 columna y espaciados adaptados.

## Scripts disponibles

```bash
npm install
npm start
```

Servidor por defecto: `http://localhost:3000`

## Variables de entorno

En `.env`:

```env
MONGO_URI=tu_string_de_conexion_mongodb
PORT=3000
```

## Estado actual del proyecto

Proyecto funcional para captacion de leads con:

- landing comercial completa,
- navegacion moderna,
- formulario conectado a backend,
- persistencia en base de datos,
- integracion de WhatsApp.

## Nota de despliegue (plan)

- Frontend: se publicara en **Vercel**.
- Backend/API: se publicara en **Render**.

---

Si se continua el desarrollo, los siguientes pasos naturales son: panel para visualizar leads, metricas de conversion y pruebas automatizadas de formulario/API.
