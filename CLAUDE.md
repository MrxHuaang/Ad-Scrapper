@AGENTS.md

# ad-scrapper (Zephr)

App Next.js para buscar y consultar **Airworthiness Directives** (FAA, EASA, Transport Canada, ANAC, DGAC, etc.). El producto en UI se presenta como **Zephr**.

## Stack

- **Next.js** 16.x, **React** 19.x, **TypeScript**
- **Tailwind CSS** 4 (`@tailwindcss/postcss`)
- **Framer Motion** — animaciones (ya instalado, usar `motion` de `framer-motion`)
- **Supabase** (`@supabase/ssr`, `@supabase/supabase-js`) — auth y sesión
- UI: **Base UI**, utilidades tipo **shadcn** (`class-variance-authority`, `clsx`, `tailwind-merge`), **lucide-react**
- **OGL** — WebGL renderer usado en el componente `Prism.tsx` de la landing

Antes de tocar APIs o estructura de App Router, consulta la guía en `node_modules/next/dist/docs/`.

## Estructura de rutas (`app/`)

| Grupo | Rol |
|--------|-----|
| `(app)/` | Área autenticada: `search`, `settings` |
| `(auth)/` | Login y registro |
| `(marketing)/` | Landing pública (`/`), pricing, features, regulators, about |
| `auth/callback/` | OAuth / callback de Supabase |
| `api/proxy/[...path]/` | Proxy hacia backend externo (búsqueda + exportación) |

## Diseño: sistema de tokens

Definidos en `app/globals.css`. Usar siempre estas variables, **no** colores hardcoded de Tailwind para el app area:

| Variable | Valor | Uso |
|----------|-------|-----|
| `--bg` | `#000000` | Fondo de página |
| `--surface` | `#0a0a0a` | Superficie base |
| `--surface-2` | `#141414` | Superficie elevada |
| `--surface-3` | `#1a1a1a` | Superficie más elevada |
| `--border` | `rgba(255,255,255,0.1)` | Bordes estándar |
| `--text-1` | `#ffffff` | Texto primario |
| `--text-2` | `#a1a1a1` | Texto secundario |
| `--text-3` | `#737373` | Texto terciario |
| `--zl-gold` | `#e8b84b` | Acento dorado (hover glow, subtítulos landing) |
| `--zl-green` | `#00d47f` | Acento verde (hero landing) |

### Clases de utilidad globales (globals.css)

- `.glass` — glassmorphism sutil: `blur(20px)`, `bg rgba(255,255,255,0.03)`, border `rgba(255,255,255,0.07)`
- `.glass-strong` — glassmorphism fuerte: `blur(40px)`, `bg rgba(255,255,255,0.055)`
- `.ad-card` — transición para hover gold glow en las AD cards de resultados
- `.ad-card:hover` — levanta 3px + `box-shadow` dorado con `rgba(232,184,75,...)`
- `.ad-card-actions` — oculto por defecto, visible en hover del `.ad-card`
- `.btn-glass` / `.btn-glass-sm` — botones liquid glass (rounded-full, backdrop-blur)
- `.zl-text-spectrum` — texto con gradiente espectro (hero landing)
- `.prism-reveal` — fade-in de 2.5s para el fondo Prism de la landing

## Layout del área autenticada `(app)/`

**No hay sidebar.** El layout es full-width:

```
AppHeader (sticky, blur)
└── main (flex-1, overflow-y-auto)
    └── page content
```

- `app/(app)/layout.tsx` — `SidebarProvider` + `AppHeader` + `main`
- `components/layout/AppHeader.tsx` — logo Zephr, status pill de búsqueda, theme toggle, profile dropdown
- `components/providers/SidebarProvider.tsx` — contexto que provee `selectedSource`, `setSelectedSource`, `searchStatus`, `resultCount`, `elapsedMs`. **No es un sidebar visual**, es el estado global de búsqueda.

## Área de search (`app/(app)/search/`)

### Flujo de la página

```
Hero (headline + search bar + source pills)
└── ResultsSection
    ├── SearchStatus (pill de estado)
    ├── ResultsHeader (conteo + filter + export + view toggle)
    ├── Grid de ADCard (default) ó ResultsTable (modo tabla)
    ├── Pagination
    └── BulkBar (floating bottom, cuando hay selección)
```

### Source pills

La selección de fuente ya **no está en un sidebar** — está en la hero section como pills coloreadas por autoridad. Usan `setSelectedSource` del `SidebarProvider`.

