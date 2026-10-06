/* Campus Harvest | SDC Project Review-1 demonstration app
   Built with plain HTML, CSS and JavaScript. Demo records and accounts use Local Storage. */
(() => {
  'use strict';

  const KEYS = { users: 'campusHarvest.users.v1', session: 'campusHarvest.session.v1', data: 'campusHarvest.data.v1' };
  const $ = (selector, root = document) => root.querySelector(selector);
  const app = $('#app');
  const today = () => new Date().toISOString().slice(0, 10);
  const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  const read = (key, fallback) => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const esc = (value = '') => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  const formatDate = value => value ? new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const current = () => read(KEYS.session, null);

  function initialize() {
    let users = read(KEYS.users, null);
    if (!users) users = [{ id: 'admin-demo', name: 'Shravan', email: 'shravan@campus.edu', password: 'shravan123', role: 'admin' }];
    users = users.map(user => {
      if (user.id === 'admin-demo' || (user.role === 'admin' && user.email === 'admin@campus.edu')) {
        return { ...user, name: 'Shravan', email: 'shravan@campus.edu', password: 'shravan123', role: 'admin' };
      }
      return { ...user, role: user.role === 'user' ? 'consumer' : user.role };
    });
    write(KEYS.users, users);
    const session = current();
    const activeAccount = session && users.find(user => user.id === session.id);
    if (activeAccount) write(KEYS.session, { id: activeAccount.id, name: activeAccount.name, email: activeAccount.email, role: activeAccount.role });
    if (!read(KEYS.data, null)) {
      write(KEYS.data, {
        waste: [
          { id: uid(), item: 'Cooked rice', category: 'Kitchen surplus', kg: 4.2, location: 'Main Dining Hall', date: today(), source: 'Admin', status: 'Recorded' },
          { id: uid(), item: 'Vegetable peels', category: 'Preparation scraps', kg: 2.8, location: 'Main Dining Hall', date: today(), source: 'Admin', status: 'Composted' },
          { id: uid(), item: 'Uneaten lunch', category: 'Plate waste', kg: 3.1, location: 'North Canteen', date: today(), source: 'Admin', status: 'Recorded' }
        ],
        inventory: [
          { id: uid(), name: 'Fresh tomatoes', quantity: 12, unit: 'kg', expiry: today(), location: 'Kitchen Store' },
          { id: uid(), name: 'Whole wheat bread', quantity: 18, unit: 'packs', expiry: today(), location: 'North Canteen' },
          { id: uid(), name: 'Milk cartons', quantity: 24, unit: 'units', expiry: today(), location: 'Kitchen Store' }
        ],
        surplus: [
          { id: uid(), item: 'Sealed fruit cups', quantity: 14, unit: 'servings', location: 'Student Dining Hall', available: today(), bestBefore: today(), notes: 'Unopened portions, kept chilled.', claims: [], status: 'Available' },
          { id: uid(), item: 'Fresh bread rolls', quantity: 20, unit: 'pieces', location: 'North Canteen', available: today(), bestBefore: today(), notes: 'Stored in sealed food-safe container.', claims: [], status: 'Available' }
        ],
        reports: []
      });
    }
  }

  const getUsers = () => read(KEYS.users, []);
  const getData = () => read(KEYS.data, { waste: [], inventory: [], surplus: [], reports: [] });
  const saveData = data => write(KEYS.data, data);
  const setNotice = (form, text, type = 'error') => {
    let box = $('.notice', form);
    if (!box) { box = document.createElement('div'); box.className = 'notice'; form.prepend(box); }
    box.className = `notice ${type}`;
    box.textContent = text;
  };
  const toast = message => {
    $('.toast')?.remove();
    const el = document.createElement('div'); el.className = 'toast'; el.textContent = message;
    document.body.append(el); setTimeout(() => el.remove(), 2800);
  };
  const setRoute = route => { location.hash = route; };

  function renderAuth(mode = 'login') {
    const signup = mode === 'signup';
    app.innerHTML = `
      <main class="auth-shell">
        <section class="auth-visual">
          <div class="brand"><span class="brand-mark">✳</span><span>Campus Harvest</span></div>
          <div class="auth-copy">
            <div class="eyebrow">Campus food waste management</div>
            <h1>Good food<br>deserves a plan.</h1>
            <p>Track kitchen waste, prevent avoidable surplus and connect safe extra food with people on campus.</p>
          </div>
          <div class="auth-foot">A student project for a more thoughtful campus dining system</div>
        </section>
        <section class="auth-panel">
          <div class="auth-card">
            <div class="eyebrow">${signup ? 'Create your account' : 'Welcome back'}</div>
            <h2>${signup ? 'Join Campus Harvest' : 'Sign in'}</h2>
            <p class="muted">${signup ? 'Create a Consumer account to report waste and view available surplus.' : 'Choose your account area, then sign in to your campus workspace.'}</p>
            <form id="auth-form" data-mode="${mode}" novalidate>
              ${signup ? `<div class="field"><label for="name">Full name</label><input id="name" name="name" autocomplete="name" placeholder="e.g. Asha Kumar" required></div>` : ''}
              ${!signup ? `<div class="field"><label for="account-type">Account area</label><select id="account-type" name="accountType"><option value="consumer">Consumer</option><option value="admin">Admin</option></select></div>` : ''}
              <div class="field"><label for="email">College email</label><input id="email" name="email" type="email" autocomplete="email" placeholder="name@college.edu" required></div>
              <div class="field"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="${signup ? 'new-password' : 'current-password'}" minlength="6" placeholder="${signup ? 'At least 6 characters' : 'Enter your password'}" required></div>
              ${signup ? `<div class="form-hint">Signup creates a Consumer account. Admin accounts are managed separately.</div>` : ''}
              <button class="btn btn-primary btn-block" type="submit">${signup ? 'Create account' : 'Sign in'}</button>
            </form>
            <p class="auth-switch">${signup ? 'Already registered?' : 'New to Campus Harvest?'} <button class="text-button" data-action="auth-switch" data-mode="${signup ? 'login' : 'signup'}">${signup ? 'Sign in' : 'Create an account'}</button></p>
            ${!signup ? `<div class="demo-box"><strong>Shravan · Admin demo</strong><br>Email: shravan@campus.edu<br>Password: shravan123<br><br>Consumers can create a separate account using “Create an account”.</div>` : ''}
          </div>
        </section>
      </main>`;
  }

  const adminNav = [ ['dashboard', '⌂', 'Overview'], ['waste', '◉', 'Waste log'], ['inventory', '▤', 'Inventory'], ['surplus', '✳', 'Surplus food'], ['reports', '▥', 'Consumer reports'], ['consumers', '♙', 'Manage consumers'] ];
  const consumerNav = [ ['dashboard', '⌂', 'Overview'], ['report', '+', 'Report waste'], ['surplus', '✳', 'Find surplus'], ['my-reports', '▤', 'My reports'] ];
  const titleFor = route => ({ dashboard: 'Overview', waste: 'Waste log', inventory: 'Inventory', surplus: current()?.role === 'admin' ? 'Surplus food' : 'Find surplus', reports: 'Consumer reports', consumers: 'Manage consumers', report: 'Report waste', 'my-reports': 'My reports' }[route] || 'Overview');
  const navFor = user => user.role === 'admin' ? adminNav : consumerNav;

  function appFrame(route, content) {
    const user = current();
    const nav = navFor(user);
    const title = titleFor(route);
    const shortName = user.name.split(/\s+/)[0];
    app.innerHTML = `
      <div class="overlay" data-action="close-menu"></div>
      <div class="app-shell">
        <aside class="sidebar" id="sidebar">
          <div class="brand"><span class="brand-mark">✳</span><span>Campus Harvest</span></div>
          <div><div class="side-label">${user.role === 'admin' ? 'Admin module' : 'Consumer module'}</div><nav class="nav-list">${nav.map(([key, icon, label]) => `<button class="nav-link ${route === key ? 'active' : ''}" data-route="${key}"><span class="nav-icon">${icon}</span>${label}</button>`).join('')}</nav></div>
          <div class="sidebar-bottom"><div class="side-label">Campus workspace</div><div class="user-chip"><span class="avatar">${esc(user.name.trim().charAt(0).toUpperCase())}</span><span><strong>${esc(user.name)}</strong><small>${user.role === 'admin' ? 'Administrator' : 'Consumer account'}</small></span></div></div>
        </aside>
        <main class="main-area">
          <header class="topbar"><button class="mobile-menu" data-action="open-menu" aria-label="Open navigation">☰</button><div class="topbar-title"><div class="eyebrow">${user.role === 'admin' ? 'Admin module' : 'Consumer module'}</div><h1>${title}</h1></div><div class="topbar-right"><span class="muted">Hi, ${esc(shortName)}</span><button class="btn btn-light" data-action="logout">Log out</button></div></header>
          <div class="content">${content}</div>
        </main>
      </div>`;
  }

  function metric(label, value, note, icon) { return `<article class="stat-card"><div class="stat-top"><span class="stat-label">${label}</span><span class="stat-icon">${icon}</span></div><div class="stat-value">${value}</div><div class="stat-note">${note}</div></article>`; }
  function wasteTotal(data) { return data.waste.reduce((sum, item) => sum + Number(item.kg || 0), 0); }
  function activityRows(items) {
    if (!items.length) return `<div class="empty-state">No records yet. New entries will appear here.</div>`;
    return `<div class="activity-list">${items.slice(0, 5).map(item => `<div class="activity-row"><span class="activity-icon">${item.category === 'Edible surplus' ? '✳' : '◉'}</span><span><strong>${esc(item.item)}</strong><small>${esc(item.location)} · ${formatDate(item.date)}</small></span><span class="activity-amount">${Number(item.kg).toFixed(1)} kg</span></div>`).join('')}</div>`;
  }

  function adminDashboard() {
    const data = getData(); const total = wasteTotal(data); const available = data.surplus.filter(x => x.status === 'Available').length;
    return `<section class="welcome"><div><div class="eyebrow">Campus operations</div><h2>Good day, ${esc(current().name.split(/\s+/)[0])}</h2><p>Here is today’s food waste snapshot across campus.</p></div><button class="btn btn-primary" data-route="waste">+ Record waste</button></section>
      <section class="stats-grid">${metric('Waste recorded', `${total.toFixed(1)} kg`, 'Across all campus entries', '◉')}${metric('Inventory items', data.inventory.length, 'Items being monitored', '▤')}${metric('Surplus listings', available, 'Available for campus pickup', '✳')}${metric('Consumer reports', data.reports.length, 'Submitted for review', '▥')}</section>
      <section class="columns"><article class="panel"><div class="panel-head"><div><h3>Recent waste entries</h3><p>Latest records from campus dining areas</p></div><button class="btn btn-light" data-route="waste">View log</button></div>${activityRows([...data.waste].reverse())}</article>
      <article class="panel"><div class="panel-head"><div><h3>Quick actions</h3><p>Common campus tasks</p></div></div><div class="quick-actions"><button class="quick-action" data-route="inventory"><span class="qa-icon">▤</span><span><b>Check inventory</b><small>Review quantities and expiry dates</small></span></button><button class="quick-action" data-route="surplus"><span class="qa-icon">✳</span><span><b>List food surplus</b><small>Make safe extra food visible</small></span></button><button class="quick-action" data-route="reports"><span class="qa-icon">▥</span><span><b>Review consumer reports</b><small>Respond to submitted observations</small></span></button><button class="quick-action" data-route="consumers"><span class="qa-icon">♙</span><span><b>Manage consumer accounts</b><small>Edit account details or reset passwords</small></span></button></div></article></section>`;
  }

  function userDashboard() {
    const data = getData(); const user = current(); const mine = data.reports.filter(r => r.userId === user.id); const available = data.surplus.filter(s => s.status === 'Available');
    return `<section class="welcome"><div><div class="eyebrow">Consumer workspace</div><h2>Welcome, ${esc(user.name.split(/\s+/)[0])}</h2><p>Help your campus prevent waste and make surplus food easier to find.</p></div><button class="btn btn-primary" data-route="report">+ Report waste</button></section>
      <section class="stats-grid">${metric('Available surplus', available.length, 'Campus listings ready to view', '✳')}${metric('My reports', mine.length, 'Waste observations submitted', '▤')}${metric('Pickup locations', new Set(available.map(s => s.location)).size, 'Locations with available food', '⌖')}${metric('Campus waste log', `${wasteTotal(data).toFixed(1)} kg`, 'Admin-reported entries', '◉')}</section>
      <section class="columns"><article class="panel"><div class="panel-head"><div><h3>Food available on campus</h3><p>Check listing details and pickup location</p></div><button class="btn btn-light" data-route="surplus">Browse all</button></div>${surplusCards(available.slice(0, 3))}</article><article class="panel"><div class="panel-head"><div><h3>Get involved</h3><p>Small observations can prevent repeat waste</p></div></div><div class="quick-actions"><button class="quick-action" data-route="report"><span class="qa-icon">＋</span><span><b>Submit a waste report</b><small>Tell the campus team where waste occurs</small></span></button><button class="quick-action" data-route="my-reports"><span class="qa-icon">▤</span><span><b>Follow my reports</b><small>See review status from the admin team</small></span></button></div><div class="callout"><h3>Food safety first</h3><p>Only claim food that appears in an active listing. Follow the posted pickup time and campus food handling guidance.</p></div></article></section>`;
  }

  function wastePage() {
    const data = getData();
    return `<section class="welcome"><div><div class="eyebrow">Measurement</div><h2>Campus waste log</h2><p>Record discard by type and dining location to find preventable losses.</p></div></section><section class="section-grid"><article class="panel"><div class="panel-head"><div><h3>Recorded entries</h3><p>${data.waste.length} records · ${wasteTotal(data).toFixed(1)} kg total</p></div></div>${wasteTable(data.waste)}</article><article class="panel"><div class="panel-head"><div><h3>Add a waste entry</h3><p>Use measured weight when available</p></div></div>${wasteForm()}<div class="callout"><h3>Record consistently</h3><p>Use the same weighing method and location names each day. Consistent records make week-to-week comparisons more useful.</p></div></article></section>`;
  }
  function wasteTable(items) {
    if (!items.length) return `<div class="empty-state">No waste entries have been recorded.</div>`;
    return `<div class="table-wrap"><table><thead><tr><th>Date</th><th>Item</th><th>Type</th><th>Location</th><th>Weight</th><th>Status</th></tr></thead><tbody>${[...items].reverse().map(x => `<tr><td>${formatDate(x.date)}</td><td><strong>${esc(x.item)}</strong></td><td>${esc(x.category)}</td><td>${esc(x.location)}</td><td>${Number(x.kg).toFixed(1)} kg</td><td><span class="badge ${x.status === 'Composted' ? '' : 'amber'}">${esc(x.status)}</span></td></tr>`).join('')}</tbody></table></div>`;
  }
  function wasteForm() {
    return `<form data-form="waste"><div class="field"><label>Food item</label><input name="item" placeholder="e.g. Cooked rice" required maxlength="60"></div><div class="form-row"><div class="field"><label>Waste type</label><select name="category"><option>Kitchen surplus</option><option>Preparation scraps</option><option>Plate waste</option><option>Spoiled food</option></select></div><div class="field"><label>Weight (kg)</label><input name="kg" type="number" min="0.1" max="10000" step="0.1" placeholder="0.0" required></div></div><div class="field"><label>Dining location</label><input name="location" placeholder="e.g. Main Dining Hall" required maxlength="60"></div><div class="field"><label>Date</label><input name="date" type="date" value="${today()}" required></div><button class="btn btn-primary btn-block">Save waste entry</button></form>`;
  }

  function inventoryPage() {
    const data = getData(); const sorted = [...data.inventory].sort((a,b) => a.expiry.localeCompare(b.expiry));
    return `<section class="welcome"><div><div class="eyebrow">Stock control</div><h2>Inventory and expiry checks</h2><p>Track campus food quantities and review items closest to their expiry date.</p></div></section><section class="section-grid"><article class="panel"><div class="panel-head"><div><h3>Current inventory</h3><p>${data.inventory.length} items tracked</p></div></div>${inventoryTable(sorted)}</article><article class="panel"><div class="panel-head"><div><h3>Add inventory item</h3><p>Include a clear expiry date</p></div></div>${inventoryForm()}<div class="callout"><h3>Stock rotation</h3><p>Use first-in, first-out. Review near-expiry items during daily kitchen checks and adjust meal plans before buying more.</p></div></article></section>`;
  }
  function inventoryTable(items) {
    if (!items.length) return `<div class="empty-state">No items in inventory. Add an item to start tracking.</div>`;
    return `<div class="table-wrap"><table><thead><tr><th>Item</th><th>Quantity</th><th>Location</th><th>Expiry</th><th>Action</th></tr></thead><tbody>${items.map(x => { const days = Math.ceil((new Date(`${x.expiry}T00:00:00`) - new Date(`${today()}T00:00:00`)) / 86400000); const cls = days < 0 ? 'red' : days <= 2 ? 'amber' : ''; return `<tr><td><strong>${esc(x.name)}</strong></td><td>${Number(x.quantity)} ${esc(x.unit)}</td><td>${esc(x.location)}</td><td><span class="badge ${cls}">${formatDate(x.expiry)}</span></td><td><button class="btn btn-danger" data-action="delete-inventory" data-id="${x.id}">Remove</button></td></tr>`; }).join('')}</tbody></table></div>`;
  }
  function inventoryForm() {
    return `<form data-form="inventory"><div class="field"><label>Food item</label><input name="name" placeholder="e.g. Fresh tomatoes" required maxlength="60"></div><div class="form-row"><div class="field"><label>Quantity</label><input name="quantity" type="number" min="0.1" step="0.1" required></div><div class="field"><label>Unit</label><select name="unit"><option>kg</option><option>packs</option><option>units</option><option>pieces</option><option>litres</option></select></div></div><div class="field"><label>Storage location</label><input name="location" placeholder="Kitchen Store" required maxlength="60"></div><div class="field"><label>Expiry date</label><input name="expiry" type="date" value="${today()}" required></div><button class="btn btn-primary btn-block">Add to inventory</button></form>`;
  }

  function surplusPage() {
    const data = getData(); const admin = current().role === 'admin'; const items = admin ? data.surplus : data.surplus.filter(x => x.status === 'Available');
    return `<section class="welcome"><div><div class="eyebrow">Safe food redistribution</div><h2>${admin ? 'Surplus food listings' : 'Find available campus food'}</h2><p>${admin ? 'List safe surplus promptly and update its status after pickup.' : 'Browse current listings. Contact the dining team if a pickup detail needs clarification.'}</p></div></section><section class="section-grid"><article class="panel"><div class="panel-head"><div><h3>${admin ? 'All listings' : 'Available listings'}</h3><p>${items.length} listing${items.length === 1 ? '' : 's'}</p></div></div>${admin ? surplusAdminTable(items) : surplusCards(items)}</article>${admin ? `<article class="panel"><div class="panel-head"><div><h3>Create a listing</h3><p>List only suitable food handled safely</p></div></div>${surplusForm()}<div class="callout"><h3>Safe redistribution</h3><p>Use only food that meets campus food safety policy. Record a clear pickup location, time and best-before date.</p></div></article>` : `<aside class="panel"><div class="panel-head"><div><h3>Claimed listings</h3><p>Your pickup requests</p></div></div>${claimedByUser(data.surplus, current().id)}</aside>`}</section>`;
  }
  function surplusCards(items) {
    if (!items.length) return `<div class="empty-state">No food surplus is listed right now. Check back later.</div>`;
    return `<div class="quick-actions">${items.map(x => `<article class="quick-action" style="align-items:flex-start"><span class="qa-icon">✳</span><span style="flex:1"><b>${esc(x.item)} <span class="badge">${esc(x.quantity)} ${esc(x.unit)}</span></b><small>${esc(x.location)} · best before ${formatDate(x.bestBefore)}</small><small style="display:block;margin-top:5px">Pickup date: ${formatDate(x.available)}${x.notes ? ` · ${esc(x.notes)}` : ''}</small>${current()?.role === 'user' ? `<button class="btn btn-primary" style="margin-top:10px" data-action="claim-surplus" data-id="${x.id}">Request pickup</button>` : ''}</span></article>`).join('')}</div>`;
  }
  function claimedByUser(items, userId) {
    const claims = items.flatMap(x => (x.claims || []).filter(c => c.userId === userId).map(c => ({ ...c, item: x.item, location: x.location })));
    if (!claims.length) return `<div class="empty-state">You have not requested a pickup yet.</div>`;
    return `<div class="activity-list">${claims.map(c => `<div class="activity-row"><span class="activity-icon">✳</span><span><strong>${esc(c.item)}</strong><small>${esc(c.location)} · ${formatDate(c.date)}</small></span><span class="badge">${esc(c.status)}</span></div>`).join('')}</div>`;
  }
  function surplusAdminTable(items) {
    if (!items.length) return `<div class="empty-state">No listings yet. Add suitable surplus food here.</div>`;
    return `<div class="table-wrap"><table><thead><tr><th>Food</th><th>Quantity</th><th>Pickup</th><th>Best before</th><th>Status</th><th>Action</th></tr></thead><tbody>${items.map(x => `<tr><td><strong>${esc(x.item)}</strong><small style="display:block;color:var(--muted)">${esc(x.location)}</small></td><td>${esc(x.quantity)} ${esc(x.unit)}</td><td>${formatDate(x.available)}</td><td>${formatDate(x.bestBefore)}</td><td><span class="badge ${x.status === 'Available' ? '' : 'amber'}">${esc(x.status)}</span></td><td>${x.status === 'Available' ? `<button class="btn btn-light" data-action="mark-collected" data-id="${x.id}">Mark collected</button>` : '—'}</td></tr>${(x.claims || []).map(c => `<tr><td colspan="6"><small>Pickup request from ${esc(c.name)} on ${formatDate(c.date)} · ${esc(c.status)}</small></td></tr>`).join('')}</tbody>`).join('')}</table></div>`;
  }
  function surplusForm() {
    return `<form data-form="surplus"><div class="field"><label>Food item</label><input name="item" placeholder="e.g. Sealed fruit cups" required maxlength="60"></div><div class="form-row"><div class="field"><label>Quantity</label><input name="quantity" type="number" min="1" step="1" required></div><div class="field"><label>Unit</label><select name="unit"><option>servings</option><option>pieces</option><option>packs</option><option>kg</option></select></div></div><div class="field"><label>Pickup location</label><input name="location" placeholder="Student Dining Hall" required maxlength="60"></div><div class="form-row"><div class="field"><label>Available date</label><input name="available" type="date" value="${today()}" required></div><div class="field"><label>Best-before date</label><input name="bestBefore" type="date" value="${today()}" required></div></div><div class="field"><label>Handling and pickup notes</label><textarea name="notes" maxlength="180" placeholder="Storage details, pickup window, etc."></textarea></div><button class="btn btn-primary btn-block">Publish listing</button></form>`;
  }

  function reportForm() {
    return `<form data-form="report"><div class="field"><label>What did you notice?</label><input name="item" placeholder="e.g. Large portions left after lunch" required maxlength="70"></div><div class="form-row"><div class="field"><label>Area</label><select name="location"><option>Main Dining Hall</option><option>North Canteen</option><option>Hostel Mess</option><option>Food Court</option><option>Other campus area</option></select></div><div class="field"><label>Waste type</label><select name="category"><option>Serving portions</option><option>Plate waste</option><option>Food storage</option><option>Food availability</option><option>Other</option></select></div></div><div class="field"><label>Details for the campus team</label><textarea name="details" maxlength="300" placeholder="When does it happen? What change might help?" required></textarea></div><button class="btn btn-primary btn-block">Submit report</button></form>`;
  }
  function reportsList(items, mine = false) {
    if (!items.length) return `<div class="empty-state">${mine ? 'You have not submitted any reports yet.' : 'No Consumer reports have been submitted.'}</div>`;
    return `<div class="table-wrap"><table><thead><tr><th>Date</th>${mine ? '' : '<th>Consumer</th>'}<th>Observation</th><th>Area</th><th>Type</th><th>Status</th>${mine ? '' : '<th>Action</th>'}</tr></thead><tbody>${[...items].reverse().map(x => `<tr><td>${formatDate(x.date)}</td>${mine ? '' : `<td>${esc(x.userName)}</td>`}<td><strong>${esc(x.item)}</strong><small style="display:block;color:var(--muted)">${esc(x.details)}</small></td><td>${esc(x.location)}</td><td>${esc(x.category)}</td><td><span class="badge ${x.status === 'Reviewed' ? '' : 'amber'}">${esc(x.status)}</span></td>${mine ? '' : `<td>${x.status === 'New' ? `<button class="btn btn-light" data-action="review-report" data-id="${x.id}">Mark reviewed</button>` : '—'}</td>`}</tr>`).join('')}</tbody></table></div>`;
  }
  function reportPage() {
    return `<section class="welcome"><div><div class="eyebrow">Student contribution</div><h2>Report a waste issue</h2><p>Share an observation that could help the campus team prevent avoidable waste.</p></div></section><section class="section-grid"><article class="panel"><div class="panel-head"><div><h3>New observation</h3><p>Specific details help the dining team act</p></div></div>${reportForm()}</article><aside class="panel"><div class="panel-head"><div><h3>What makes a useful report?</h3><p>Include details the campus team can follow up on</p></div></div><div class="activity-list"><div class="activity-row"><span class="activity-icon">⌖</span><span><strong>Where it happens</strong><small>Name the dining area or campus location</small></span></div><div class="activity-row"><span class="activity-icon">◷</span><span><strong>When it happens</strong><small>Mention a meal period or recurring pattern</small></span></div><div class="activity-row"><span class="activity-icon">✓</span><span><strong>What might help</strong><small>Suggest a practical change if you have one</small></span></div></div></aside></section>`;
  }
  function reportsPage(mine = false) {
    const data = getData(); const items = mine ? data.reports.filter(r => r.userId === current().id) : data.reports;
    return `<section class="welcome"><div><div class="eyebrow">${mine ? 'Consumer workspace' : 'Campus feedback'}</div><h2>${mine ? 'My reports' : 'Consumer waste reports'}</h2><p>${mine ? 'Follow the status of observations you submitted.' : 'Review observations and record follow-up status.'}</p></div></section><section class="panel"><div class="panel-head"><div><h3>${mine ? 'Submitted observations' : 'All submitted observations'}</h3><p>${items.length} report${items.length === 1 ? '' : 's'}</p></div></div>${reportsList(items, mine)}</section>`;
  }

  function consumersPage(editId = '') {
    const consumers = getUsers().filter(user => user.role === 'consumer');
    const selected = consumers.find(user => user.id === editId);
    const rows = consumers.length ? `<div class="table-wrap"><table><thead><tr><th>Consumer</th><th>Email</th><th>Account area</th><th>Action</th></tr></thead><tbody>${consumers.map(user => `<tr><td><strong>${esc(user.name)}</strong></td><td>${esc(user.email)}</td><td><span class="badge consumer">Consumer</span></td><td><button class="btn btn-light" data-route="consumers/${user.id}">Edit account</button></td></tr>`).join('')}</tbody></table></div>` : `<div class="empty-state">No Consumer accounts yet. New signups will appear here.</div>`;
    const editor = selected ? `<form data-form="consumer" data-id="${selected.id}"><div class="field"><label>Consumer name</label><input name="name" value="${esc(selected.name)}" maxlength="60" required></div><div class="field"><label>Email address</label><input name="email" type="email" value="${esc(selected.email)}" required></div><div class="field"><label>Set a new password</label><input name="password" type="password" minlength="6" placeholder="Leave blank to keep current password"></div><div class="form-hint">Only the Admin can edit Consumer account details or reset a Consumer password.</div><button class="btn btn-primary btn-block">Save account changes</button><button class="btn btn-light btn-block" type="button" data-route="consumers">Cancel</button></form>` : `<div class="empty-state">Choose a Consumer account to edit their name, email or password.</div>`;
    return `<section class="welcome"><div><div class="eyebrow">Account administration</div><h2>Manage consumer accounts</h2><p>Review consumer registrations and update account details when needed.</p></div></section><section class="section-grid"><article class="panel"><div class="panel-head"><div><h3>Consumer accounts</h3><p>${consumers.length} account${consumers.length === 1 ? '' : 's'} · Admin-only access</p></div></div>${rows}</article><aside class="panel"><div class="panel-head"><div><h3>${selected ? 'Edit consumer account' : 'Account controls'}</h3><p>${selected ? esc(selected.name) : 'Select an account to make changes'}</p></div></div>${editor}</aside></section>`;
  }

  function render() {
    initialize();
    const user = current();
    if (!user) { renderAuth(location.hash === '#signup' ? 'signup' : 'login'); return; }
    const routeParts = location.hash.replace(/^#\/?/, '').split('/');
    let route = routeParts[0] || 'dashboard';
    const allowed = navFor(user).map(x => x[0]);
    if (!allowed.includes(route)) route = 'dashboard';
    const content = user.role === 'admin' ? ({ dashboard: adminDashboard, waste: wastePage, inventory: inventoryPage, surplus: surplusPage, reports: () => reportsPage(false), consumers: () => consumersPage(routeParts[1] || '') }[route] || adminDashboard)() : ({ dashboard: userDashboard, report: reportPage, surplus: surplusPage, 'my-reports': () => reportsPage(true) }[route] || userDashboard)();
    appFrame(route, content);
  }

  function handleAuth(form) {
    const values = Object.fromEntries(new FormData(form).entries());
    const email = values.email.trim().toLowerCase();
    if (form.dataset.mode === 'signup') {
      const name = values.name.trim();
      if (name.length < 2) return setNotice(form, 'Enter your full name to continue.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setNotice(form, 'Enter a valid college email address.');
      if (values.password.length < 6) return setNotice(form, 'Choose a password with at least 6 characters.');
      const users = getUsers();
      if (users.some(user => user.email === email)) return setNotice(form, 'An account with this email already exists. Try signing in.');
      const user = { id: uid(), name, email, password: values.password, role: 'consumer' };
      users.push(user); write(KEYS.users, users); write(KEYS.session, { id: user.id, name: user.name, email: user.email, role: user.role });
      location.hash = '#dashboard'; toast('Your Consumer account is ready.'); render(); return;
    }
    const user = getUsers().find(item => item.email === email && item.password === values.password && item.role === values.accountType);
    if (!user) return setNotice(form, `Those sign-in details do not match a ${values.accountType === 'admin' ? 'Admin' : 'Consumer'} account.`);
    write(KEYS.session, { id: user.id, name: user.name, email: user.email, role: user.role }); location.hash = '#dashboard'; render();
  }

  function handleForm(form) {
    const v = Object.fromEntries(new FormData(form).entries()); const data = getData();
    if (form.dataset.form === 'waste') {
      if (!v.item.trim() || !v.location.trim() || Number(v.kg) <= 0) return setNotice(form, 'Enter an item, a campus location and a weight above zero.');
      data.waste.push({ id: uid(), item: v.item.trim(), category: v.category, kg: Number(v.kg), location: v.location.trim(), date: v.date, source: current().name, status: v.category === 'Preparation scraps' ? 'Composted' : 'Recorded' });
      saveData(data); toast('Waste entry saved.'); render();
    } else if (form.dataset.form === 'inventory') {
      data.inventory.push({ id: uid(), name: v.name.trim(), quantity: Number(v.quantity), unit: v.unit, location: v.location.trim(), expiry: v.expiry });
      saveData(data); toast('Inventory item added.'); render();
    } else if (form.dataset.form === 'surplus') {
      if (v.bestBefore < v.available) return setNotice(form, 'Best-before date must be the same as or later than the pickup date.');
      data.surplus.push({ id: uid(), item: v.item.trim(), quantity: Number(v.quantity), unit: v.unit, location: v.location.trim(), available: v.available, bestBefore: v.bestBefore, notes: v.notes.trim(), claims: [], status: 'Available' });
      saveData(data); toast('Surplus listing published.'); render();
    } else if (form.dataset.form === 'report') {
      data.reports.push({ id: uid(), userId: current().id, userName: current().name, item: v.item.trim(), location: v.location, category: v.category, details: v.details.trim(), date: today(), status: 'New' });
      saveData(data); toast('Your report has been sent to the campus team.'); location.hash = '#my-reports'; render();
    } else if (form.dataset.form === 'consumer') {
      const users = getUsers(); const consumer = users.find(user => user.id === form.dataset.id && user.role === 'consumer');
      if (!consumer) return setNotice(form, 'That Consumer account could not be found.');
      const email = v.email.trim().toLowerCase();
      if (v.name.trim().length < 2) return setNotice(form, 'Enter a Consumer name with at least two characters.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setNotice(form, 'Enter a valid email address.');
      if (users.some(user => user.id !== consumer.id && user.email === email)) return setNotice(form, 'Another account already uses that email address.');
      if (v.password && v.password.length < 6) return setNotice(form, 'A new password must contain at least 6 characters.');
      consumer.name = v.name.trim(); consumer.email = email;
      if (v.password) consumer.password = v.password;
      write(KEYS.users, users); toast('Consumer account updated.'); location.hash = '#consumers'; render();
    }
  }

  app.addEventListener('submit', event => {
    const form = event.target;
    if (form.id === 'auth-form') { event.preventDefault(); handleAuth(form); }
    else if (form.matches('[data-form]')) { event.preventDefault(); handleForm(form); }
  });
  app.addEventListener('click', event => {
    const routeEl = event.target.closest('[data-route]');
    if (routeEl) { event.preventDefault(); setRoute(routeEl.dataset.route); $('.sidebar')?.classList.remove('open'); $('.overlay')?.classList.remove('show'); return; }
    const actionEl = event.target.closest('[data-action]'); if (!actionEl) return;
    const action = actionEl.dataset.action;
    if (action === 'auth-switch') { location.hash = actionEl.dataset.mode === 'signup' ? '#signup' : '#login'; renderAuth(actionEl.dataset.mode); }
    if (action === 'logout') { localStorage.removeItem(KEYS.session); location.hash = '#login'; render(); }
    if (action === 'open-menu') { $('.sidebar')?.classList.add('open'); $('.overlay')?.classList.add('show'); }
    if (action === 'close-menu') { $('.sidebar')?.classList.remove('open'); $('.overlay')?.classList.remove('show'); }
    if (action === 'delete-inventory') { const data = getData(); data.inventory = data.inventory.filter(x => x.id !== actionEl.dataset.id); saveData(data); toast('Inventory item removed.'); render(); }
    if (action === 'mark-collected') { const data = getData(); const item = data.surplus.find(x => x.id === actionEl.dataset.id); if (item) item.status = 'Collected'; saveData(data); toast('Listing marked as collected.'); render(); }
    if (action === 'claim-surplus') {
      const data = getData(); const item = data.surplus.find(x => x.id === actionEl.dataset.id);
      if (!item || item.status !== 'Available') return toast('This listing is no longer available.');
      if (!(item.claims || []).some(c => c.userId === current().id)) { item.claims = item.claims || []; item.claims.push({ userId: current().id, name: current().name, date: today(), status: 'Requested' }); saveData(data); toast('Pickup request recorded.'); render(); }
      else toast('You already requested this listing.');
    }
    if (action === 'review-report') { const data = getData(); const report = data.reports.find(x => x.id === actionEl.dataset.id); if (report) report.status = 'Reviewed'; saveData(data); toast('Report marked as reviewed.'); render(); }
  });
  window.addEventListener('hashchange', render);
  initialize(); render();
})();
