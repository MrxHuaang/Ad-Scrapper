@AGENTS.md

# ad-scrapper (Zephr)

App Next.js para buscar y consultar **Airworthiness Directives** (FAA, EASA, Transport Canada, ANAC, DGAC, etc.). El producto se presenta como **Zephr**.

## Stack

- **Next.js** 16.x, **React** 19.x, **TypeScript**
- **Tailwind CSS** 4 (`@tailwindcss/postcss`)
- **Framer Motion** — animaciones (usar `motion` de `framer-motion`)
- **Supabase** (`@supabase/ssr`, `@supabase/supabase-js`) — auth, sesión y persistencia
- **Stripe** — pasarela de pagos y suscripciones
- UI: **Base UI**, utilidades tipo **shadcn** (`class-variance-authority`, `clsx`, `tailwind-merge`), **lucide-react**

## Estructura de rutas (`app/`)

| Grupo | Rol |
|--------|-----|
| `(app)/` | Área autenticada (Dashboard): `search`, `ads/[adNumber]`, `settings` |
| `(auth)/` | Login y registro (público) |
| `(marketing)/` | Landing pública (`/`), pricing, features, about |
| `api/stripe/` | Endpoints de Checkout y Webhook |
| `api/proxy/` | Proxy hacia backend externo de búsqueda |

## Idioma

La plataforma es **English only**. No usar librerías de i18n ni `useTranslations`. Todo el copy va hardcodeado en inglés.

## Diseño: sistema de tokens y sobriedad

Definidos en `app/globals.css`. Estética **sobria y moderna** (evitar itálicas en el dashboard).

| Variable | Valor | Uso |
|----------|-------|-----|
| `--bg` | `#000000` | Fondo de página |
| `--surface` | `#0a0a0a` | Superficie base |
| `--zl-gold` | `#e8b84b` | Color de marca (autoridades, acentos, botones activos) |
| `--text-1` | `#ffffff` | Texto primario |

### Mejoras visuales recientes
- **Scrollbar:** Personalizada, fina y oscura en `globals.css`.
- **Glassmorphism:** Clase `.glass` (blur 20px) y `.glass-strong` (blur 40px).
- **Parallax:** Implementado en `ProductPreview.tsx` para la captura del dashboard.
- **Liquid Glass:** Botones con reflejo dinámico (`btn-glass`, `btn-glass-active`).

## Dashboard Layout (`(app)/`)

El layout ahora incluye una **Sidebar colapsable** real:

```
DashboardShell
├── Sidebar (colapsable, navegación, autoridades, perfil)
└── Main Content Area
    ├── DashboardTopbar (spotlight search, notificaciones)
    ├── StatCards (KPIs dinámicos con gradiente)
    └── Page Content (Buscador, Detalles, etc.)
    └── RightRail (actividad en vivo, solo en pestaña 'dashboard')
```

### Componentes de Dashboard (`components/dashboard/`)
- `Sidebar.tsx`: Gestión de navegación y estado colapsable.
- `StatCards.tsx`: Tarjetas de métricas (Total ADs, Updates, Cobertura).
- `DashboardShell.tsx`: Estructura principal que une Sidebar + Topbar + Content.
- `ProfileMenu.tsx`: Gestión de cuenta y cierre de sesión.

## Área de search (`app/(app)/search/`)

La búsqueda es ahora un módulo dentro del dashboard.
- **Autoridades:** Unificadas bajo el color **dorado de marca (#e8b84b)** para una estética cohesiva.
- **Source pills:** Selección horizontal en la zona de búsqueda.
- **Persistencia:** Resultados guardados en `sessionStorage` (`zephr_session`) para restaurar entre navegaciones.

## Pagos y Suscripción (Stripe)

- `lib/stripe.ts`: Cliente de servidor.
- `api/stripe/checkout`: Crea sesiones de suscripción (pro, team).
- `api/stripe/webhook`: Sincroniza el plan en Supabase (`profiles.plan`).
- `pricing/page.tsx`: Landing de precios con lógica de redirección al checkout.

## Convenciones y Comandos

- **Build/Lint:** `npm run build` (verifica tipos), `npm run lint`.
- **Imports:** Usar alias `@/`.
- **Layouts:** Usar `overflow-clip` en contenedores de elementos `sticky`.
- **Tipografía:** *Geist* para datos, *Cormorant* (serif) para titulares premium (sin itálica en dashboard).