Colores por autoridad:
```
federal_register / faa : #3b82f6 (blue)
easa                   : #f59e0b (amber)
transport_canada       : #ef4444 (red)
anac_brazil            : #10b981 (emerald)
anac_argentina         : #0ea5e9 (sky)
dgac_chile             : #8b5cf6 (violet)
aerocivil_colombia     : #ec4899 (pink)
casa_australia         : #f97316 (orange)  — coming soon
gcaa_uae               : #14b8a6 (teal)    — coming soon
```

### Componentes de search (`components/search/`)

| Archivo | Descripción |
|---------|-------------|
| `ADCard.tsx` | Card premium con glassmorphism, franja de color, hover gold glow, acciones on-hover |
| `SearchForm.tsx` | Command bar horizontal: keyword + make + model en una fila, toggle para filtros avanzados |
| `ResultsTable.tsx` | Vista tabla (modo power-user): franjas de color de 3px por autoridad, badges semánticos |
| `ResultsHeader.tsx` | Barra de stats: conteo, filter input, toggle vista, copy URL, export glass pills |
| `CardsView.tsx` | Vista cards alternativa (compacta) |
| `SearchStatus.tsx` | Píldora de estado: ámbar pulsante (buscando), verde (done), rojo (error) |
| `Pagination.tsx` | Paginación: página activa = blanco sólido |
| `BulkBar.tsx` | Floating bar (bottom-6, glass) cuando hay ADs seleccionados |
| `searchUtils.ts` | `getSortedResults`, `calcRelevance`, `formatDate`, `getTypeLabel`, `normalizeSource`, `SOURCE_SHORT` |

### Animaciones en search

- `motion.h1`, `motion.p`, `motion.div` en la hero section con `initial/animate`
- Grid de cards usa `variants` con `staggerChildren: 0.045` — **no usar `ease` en los variants** (incompatibilidad de tipos con esta versión de framer-motion; usar solo `duration`)
- `key={cards-p${currentPage}}` en el contenedor del grid para re-triggear el stagger al cambiar página

## Landing (`app/page.tsx` y `(marketing)/`)

### Estructura

```
Navbar
HeroSection         ← SplineCube + headline left-aligned + liquid glass buttons
<div.relative>      ← Contenedor para el fondo Prism
  PrismBackground   ← sticky top-0, fade-in con .prism-reveal
  ForegroundContent ← ProductPreview, FeaturesGrid, StickyAudienceSection, AuthorityCoverage
Footer
```

### Componentes clave

- `SplineCube.tsx` — círculo 3D Spline, posicionado a la **derecha** del hero (`right-[2-6]%`). Fade-in de 1.4s cuando `onLoad` dispara. **No cambiar la posición** sin autorización.
- `Prism.tsx` — shader WebGL (OGL). Usa `suspendWhenOffscreen`, `IntersectionObserver` interno. La clase `.prism-reveal` en el contenedor exterior hace el fade-in.
- `HeroSection.tsx` — layout **left-aligned** (headline + CTA a la izquierda, SplineCube a la derecha). **No cambiar la distribución** sin autorización.

### Corrección crítica para sticky + overflow

El contenedor del Prism usa `overflow-clip` (NO `overflow-hidden`). `overflow-hidden` crea un scroll container que rompe `position: sticky`. `overflow-clip` recorta visualmente sin crear scroll container.

## Auth (`(auth)/`)

- `login/page.tsx` — botón Home es pill liquid glass (`rounded-full border border-white/[0.1]`), no texto plano
- `register/page.tsx` — mismo patrón que login
- Auth callback en `app/auth/callback/` — no modificar sin revisar flujo Supabase

## Código compartido

- `lib/supabase/` — `client.ts` (browser), `server.ts` (server), `middleware.ts`
- `components/providers/AuthProvider.tsx` — contexto de sesión, expone `user` y `plan`
- `hooks/useAdSearch.ts` — SSE hook para búsqueda en tiempo real
- `hooks/useToast.ts` / `components/ui/Toast.tsx` — sistema de toasts
- `types/index.ts` — tipos: `ADResult`, `SearchParams`, `SearchStatus`, `SourceKey`

## Variables de entorno

Definir en `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Comandos

```bash
npm run dev    # desarrollo
npm run build  # producción (verifica TypeScript)
npm run lint   # eslint
```

## Convenciones

- Imports con alias `@/` (no rutas relativas largas)
- Colores en el app area: usar variables CSS (`rgba(255,255,255,0.07)`, `#111`, `#1e1e1e`) — **no** clases Tailwind de color que puedan chocar con el tema light/dark
- `cursor-pointer` explícito en todos los `<button>` y `<a>` interactivos
- No añadir `overflow-hidden` como contenedor de elementos `sticky` — usar `overflow-clip`
- No cambiar layout del hero (distribución left-aligned + SplineCube derecha) sin autorización explícita
