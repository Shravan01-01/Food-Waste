# Campus Harvest: Food Waste Management System

A college project review app built with **HTML, CSS and vanilla JavaScript**. Its responsive layout uses CSS Grid and Flexbox. Accounts, session state and project records use browser Local Storage.

## Open the app

Open `index.html` in a modern browser. No build step or extra technology is required.

## Demo accounts

Choose **Log in as** on the sign-in page:

- **Admin:** Shravan
- **Email:** `shravan@gmail.com`
- **Password:** `shravan123`
- **User:** Sign up from the sign-in page. Signup only creates User accounts.

The sign-in page has **Forgot password?** for both account types. In this classroom demo, enter the account type and email, then set a new password. The app changes the saved password in this browser only. It does not send a verification email.

The demo loads sample waste, inventory and surplus records the first time it runs. To reset demo data in the browser console:

```js
localStorage.removeItem('campusHarvest.users.v1');
localStorage.removeItem('campusHarvest.session.v1');
localStorage.removeItem('campusHarvest.data.v1');
location.reload();
```

## Modules

### Admin module

- View campus waste, inventory, available surplus and User reports
- Record food waste by type, measured weight and campus location
- Track stock quantities and expiry dates
- Publish safe surplus listings and mark food as collected
- Review User reports
- Edit User names and email addresses, or set a new password

### User module

- Create a separate User account and sign in through the User area
- Browse campus surplus and request a pickup
- Submit observations about waste
- Track submitted reports and pickup requests

## How it works

`index.html` loads the styles and application logic. The selected account type must match the account role during sign-in. JavaScript stores accounts and project data in Local Storage, then shows the corresponding module navigation. Admin accounts are seeded separately; public signup always creates a User account.

## Project review notes

- **Problem:** Campus kitchens and dining halls can overproduce or discard food because demand, stock and leftovers are not tracked consistently.
- **Business system:** Campus food service operations, including administrators, dining staff and Users.
- **Prevention approach:** Track waste by source, check expiry dates and make safe surplus visible for pickup.
- **Admin authority:** The Admin can update User profile details and reset User passwords.
- **Local Storage keys:** `campusHarvest.users.v1`, `campusHarvest.session.v1`, and `campusHarvest.data.v1`.

## Demo limitation

Local Storage is specific to one browser and does not synchronize data across devices. The reset flow is not identity-verified, and the app stores demo passwords in the browser. This classroom implementation is not for real accounts or sensitive information. Use fictional details only.
