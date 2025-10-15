# Dashboard de vuelos SCL → BKK

Este repositorio contiene una página estática en HTML/CSS para mostrar un resumen visual de itinerarios entre Santiago de Chile (SCL) y Bangkok (BKK) durante Semana Santa 2026. El archivo principal es [`index.html`](index.html), que puedes abrir directamente en un navegador.

## Visualización local rápida

1. Clona o descarga este repositorio.
2. Abre `index.html` haciendo doble clic o arrástralo a tu navegador.
3. Para simular un despliegue real, también puedes levantar un servidor local:
   ```bash
   python3 -m http.server 8000
   ```
   Luego visita <http://localhost:8000/index.html>.

## Opciones de despliegue en la web

Como es un sitio estático, puedes publicarlo gratis en múltiples plataformas. Aquí tienes tres alternativas populares:

### 1. GitHub Pages (desde la rama principal)
1. Crea un repositorio en GitHub y sube los archivos (`index.html`, `README.md`, etc.).
2. Entra a **Settings → Pages**.
3. En **Build and deployment**, elige *Deploy from a branch*.
4. Selecciona la rama `main` (o `master`) y la carpeta raíz (`/`).
5. Guarda los cambios. En unos minutos GitHub generará una URL del tipo `https://tu-usuario.github.io/nombre-del-repo/`.
6. Asegúrate de que el archivo principal se llame exactamente `index.html` (en minúsculas); de lo contrario, verás un error 404.

### 2. Netlify (arrastrar y soltar)
1. Crea una cuenta en <https://www.netlify.com/>.
2. En el panel, elige **Add new site → Deploy manually**.
3. Arrastra la carpeta del proyecto o sube un `.zip` con los archivos.
4. Netlify detectará el sitio estático y publicará una URL del tipo `https://nombre-aleatorio.netlify.app`.
5. Opcional: conecta tu repositorio de GitHub para que el despliegue se actualice automáticamente con cada commit.

### 3. Vercel (integración con Git)
1. Regístrate en <https://vercel.com/> y conecta tu cuenta de GitHub/GitLab/Bitbucket.
2. Importa el repositorio y deja la configuración por defecto (no necesita build).
3. Vercel publicará la página en una URL `https://nombre.vercel.app` y generará vistas previas por cada rama o pull request.

## Configura tu propio dominio (opcional)
Tanto GitHub Pages, Netlify como Vercel permiten añadir un dominio personalizado mediante registros DNS tipo `CNAME` o `A`. Sigue las instrucciones específicas de cada servicio para apuntar tu dominio y activar HTTPS gratuito.

## Estructura del proyecto
```
Viaje-
├── index.html   # Página principal con el tablero de vuelos (debe escribirse en minúsculas para GitHub Pages)
└── README.md    # Guía del proyecto y pasos de despliegue
```

¡Listo! Con cualquiera de estas opciones podrás compartir el dashboard en la web en pocos minutos.
