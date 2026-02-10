# Tesland - Tesla Service & Shop Platform

Ez a projekt egy komplex webes és mobil platform Tesla tulajdonosok számára, amely egy webshopot, szerviz időpontfoglaló rendszert és árajánlatkérő modult tartalmaz.

## 🏗 Architektúra

A projekt egy Monorepo (pnpm workspace) struktúrát használ:

- **apps/api**: NestJS alapú backend API (PostgreSQL database, Prisma ORM).
- **apps/web**: Next.js (App Router) alapú publikus weboldal (Webshop, Landing, User profile).
- **apps/admin**: Next.js alapú adminisztrációs felület (Termékek, Foglalások kezelése).
- **apps/mobile**: Expo (React Native) mobilalkalmazás (iOS/Android).
- **packages/database**: Prisma schema és kliens megosztott csomag.
- **packages/dto**: Megosztott TypeScript DTO-k a frontend és backend között.

## 🚀 Telepítés és Futtatás

### Előfeltételek
- Node.js (v18+)
- pnpm (v8+)
- PostgreSQL adatbázis
- Expo Go alkalmazás (mobil teszteléshez)

### 1. Repository klónozása és függőségek telepítése
```bash
git clone <repo-url>
cd tesland
pnpm install
```

### 2. Környezeti változók beállítása
Másold át a `.env.example`-t `.env`-re a gyökérkönyvtárban és az egyes appokban, majd töltsd ki a megfelelő értékekkel (adatbázis URL, JWT titkok).

```bash
# Adatbázis URL példa
DATABASE_URL="postgresql://user:password@localhost:5432/tesland?schema=public"
```

### 3. Adatbázis inicializálás
```bash
# Adatbázis séma pusholása
pnpm db:push

# (Opcionális) Seed adatok feltöltése
pnpm db:seed
```

### 4. Fejlesztői környezet indítása
Ez a parancs elindítja az összes alkalmazást (API, Web, Admin) párhuzamosan.
```bash
pnpm dev
# Vagy: npm run dev
```

- **API**: http://localhost:4002
- **Web**: http://localhost:4000
- **Admin**: http://localhost:4001

### 5. Mobil alkalmazás indítása
Külön terminálban:
```bash
cd apps/mobile
npx expo start -c
```
Olvasd be a QR kádot az Expo Go alkalmazással (Android) vagy a Camera appal (iOS).

> **Fontos:** A mobil appnak el kell érnie a backendet. Ellenőrizd az `apps/mobile/lib/api.tsx` fájlt, és állítsd be a géped helyi IP címét (pl. `http://192.168.1.X:4002`).

## 🛡 Biztonság (Hardening)

A backend (`apps/api`) a következő védelmi mechanizmusokkal rendelkezik:
- **Helmet**: HTTP header biztonság.
- **Throttler**: Rate limiting (DDoS védelem) - alapértelmezetten 10 kérés / 60mp.
- **CORS**: Szigorított Origin beállítások (csak a frontendek és a lokális hálózat IP címei engedélyezettek).
- **JWT Auth**: Biztonságos token alapú hitelesítés `httpOnly` cookie támogatással (opcionális) vagy Bearer tokenként.

## 📱 Mobil App (NativeWind v4)
A mobil app **NativeWind v4**-et használ a stílusozáshoz (Tailwind CSS React Native-ban).
- `global.css`: Tailwind direktívák.
- `babel.config.js`: Reanimated plugin és NativeWind preset.
- `metro.config.js`: CSS interop beállítások.

## 📦 Deployment (Irányelvek)

### Backend (API)
Docker konténerbe csomagolva futtatható (pl. Railway, Render, VPS).
`Dockerfile` létrehozása szükséges az `apps/api` számára.

### Web & Admin
Vercel-re optimalizálva. A Monorepo támogatás miatt a `Root Directory`-t állítsd az adott app mappájára (`apps/web` vagy `apps/admin`).

### Mobile
Expo EAS Build segítségével készíthető `apk` vagy `ipa` fájl.
```bash
eas build -p android --profile preview
```
