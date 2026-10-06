# Campus Harvest: Food Waste Management System

A college project review app built with **HTML, CSS and vanilla JavaScript**. Its responsive layout uses CSS Grid and Flexbox. Accounts, session state and project records use browser Local Storage.

## Open the app

Open `index.html` in a modern browser. No build step or extra technology is required.

## Demo accounts

Choose the account area on the sign-in page:

- **Admin:** Shravan
- **Email:** `shravan@campus.edu`
- **Password:** `shravan123`
- **Consumer:** Sign up from the sign-in page. Signup only creates Consumer accounts.

The demo loads sample waste, inventory and surplus records the first time it runs. To reset demo data in the browser console:

```js
localStorage.removeItem('campusHarvest.users.v1');
localStorage.removeItem('campusHarvest.session.v1');
localStorage.removeItem('campusHarvest.data.v1');
location.reload();
```

## Modules

### Admin module

- View campus waste, inventory, available surplus and Consumer reports
- Record food waste by type, measured weight and campus location
- Track stock quantities and expiry dates
- Publish safe surplus listings and mark food as collected
- Review Consumer reports
- Edit Consumer names and email addresses, or set a new password

### Consumer module

- Create a separate Consumer account and sign in through the Consumer area
- Browse campus surplus and request a pickup
- Submit observations about waste
- Track submitted reports and pickup requests

## How it works

`index.html` loads the styles and application logic. The selected account area must match the account role during sign-in. JavaScript stores accounts and project data in Local Storage, then shows the corresponding module navigation. Admin accounts are seeded separately; public signup always creates a Consumer account.

## Project review notes

- **Problem:** Campus kitchens and dining halls can overproduce or discard food because demand, stock and leftovers are not tracked consistently.
- **Business system:** Campus food service operations, including administrators, dining staff and Consumers.
- **Prevention approach:** Track waste by source, check expiry dates and make safe surplus visible for pickup.
- **Admin authority:** The Admin can update Consumer profile details and reset Consumer passwords.
- **Local Storage keys:** `campusHarvest.users.v1`, `campusHarvest.session.v1`, and `campusHarvest.data.v1`.

## Demo limitation

Local Storage is specific to one browser and does not synchronize data across devices. This classroom implementation stores demo passwords in the browser and does not provide production security. Use fictional details only.
