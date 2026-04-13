@AGENTS.md

# ad-scrapper (Zephr)

App Next.js para buscar y consultar **Airworthiness Directives** (FAA, EASA, Transport Canada, ANAC). El producto en UI se presenta como **Zephr**.

## Stack

- **Next.js** 16.x, **React** 19.x, **TypeScript**
- **Tailwind CSS** 4 (`@tailwindcss/postcss`)
- **Supabase** (`@supabase/ssr`, `@supabase/supabase-js`) — auth y sesión
- UI: **Base UI**, utilidades tipo **shadcn** (`class-variance-authority`, `clsx`, `tailwind-merge`), **lucide-react**

Antes de tocar APIs o estructura de App Router, consulta la guía en `node_modules/next/dist/docs/` (Next de este repo puede diferir de versiones anteriores).

## Estructura de rutas (`app/`)

| Grupo | Rol |
|--------|-----|
| `(app)/` | Área autenticada: `search`, `settings` |
| `(auth)/` | Login y registro |
| `(marketing)/` | Landing, pricing |
| `auth/callback/` | OAuth / callback de Supabase |
| `api/proxy/[...path]/` | Proxy de API hacia backend externo |

## Código compartido

- `lib/supabase/` — `client.ts` (navegador), `server.ts` (servidor), `middleware.ts` (middleware Next)
- `components/providers/AuthProvider.tsx` — contexto de sesión
- `components/search/` — formulario de búsqueda, tabla de resultados, exportación, estado
- `hooks/useAdSearch.ts` — lógica de búsqueda en cliente
- `types/index.ts` — tipos compartidos

## Variables de entorno

Definir en `.env.local` (no commitear secretos):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Si faltan, `createClient()` en el navegador lanza error explícito.

## Comandos

```bash
npm run dev    # desarrollo
npm run build  # producción
npm run lint   # eslint
```

## Notas para cambios

- Mantener coherencia con patrones existentes (imports `@/`, nombres de componentes).
- No ampliar el alcance más allá de lo pedido; evitar refactors colaterales.
- Si añades rutas o middleware, revisar flujo de auth Supabase y callbacks.
