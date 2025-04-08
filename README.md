# # 🏃‍♂️ Betcha - Run. Bet. Win.

**Betcha** is a fun and social **Web3 running bet app** where you and your friends can **place friendly crypto bets** on fitness challenges — powered by **Strava**, **Polygon**, and **signed run proofs**.

> 💪 Stay fit. 💬 Challenge friends. 💰 Win crypto.

---

## 🚀 Features

- 🏃 Connect your **Strava** account
- 🤝 Challenge friends to run-based bets
- 💸 Place **crypto bets** on Polygon
- 🔐 Runs verified via **Strava Webhooks + signed data**
- 🏆 Winner gets the reward pot

---

## 🛠 Tech Stack

| Layer         | Tech                                       |
|---------------|--------------------------------------------|
| Frontend      | TypeScript, Next.js                        |
| Backend       | Node.js, Express                           |
| Blockchain    | Smart Contracts on **Polygon**             |
| Fitness Data  | [Strava API + Webhooks]                    |
| Auth          | OAuth2 (Strava Login)                      |
| Verification  | **Webhook + Signature-based proof system** |

---

## 🔁 How It Works

1. **Login** with your Strava account.
2. **Create or join** a run challenge with friends.
3. **Place your bet** using crypto (MATIC, etc).
4. Go run 🏃 — your activity is tracked by Strava.
5. A **Strava webhook** is triggered when your run is complete.
6. Backend signs + verifies the run data.
7. **Smart contract** distributes rewards based on verified results.

---

## 📦 Getting Started

```bash
git clone https://github.com/your-username/betcha.git
cd betcha
pnpm install
pnpm dev
