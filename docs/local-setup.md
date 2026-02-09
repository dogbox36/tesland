# Tesland - Local Development Setup (Docker nélkül)

Ez a dokumentum lépésről lépésre végigvezet a fejlesztői környezet beállításán Windows és macOS rendszereken. Mivel **NEM használunk Dockert**, minden szolgáltatást natívan kell telepíteni.

## Előfeltételek (Prerequisites)

### 1. Node.js & pnpm
- **Node.js**: v18 vagy újabb (LTS ajánlott).
  - Letöltés: [nodejs.org](https://nodejs.org/)
- **pnpm**: Csomagkezelő.
  - Telepítés: `npm install -g pnpm`
  - Ellenőrzés: `pnpm -v`

### 2. Adatbázis (PostgreSQL)
- **Letöltés**: [postgresql.org](https://www.postgresql.org/download/)
- **Telepítés**:
  - Windows: A telepítő végén a Stack Builder-t nem kötelező futtatni.
  - macOS: [Postgres.app](https://postgresapp.com/) a legegyszerűbb.
- **Konfiguráció**:
  - Jegyezd meg a `postgres` felhasználó jelszavát!
  - Hozd létre a `tesland` adatbázist:
    ```bash
    # Parancssorból (psql)
    psql -U postgres
    CREATE DATABASE tesland;
    \q
    ```

### 3. Redis (Opcionális az elején, később kell)
- **Windows**: [Memurai](https://www.memurai.com/) (Developer Edition ingyenes) vagy WSL2-ben Redis.
- **macOS**: `brew install redis` -> `brew services start redis`

## Telepítés (Setup)

1.  **Klónozd a repót**:
    ```bash
    git clone https://github.com/your-username/tesland.git
    cd tesland
    ```

2.  **Környezeti változók**:
    - Másold át a `.env.example`-t `.env`-re.
    ```bash
    cp .env.example .env
    ```
    - Szerkeszd a `.env` fájlt, és írd be a DB jelszavadat!

3.  **Függőségek és Init**:
    - **Windows**: Futtasd a `scripts/setup.bat`-ot.
    - **macOS/Linux**:
      ```bash
      pnpm install
      pnpm db:generate
      pnpm build
      ```

## Fejlesztés Indítása (Run)

Indítsd el az összes alkalmazást fejlesztői módban:

```bash
pnpm dev
```

Ez elindítja a Turborepo-t, ami párhuzamosan futtatja:
- Web: http://localhost:3000
- Admin: http://localhost:3001
- API: http://localhost:3002

## Adatbázis Kezelés

- **Migráció futtatása** (ha változott a schema):
  ```bash
  pnpm db:push
  ```
- **Prisma Studio** (GUI az adatbázishoz):
  ```bash
  pnpm prisma studio
  ```
