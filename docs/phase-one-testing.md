# Phase one: Frappe mobile + web

## Backend and device setup

The existing bench is `/home/frappe/realtime-dev` in Ubuntu WSL, with site
`realtime.local` and app `realtime_marketplace`. Keep `bench start` running.

The mobile integration adds one authenticated endpoint:
`realtime_marketplace.api.mobile.get_session`. Its source is in
`integrations/frappe/mobile.py`, and a copy is installed in the WSL app's
`realtime_marketplace/api/mobile.py`. Copy that file when setting up a fresh
bench. It returns only the caller's session, CSRF token, profile, and summary.
Passwords are checked by Frappe's standard login endpoint. Frappe core and the
Windows web client are not changed.

From the mobile project root on Windows:

```powershell
npm run device
npm start
```

Then, in another terminal:

```powershell
npm run android -- --active-arch-only --no-packager
```

`npm run device` reverses USB ports and starts a loopback-only Windows bridge
for WSL's realtime server. Re-run it whenever you reconnect USB. The bridge
resolves the current WSL IPv4 address; it does not hard-code yesterday's address.
The API uses Windows' existing WSL localhost forwarding on port 8000. The
bridge process's logs are in `%TEMP%/realtime-usb-tunnel*.log`.

Public connection settings live in `src/config/frappe.js`. These localhost HTTP
URLs are for local USB development. A deployed backend needs HTTPS URLs; do not
ship these development settings as a production configuration.

## Your manual buyer/seller check

1. Open the phone app: the splash restores a saved session, otherwise Login opens.
2. Sign in as an existing **buyer**. Home should show the actual Frappe catalog.
3. Check Profile: name, email, roles, and account summary should match Frappe.
4. Open the Windows web app and sign in as a different **seller** who owns one
   of the available products. Mobile and browser sessions are independent.
5. On the phone, choose that seller's product, enter a valid quantity, and place
   an order. The phone opens Orders with its order ID and current status.
6. The web seller should receive the new order automatically.
7. On web, change the order to Confirmed, Packing, Ready for Pickup, Out for
   Delivery, then Delivered. The buyer's phone should update without a pull or
   restart. Check More for each received live event.
8. Optionally reverse the roles: sign in as a seller on mobile, open Orders >
   Seller inbox, and update an assigned order. A web buyer should receive it.
9. Disconnect/reconnect USB or briefly stop the socket server. The status should
   stop claiming to be connected. After `npm run device` and reconnection, the
   app refreshes orders to recover missed events.
10. Relaunch the app to check session restoration. Sign out in Profile and check
    that Android Back cannot reopen the previous account's screens.

## Finding what broke

| What you see                             | What to check                                                                                |
| ---------------------------------------- | -------------------------------------------------------------------------------------------- |
| Login cannot reach Frappe                | Bench HTTP on 8000, USB debugging, `npm run device`                                          |
| HTTP 404 or method missing               | Install the provided `api/mobile.py` in the custom Frappe app                                |
| Login rejected                           | Account/password, account enabled, Frappe password login settings                            |
| Additional authentication step required  | This first-phase screen supports password-only login, not a two-factor challenge             |
| Products empty                           | There must be active products with stock greater than zero in Frappe                         |
| Products load but live status says error | WSL Socket.IO on 9000, USB bridge, namespace `realtime.local`, More > Reconnect              |
| New order missing for seller             | The seller must own that product, and be logged in as that exact account                     |
| Order badge not changing                 | More > Recent live events distinguishes delivery failure from a data-refresh failure         |
| Permission error on update               | Only the assigned seller can update; Delivered/Cancelled orders are closed                   |
| Request timed out while placing an order | Check Orders before retrying: the server may have committed it even if the response was lost |

HTTP failures appear on the affected screen. More shows API and socket errors,
connection state, and the most recent 20 events for the current signed-in
session. Passwords, session IDs, and CSRF tokens are never shown there.

## Phase-one boundaries

- Products, identity, prices, stock display, orders, and statuses come from Frappe.
- The existing product DocType has no image field, so product cards use a neutral
  category illustration. No demo products, ratings, or fabricated images are shown.
- Order events refresh server data. Reconnection/app resume also refreshes data;
  background push notifications are not part of this phase.
- Stock reservation, payment processing, shipping integrations, and stricter
  status-transition rules remain the behavior of the existing backend. This
  phase does not add those workflows.
- Sessions are stored with `react-native-keychain`; passwords are never saved.
- A lost/expired session returns to Login. A temporary server outage during
  restoration offers Retry instead of silently discarding the stored session.

Automated checks: `npm run lint` and `npm test -- --runInBand`. The actual
two-account order/status scenario is intentionally left for your manual test.
