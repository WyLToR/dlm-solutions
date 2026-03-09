# DLM Solutions - Próbafeladat dokumentáció

## Tech stack

Frontend

- Vue 3
- Vite
- Vue Router

Backend

- ASP.NET Web API (.NET 10)
- Entity Framework Core
- JWT Authentication

Database

- MySQL

Deployment

- Render
- Docker

## Rövid összefoglaló

Ez a repository egy monorepo felépítésű, teljes stack webalkalmazást tartalmaz:

- frontend: Vue.js 3 + Vite
- backend: ASP.NET Web API (.NET 10)
- adatbázis: MySQL (külső szolgáltatás, pl. Aiven)

Az alkalmazás célja egy bejelentkezés után elérhető termékkezelő felület biztosítása táblázatos listával és CRUD műveletekkel.

## Próbafeladat elvárások és teljesítés

Az elvárás szerint a fókusz a funkciók elkészítésén volt:

> „Nem várunk tökéletes, hibamentes megoldást, inkább több funkció készüljön el, ahelyett, hogy egy hiba miatt elakad a fejlesztés.”

### Frontend elvárás

- Vue.js 3 alapú webes alkalmazás: **teljesítve**
- Login oldal: **teljesítve**
- Sikeres login utáni átirányítás listára: **teljesítve**
- Táblázatos terméklista (cikkszám, név, leírás, ár): **teljesítve**
- Termék szerkesztés formon: **teljesítve**
- Termék törlés: **teljesítve** (megerősítéssel)
- Új termék felvitele formon: **teljesítve**

### Backend elvárás

- ASP.NET Web API, .NET 10: **teljesítve**
- REST API + JSON kommunikáció: **teljesítve**

### Adatbázis elvárás

- Terméklista adatbázisból: **teljesítve**
- Adatbázis típus: MySQL: **teljesítve**

### Publikálás elvárás

- Kód repositoryban: **teljesítve**
- Hostolt, működő alkalmazás: **teljesítve**

## Elérhetőség

- Hostolt URL: `https://dlm-solutions.onrender.com/`
- Belépési adat:
  - user: `admin`
  - password: `admin`

## Felépítés (struktúra)

```text
dlm-solutions/
  backend/                      # ASP.NET 10 API
    Controllers/                # Auth, Products
    Services/                   # üzleti logika
    DTOs/                       # request/response modellek
    Data/                       # DbContext
    Models/                     # User, Product
  frontend/                     # Vue 3 alkalmazás
    src/pages/auth/             # login oldal
    src/pages/private/          # auth védett oldalak (products)
    src/services/               # API kliensek
    src/store/                  # auth state
    src/router.ts               # route-ok + auth guard
  Dockerfile                    # single-service Render build
  render.yaml                   # Render deploy blueprint
```

## Architektúra

Render free tier miatt a rendszer egyetlen szolgáltatásként fut:

- a frontend buildelt statikus fájljait a .NET backend szolgálja ki
- API útvonalak `/api/...` alatt maradnak
- SPA fallback biztosított (frissítésnél nincs 404 az auth route-okon)
- frontend productionben relatív `/api` hívásokat használ

## Adatmodell

### User

| mező         | típus  |
| ------------ | ------ |
| Id           | int    |
| Username     | string |
| PasswordHash | string |

### Product

| mező          | típus   |
| ------------- | ------- |
| Id            | int     |
| ArticleNumber | string  |
| Name          | string  |
| Description   | string  |
| Price         | decimal |
| UserId        | int     |

Kapcsolat:

- Egy felhasználó több terméket kezelhet (1:N kapcsolat).

## Funkcionális áttekintés

### Auth folyamat

1. Login oldal betölt.
2. A backend JWT tokent ad vissza sikeres hitelesítés után.
3. A frontend a tokent tárolja, és minden API kérésnél `Authorization: Bearer` headerben küldi.
4. A backend `[Authorize]` attribútummal védi az endpointokat.
5. A Products endpointok csak a bejelentkezett felhasználó saját rekordjait adják vissza.

### Product modul

- Lista oldal: táblázatos megjelenítés
- Új termék létrehozás
- Termék szerkesztés (`/auth/products/update/:id`)
- Termék megtekintés (`/auth/products/view/:id`)
- Törlés megerősítéssel

