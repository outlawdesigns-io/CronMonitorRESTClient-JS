# CronMonitor REST Client (JavaScript)

A lightweight JavaScript/Node.js client for interacting with the [CronMonitor API](https://github.com/outlawdesigns-io/CronMonitorREST) using OAuth2 authentication.  
This package handles token management, refresh logic, and exposes convenient model-based accessors for CronMonitor’s REST resources.

---

## 🚀 Features

- 🔐 **OAuth2-ready** — built on `@outlawdesigns/authenticationclient` for seamless token handling.
- ⚙️ **Automatic refresh** — automatically refreshes access tokens when nearing expiration.
- 📦 **Modular API design** — access CronMonitor resources via organized model endpoints:
  - `jobs`
  - `executions`
  - `subscriptions`
  - `events`
- 🧩 **Singleton mode** — safely initialize a single client instance app-wide.

---

## 📦 Installation

```bash
npm install @outlawdesigns/cronmonitor-rest-client
```

---

## 🧠 Basic Usage

### Initialize the API Client

```js
import client from '@outlawdesigns/cronmonitor-rest-client';

// Initialize once with your API base URL
const api = client.init('https://api.cronmonitor.io');

// Authenticate using your preferred OAuth2 flow
await api.auth.authenticate('your-client-id', 'your-client-secret', 'openid profile');

// Now you can access any CronMonitor resource
const jobs = await api.jobs.list();
console.log(jobs);
```

### Singleton Access

Once initialized, you can retrieve the same instance anywhere else:

```js
import client from '@outlawdesigns/cronmonitor-rest-client';

const api = client.get();
const job = await api.jobs.getById('12345');
```

---

## 🔐 Authentication Flow

This client relies on `@outlawdesigns/authenticationclient` for managing OAuth2 tokens.

Internally:
1. The `authClient` instance stores and updates the current access/refresh tokens.
2. `axios` interceptors automatically attach `Authorization: Bearer <token>` headers.
3. Tokens nearing expiration (within 300 seconds) are automatically refreshed.

You must authenticate once before making API calls:

```js
await api.auth.authenticate('client-id', 'client-secret', 'scope');
```

If the token expires or refresh fails, the client will throw an authentication error.

---

## 🧩 Available Modules

Each model is an isolated API wrapper around the CronMonitor REST endpoints.

| Module | Description |
|:-------|:-------------|
| `api.jobs` | Create, list, update, and delete cron jobs. |
| `api.executions` | Retrieve and manage job execution logs. |
| `api.subscriptions` | Manage webhook subscriptions for events. |
| `api.events` | Access event history and related data. |

Each module uses the same `axios` instance and respects the current authentication context.

---

## 🧱 Project Structure

```
src/
├── core.js           # Creates API client and sets up OAuth handling
├── singleton.js      # Ensures a single initialized client instance
├── models/
│   ├── job.js
│   ├── execution.js
│   ├── subscription.js
│   └── event.js
└── formData.js       # (optional utility for form serialization)
```

---

## ⚙️ API Client Factory

You can also bypass the singleton and create a client directly:

```js
import { createApiClient } from '@outlawdesigns/cronmonitor-rest-client/core.js';

const api = createApiClient('https://api.cronmonitor.io', 'openid profile');
await api.auth.authenticate(...);
```

---

## 🧾 License

This project is licensed under the [ISC License](./LICENSE).

---

## 👤 Author

Maintained by **Outlaw Designs**  
[https://github.com/outlawdesigns-io](https://github.com/outlawdesigns-io)
