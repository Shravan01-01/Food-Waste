# Campus Harvest: Food Waste Management System

A college project review demo built with **HTML, CSS and vanilla JavaScript only**. The UI uses CSS Grid and Flexbox. The app stores accounts, session state and project records in the browser's Local Storage.

## Run the application

Open `index.html` in a modern browser. No server, package manager or build step is required.

## Demo sign-in

- **Admin:** `admin@campus.edu`
- **Password:** `admin123`
- **User:** Create a student account from the sign-in screen. Signup assigns the User role.

The demo initializes example waste, inventory and surplus records on first use. Use **Reset demo data** in the browser developer console if needed:

```js
localStorage.removeItem('campusHarvest.users.v1');
localStorage.removeItem('campusHarvest.session.v1');
localStorage.removeItem('campusHarvest.data.v1');
location.reload();
```

## Modules

### Admin

- Overview of logged waste, tracked inventory, active surplus listings and student reports
- Add measured waste entries by category and dining location
- Track food quantities and expiry dates, remove inventory items
- Publish surplus listings and mark food as collected
- Review student waste observations

### User

- Signup and login with role-based navigation
- View active campus surplus and request pickup
- Submit observations about waste sources
- Track the status of submitted reports and pickup requests

## Application flow

`index.html` loads `styles.css` and `app.js`. JavaScript authenticates accounts from Local Storage, saves the active session, selects the Admin or User navigation from that session, and routes between modules with the URL hash. Each form validates its fields before updating shared Local Storage records.

## Project review talking points

- **Problem:** Kitchens and dining halls can overproduce or discard food because demand, inventory and leftovers are not tracked consistently.
- **Business system:** Campus food service operations, including kitchen staff, administrators and student diners.
- **Prevention focus:** Demand-informed planning, expiry checks, measurement by source and timely surplus visibility help teams spot avoidable loss.
- **Data model:** `users`, `session`, and `data` Local Storage keys hold account, authentication and application records.
- **Navigation:** The signed-in role controls which module links and screens the application renders.
- **Limitations:** Local Storage is specific to one browser and is not secure for real credentials or shared multi-device use. This implementation meets the project technology constraint for a classroom demonstration, but should not be used for production authentication or sensitive personal data.

## GitHub submission

Create a GitHub repository, then run these commands from this folder:

```sh
git init
git add index.html styles.css app.js README.md
git commit -m "Build campus food waste management system"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