### Validációk

- Név kötelező
- Leírás kötelező
- Ár nem lehet negatív

## API végpontok (röviden)

- `POST /api/Auth/login`
- `POST /api/Auth/register`
- `GET /api/Products`
- `GET /api/Products/{id}`
- `POST /api/Products`
- `PUT /api/Products/{id}`
- `DELETE /api/Products/{id}`
- `GET /api/health`

## Konfiguráció (ENV)

A projekt root `.env` fájlból is tud lokálisan dolgozni (ugyanazokkal a kulcsokkal, mint Render):

```env
ASPNETCORE_ENVIRONMENT=Development
PORT=5190
Jwt__Key=...
ConnectionStrings__DefaultConnection=Server=...;Port=...;Database=...;User Id=...;Password=...;SslMode=Required;
VITE_API_URL=http://localhost:5190
```

Ajánlott indulás:

1. `cp .env.example .env`
2. `.env` kitöltése saját adatokkal

## Lokális futtatás

### Backend

```bash
cd backend
dotnet run --launch-profile http
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Deploy (Render) röviden

1. Git repository csatlakoztatása Renderhez
2. Docker runtime + `render.yaml` használata
3. Env változók beállítása Renderen:
   - `Jwt__Key`
   - `ConnectionStrings__DefaultConnection`
4. Health check: `/api/health`

## AI használat

A fejlesztés során AI eszközöket fejlesztési asszisztensként használtam (pl. ötleteléshez, hibakeresési irányokhoz vagy dokumentáció ellenőrzéséhez).

A konkrét implementáció, az architektúra kialakítása, valamint az integráció és tesztelés minden esetben manuálisan történt.

## Tanulási háttér / forrás

A fejlesztés során támaszkodtam a korábban elvégzett Vue képzésre:

- Udemy: Vue.js - The Complete Guide (https://www.udemy.com/course/vuejs-2-the-complete-guide/)
- Udemy: Ultimate C# Masterclass (https://www.udemy.com/course/ultimate-csharp-masterclass/)

A kurzusok főként a komponensalapú gondolkodást, routing és űrlapkezelési mintákat, valamint a C# / .NET backend szemléletet erősítették.  
A konkrét implementáció a jelen projekt igényeire és Vue 3 + ASP.NET 10 környezetre lett adaptálva.

## Megjegyzés

A fejlesztés során a hangsúly a feladatkiírásnak megfelelően a funkciók minél nagyobb lefedettségén volt, nem a tökéletesen véglegesített enterprise környezeten.

## További megjegyzések

### Ismert korlátok

- Render free tier esetén inaktivitás után cold start előfordulhat.
- A bejelentkezési adatok demó jellegűek (`admin/admin`), nem éles használatra valók.
- A jelenlegi session megoldás demó fókuszú, nem teljes körű enterprise auth modell.

### Biztonsági megjegyzések

- Minden érzékeny adat (`Jwt__Key`, DB kapcsolat) kizárólag környezeti változóban tárolandó.
- Éles környezetben erős jelszópolitika, felhasználókezelés és jogosultsági szintek szükségesek.
- Publikus hostolásnál javasolt további hardening (rate limit, részletes audit, stb.).

### Tesztelés

- Manuálisan ellenőrzött fő folyamatok: login, route guard, termék CRUD, auth route frissítés.
- Automatizált tesztek (unit/integration/e2e) jelenleg nincsenek teljes körűen kiépítve.

### Jövőbeli fejlesztési irányok

- Szerveroldali lapozás/szűrés/rendezés nagyobb terméklistákhoz.
- Részletesebb hibakezelés és felhasználói visszajelzés.
- Erősebb auth modell (pl. refresh token, biztonságosabb cookie stratégia).
- CI/CD és automatizált teszt pipeline bővítése.

### Technikai döntések röviden

- Egy szolgáltatásos (single-service) deployment került kialakításra Render free tierhez.
- Frontend productionben relatív `/api` hívásokat használ, így nincs külön origin/CORS igény.
- Adatbázisként MySQL került használatra (külső szolgáltatóval), a feladatkiírás szerint.
