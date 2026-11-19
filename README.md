# olive-mill-monitoring-platform
Piattaforma web per monitorare un frantoio di olio EVO dal punto di vista economico, operativo e della sostenibilità: dati simulati delle macchine e KPI su fermi, efficienza, CO₂ e sottoprodotti.

**Demo online:** https://frantoi-in-evoluzione.up.railway.app

## Requisiti

- Java 21 (JDK)
- Node.js 20.19 o superiore (testato con Node 24.14 e npm 11.9)
- PostgreSQL (testato con la versione 18), in ascolto sulla porta 5432 con l'utente `postgres`

Maven non va installato: il back end usa il Maven Wrapper incluso nel progetto (`mvnw`).

I comandi sono indicati per il Terminale di macOS/Linux e per PowerShell su Windows.

## 1. Clonare il repository

```bash
git clone https://github.com/miri993/olive-mill-monitoring-platform.git
cd olive-mill-monitoring-platform
```

## 2. Creare il database

```bash
createdb -U postgres smart_olive_mill
```

Se il comando `createdb` non viene trovato (su Windows non sempre è nel PATH), il database `smart_olive_mill` si può creare da pgAdmin: tasto destro su Databases > Create > Database.

Le tabelle non vanno create a mano: le crea Hibernate al primo avvio del back end.

## 3. Avviare il back end (porta 8080)

La password dell'utente `postgres` si passa con la variabile d'ambiente `DB_PASSWORD`.

macOS/Linux:

```bash
cd backend
export DB_PASSWORD=la_tua_password
./mvnw spring-boot:run
```

Windows (PowerShell):

```powershell
cd backend
$env:DB_PASSWORD="la_tua_password"
.\mvnw.cmd spring-boot:run
```

Al primo avvio, se il database è vuoto, il back end genera automaticamente la campagna simulata (15/10/2025 - 15/12/2025, seed 2026) e salva i KPI. Nel log compare la riga `Database vuoto: campagna simulata generata con seed 2026`. Agli avvii successivi i dati esistenti non vengono modificati.

## 4. Avviare il front end (porta 5173)

In un secondo terminale, dalla cartella principale del progetto:

```bash
cd frontend
npm install
npm run dev
```

La dashboard è raggiungibile su http://localhost:5173. Le chiamate a `/api` vengono inoltrate al back end su http://localhost:8080.

## 5. Test funzionali

Con il back end avviato, la collezione Postman nella cartella `postman` si può eseguire da terminale con Newman, senza installare Postman:

```bash
npx newman run postman/smart-olive-mill.postman_collection.json
```

La collezione contiene 13 richieste, una o più per ogni endpoint, con 21 controlli su codici di risposta e contenuto. La richiesta di generazione ricrea la campagna con seed 2026; il test sul parametro "Prezzo olio EVO" lo modifica e poi lo riporta al valore iniziale (9,5 €/L).

Il file `excel/dati-simulati-frantoio.xlsx` contiene i dati della campagna simulata e, nel foglio `Verifica_KPI`, il confronto tra i KPI calcolati in Excel e quelli restituiti dal back end.

## Endpoint principali

| Metodo | Endpoint | Descrizione |
|---|---|---|
| GET | /api/kpi/campaign | KPI dell'intera campagna |
| GET | /api/kpi/daily | KPI giorno per giorno |
| GET | /api/kpi | Storico dei KPI salvati |
| POST | /api/kpi/campaign | Ricalcola e salva i KPI |
| GET | /api/machines | Macchinari |
| GET | /api/production | Produzione giornaliera |
| GET | /api/downtimes | Fermi macchina |
| GET | /api/by-products | Sottoprodotti |
| GET | /api/parameters | Parametri economici |
| PUT | /api/parameters/{id} | Aggiorna il valore di un parametro, body `{"value": 10.5}` |
| POST | /api/simulation/generate?seed=2026 | Rigenera la campagna simulata e salva i KPI |
