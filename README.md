#  AtlasFX API

**AtlasFX** is a multi-currency wallet and FX trading backend built with **NestJS**, **TypeORM**, and **PostgreSQL**.

It enables users to:

* Register with OTP verification
* Manage multi-currency wallets
* Fund and convert currencies
* Execute FX trades (NGN → foreign currencies)
* Retrieve real-time exchange rates
* Track transaction history

---

#  Tech Stack

* **Framework:** NestJS
* **ORM:** TypeORM
* **Database:** PostgreSQL
* **Authentication:** JWT + OTP (Email Verification)
* **Architecture:** Modular (Domain-driven)

---

#  Project Structure

```
src
│
├── config
│   ├── database.config.ts
│   ├── jwt.config.ts
│
├── modules
│   ├── auth
│   ├── users
│   ├── wallets
│   ├── trades
│   ├── transactions
│   ├── fx
│
├── common
│   ├── decorators
│   ├── guards
│   ├── filters
│
├── app.module.ts
└── main.ts
```

---

# ⚙️ Installation

```bash
git clone <https://github.com/oduyemi/AtlasFXbackend>
cd AtlaFXbackend

npm install
```

---

# ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=atlasdb

JWT_SECRET=syour-upersecret
JWT_EXPIRES_IN=1d

OTP_EXPIRY_MINUTES=5

EMAIL=your-gmail-address
EMAIL_PASS=your-app-password
```

---

# ▶️ Running the App

```bash
npm run start:dev
```

App runs at:

```
http://localhost:3000
```

---

# Supported Currencies

The system supports a predefined set:

```
NGN, USD, EUR, GBP, AED
```

---

# 🔐 Authentication Flow

### 1. Register

```
POST /auth/register
```

Registers user and sends OTP (6-digit, expires in 5 minutes).

```json
{
  "fname": "Yem",
  "lname": "Yem",
  "email": "yhermii@gmail.com",
  "password": "12345678",
  "confirmPassword": "12345678"
}
```

---

### 2. Verify OTP

```
POST /auth/verify
```

```json
{
  "email": "yhermii@gmail.com",
  "otp": "447956"
}
```

---

### 3. Complete Registration

```
POST /auth/complete-registration
```

User selects currencies → wallet is created automatically.

```json
{
  "email": "yhermii@gmail.com",
  "primaryCurrency": "NGN",
  "otherCurrencies": ["USD", "EUR"]
}
```

---

### 4. Login

```
POST /auth/login
```

```json
{
  "email": "yhermii@gmail.com",
  "password": "12345678"
}
```

Returns JWT token

---

#  Authorization

All protected routes require:

```
Authorization: Bearer <token>
```

---

#  Wallet Endpoints

---

##  Get Wallet

```
GET /wallet
```

Returns user wallet balances.

---

##  Fund Wallet

```
POST /wallet/fund
```

```json
{
  "currency": "NGN",
  "amount": 300000
}
```

---

##  Convert Currency (Flexible)

```
POST /wallet/convert
```

Convert between any currencies.

```json
{
  "from": "USD",
  "to": "EUR",
  "amount": 5
}
```

---

## Trade (NGN → Foreign Currency)

```
POST /wallet/trade
```

```json
{
  "toCurrency": "USD",
  "amount": 100000
}
```

---

# Trade Execution Flow

```
POST /wallet/trade
   ↓
TradesService.executeTrade()
   ↓
1. Fetch FX rate
2. Debit NGN wallet
3. Credit target currency
4. Save trade record
```

---

## Internal Logic

### Step 1 — Get FX Rate

```ts
const rate = await this.fxService.getRate(from, to);
```

---

### Step 2 — Convert Amount

```ts
const convertedAmount = amount * rate;
```

---

### Step 3 — Debit Source

```ts
await this.walletService.debit(userId, from, amount);
```

---

### Step 4 — Credit Destination

```ts
await this.walletService.credit(userId, to, convertedAmount);
```

---

### Step 5 — Persist Trade

```ts
return this.tradeRepository.save(trade);
```

---

## Example Response

```json
{
  "tradeId": 1,
  "from": "NGN",
  "to": "USD",
  "amount": 100000,
  "convertedAmount": 72.735,
  "rate": 0.00072735,
  "status": "SUCCESS"
}
```

---

# FX Endpoints

---

## Get Exchange Rates

```
GET /fx/rates?to=USD
```

Returns current exchange rates.

---

# Transactions

---

## Get Transaction History

```
GET /transactions
```

Returns:

* deposits
* conversions
* trades

---

# Wallet System Design

Each user has:

```
1 Wallet
   ├── Primary Currency
   ├── Secondary Currency
   ├── Tertiary Currency
```

Each wallet contains multiple balances:

```
Wallet
 ├── NGN balance
 ├── USD balance
 ├── EUR balance
```

---

# Conversion Types

AtlasFX supports **two conversion flows**:

---

## 1. `/wallet/trade`

* Only: **NGN → Foreign currency**
* Used for trading
* Logged as a **trade**

---

## 2. `/wallet/convert`

* Any currency → any currency
* Internal FX conversion
* Logged as a **transaction**

---

# Architecture Highlights

* Modular NestJS design
* Transaction-safe wallet operations
* FX rate caching
* Secure JWT authentication
* Clean separation of concerns
* Reusable decorators & guards
* Global error handling

---

# Testing

Run tests:

```bash
npm run test
```

Includes:

* Unit tests (controllers/services)
* Mocked dependencies
* Isolated business logic

---

# 🛡️ Security

* JWT authentication
* Password hashing (bcrypt)
* OTP verification system
* Guard-based route protection
* No userId trust from client (derived from token)

---

# Future Improvements

* Swagger API documentation
* Rate limiting (auth endpoints)
* Redis caching for FX rates
* WebSocket live rates
* Audit logs
* Role-based access control (RBAC)

---

# 👨‍💻 Author

**Opeyemi Oduyemi – Technical Assessment Submission**
