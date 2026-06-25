# SportClub Frontend

Proyecto base para la evaluación de la Unidad 3 — aplicación SPA React para gestión de un centro deportivo.

## Integrantes
- Daninson Parra

## Tecnologías
- React 19
- React Router
- Vite
- React-Bootstrap
- Bootstrap 5
- SweetAlert2

## Estructura del proyecto
src/
- components/
- layouts/
- pages/
- routes/
- services/

## Instalar dependencias
```bash
npm install
```

## Ejecutar frontend
```bash
npm run dev
```

## Ejecutar backend
El backend debe ser el provisto por la asignatura. Por ejemplo, si el backend corre en http://localhost:3000:
1. Entrar a la carpeta del backend
2. Instalar dependencias
```bash
npm install
npm run dev
```

## Variables de entorno
Se recomienda usar `VITE_API_URL` en el frontend. Ejemplo en archivo `.env` en la raíz del frontend:

```
VITE_API_URL=http://localhost:3000/api
```

En el código se utiliza `import.meta.env.VITE_API_URL`.

## Logo
Coloca el logo de SportClub en: `src/assets/sportclub-logo.png`. Este archivo se usará en los headers de los dashboards.

## Modo offline / mocks (actual)
Para facilitar la evaluación y desarrollo sin backend, los servicios (`src/services/authService.js` y `src/services/userService.js`) funcionan en modo "mock" cuando `VITE_API_URL` no está definido. En modo mock:
- Login, registro y CRUD de usuarios usan datos en memoria.
- Los formularios y componentes funcionan exactamente igual; cuando se establezca `VITE_API_URL`, las llamadas pasarán al backend real.

## Cómo cambiar a backend real
1. Añadir `.env` con `VITE_API_URL` apuntando al backend (ver arriba).
2. Reiniciar el servidor dev: `npm run dev`.
3. Verificar que los endpoints del backend coincidan con las rutas:
   - POST `${VITE_API_URL}/auth/login`
   - POST `${VITE_API_URL}/auth/register`
   - GET/POST/PUT/DELETE `${VITE_API_URL}/users`

Si el backend usa otras rutas, ajustar `src/services/*` para mapear a los endpoints correctos.

## Notas
- Las rutas protegidas y control por roles están implementadas en `src/routes`.
- Guardar tokens en localStorage es una solución simple para evaluación; en producción considerar httpOnly cookies.


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
