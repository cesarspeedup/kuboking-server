const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const PORT = process.env.PORT || 3000;

// CONTRASEÑAS/PINS POR ROL
const ROLES_PINS = {
  barra: "1234",   // Acceso Total (Barra, Cocina, Salón)
  cocina: "5555",  // Acceso Exclusivo a Cocina
  salon: "0000"    // Acceso Exclusivo a Salón
};

// MENÚ KUBO KING REAL
const MENU_CATEGORIES = [
  { id: 'rac_a', name: 'Raciones A (4,50€)' },
  { id: 'rac_b', name: 'Raciones B (5,50€)' },
  { id: 'rac_esp', name: 'Raciones Especiales (7,50€-8,50€)' },
  { id: 'burgers', name: 'Hamburguesas (6,00€-10,00€)' },
  { id: 'bocadillos', name: 'Bocadillos (3,00€-5,00€)' },
  { id: 'platos', name: 'Platos Combinados (8,00€)' },
  { id: 'perrazos', name: 'Perrazos (7,00€)' }
];

const MENU_ITEMS = [
  { id: 'ra1', category: 'rac_a', name: 'Patatas con Nuggets', price: 4.50 },
  { id: 'ra2', category: 'rac_a', name: 'Bravas y Olé', price: 4.50 },
  { id: 'ra3', category: 'rac_a', name: 'Alitas BBQ', price: 4.50 },
  { id: 'ra4', category: 'rac_a', name: 'Salchipapas', price: 4.50 },
  { id: 'ra5', category: 'rac_a', name: 'Aros de Cebolla', price: 4.50 },
  { id: 'ra6', category: 'rac_a', name: 'Nachos Cheddar y Bacon', price: 4.50 },
  { id: 'ra7', category: 'rac_a', name: 'Mix Palomitas Pollo y Queso', price: 4.50 },
  { id: 'rb1', category: 'rac_b', name: 'Nachos Cheddar y Guacamole', price: 5.50 },
  { id: 'rb2', category: 'rac_b', name: 'Ración Jamón Serrano', price: 5.50 },
  { id: 'rb3', category: 'rac_b', name: 'Alitas BBQ + Sweet Fries', price: 5.50 },
  { id: 'rb4', category: 'rac_b', name: 'Croquetas Jamón Ibérico', price: 5.50 },
  { id: 'rb5', category: 'rac_b', name: 'Duo de Burritos', price: 5.50 },
  { id: 'rb6', category: 'rac_b', name: 'Patatas con Mini San Jacobos', price: 5.50 },
  { id: 're1', category: 'rac_esp', name: 'Huevos Rotos con Jamón', price: 7.50 },
  { id: 're2', category: 'rac_esp', name: 'Fingers Pollo y Queso', price: 7.50 },
  { id: 're3', category: 'rac_esp', name: 'Ensalada César', price: 7.50 },
  { id: 're4', category: 'rac_esp', name: 'Gentleman Fries', price: 7.50 },
  { id: 're5', category: 'rac_esp', name: 'King Fries', price: 7.50 },
  { id: 're6', category: 'rac_esp', name: 'F*cking Cheese & Bacon Fries', price: 7.50 },
  { id: 're7', category: 'rac_esp', name: 'Tequeños de Queso', price: 7.50 },
  { id: 're8', category: 'rac_esp', name: 'Tequeños Queso y Guayaba', price: 7.50 },
  { id: 're9', category: 'rac_esp', name: 'King Nachos Pulled Pork', price: 8.50 },
  { id: 're10', category: 'rac_esp', name: 'Empanadillas Venezolanas (3 uds)', price: 7.50 },
  { id: 'bg1', category: 'burgers', name: 'Hamburguesa Pulled Pork 100g', price: 6.00 },
  { id: 'bg2', category: 'burgers', name: 'Hamburguesa BLT 200g', price: 8.00 },
  { id: 'bg3', category: 'burgers', name: 'Hamburguesa Pollo Crujiente', price: 6.00 },
  { id: 'bg4', category: 'burgers', name: 'Hamburguesa Chingona 100g', price: 6.00 },
  { id: 'bg5', category: 'burgers', name: 'Hamburguesa Chingona 200g', price: 8.00 },
  { id: 'bg6', category: 'burgers', name: 'Hamburguesa Serrana 100g', price: 6.00 },
  { id: 'bg7', category: 'burgers', name: 'Hamburguesa Serrana 200g', price: 8.00 },
  { id: 'bg8', category: 'burgers', name: 'Hamburguesa La Reina 200g', price: 10.00 },
  { id: 'bo1', category: 'bocadillos', name: 'Bocadillo de Pollo', price: 4.00 },
  { id: 'bo2', category: 'bocadillos', name: 'Bocadillo Pepito', price: 4.50 },
  { id: 'bo3', category: 'bocadillos', name: 'Bocadillo de Bacon', price: 3.00 },
  { id: 'bo4', category: 'bocadillos', name: 'Bocadillo de Lomo', price: 4.00 },
  { id: 'bo5', category: 'bocadillos', name: 'Bocadillo de Calamares', price: 5.00 },
  { id: 'bo6', category: 'bocadillos', name: 'Bocadillo Tortilla Francesa', price: 4.00 },
  { id: 'bo7', category: 'bocadillos', name: 'Bocata JJ (Pollo Empanado)', price: 5.00 },
  { id: 'pc1', category: 'platos', name: 'Nº1 Ternera, Huevo y Patatas', price: 8.00 },
  { id: 'pc2', category: 'platos', name: 'Nº2 Pechuga Pollo, Ensalada y Patatas', price: 8.00 },
  { id: 'pc3', category: 'platos', name: 'Nº3 Cinta Lomo, Huevo y Patatas', price: 8.00 },
  { id: 'pc4', category: 'platos', name: 'Nº4 Tortilla Bonito, Ensalada y Patatas', price: 8.00 },
  { id: 'pc5', category: 'platos', name: 'Nº5 Huevos Fritos con Jamón y Patatas', price: 8.00 },
  { id: 'pc6', category: 'platos', name: 'Nº6 Escalope Pollo y Patatas BBQ', price: 8.00 },
  { id: 'pz1', category: 'perrazos', name: 'Perrazo Doggie', price: 7.00 },
  { id: 'pz2', category: 'perrazos', name: 'Perrazo Yankee', price: 7.00 },
  { id: 'pz3', category: 'perrazos', name: 'Perrazo El Chanchito', price: 7.00 },
  { id: 'pz4', category: 'perrazos', name: 'Perrazo Chihuahua', price: 7.00 }
];

// ESTADO COMPARTIDO DE PEDIDOS EN SERVIDOR
let activeOrders = [];
let orderCounter = 101;

// RUTA PRINCIPAL
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="es" class="h-full bg-slate-950 text-slate-100">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Kubo King - Sistema Centralizado</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="/socket.io/socket.io.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    @keyframes pulse-ring {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.05); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.8; }
    }
    .animate-ring { animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #0f172a; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
  </style>
</head>
<body class="h-full flex flex-col font-sans antialiased overflow-hidden select-none">

  <!-- LOGIN / ACCESO POR CONTRASEÑA -->
  <div id="login-modal" class="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl text-center">
      <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-3 text-black text-2xl font-black">
        <i class="fa-solid fa-crown"></i>
      </div>
      <h2 class="text-xl font-black text-white mb-1">KUBO KING</h2>
      <p class="text-xs text-slate-400 mb-6">Introduce el PIN de acceso del terminal</p>
      
      <form onsubmit="handleLogin(event)" class="space-y-4">
        <div>
          <input type="password" id="pin-input" maxlength="6" pattern="[0-9]*" inputmode="numeric" placeholder="****" class="w-full text-center tracking-[0.5em] text-2xl bg-slate-950 border border-slate-700 rounded-xl py-3 font-bold text-amber-400 focus:outline-none focus:border-amber-500">
        </div>
        <p id="login-error" class="text-xs text-red-400 hidden font-bold">PIN incorrecto</p>
        <button type="submit" class="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-3 rounded-xl transition shadow-lg shadow-amber-500/20">
          ENTRAR AL TERMINAL
        </button>
      </form>
    </div>
  </div>

  <!-- HEADER PRINCIPAL -->
  <header class="bg-slate-900 border-b border-slate-800 px-3 py-2.5 flex justify-between items-center shrink-0">
    <div class="flex items-center gap-2">
      <div class="bg-amber-500 text-black px-2 py-0.5 rounded font-black text-sm flex items-center gap-1">
        <i class="fa-solid fa-crown"></i> KUBO KING
      </div>
      <span id="role-badge" class="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 uppercase">Sin Rol</span>
    </div>

    <!-- Navegación por Pestañas -->
    <nav id="role-nav" class="hidden flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-semibold">
      <button id="tab-barra" onclick="switchView('barra')" class="px-3 py-1 rounded transition flex items-center gap-1.5">
        <i class="fa-solid fa-cash-register"></i> <span class="hidden sm:inline">Barra</span>
      </button>
      <button id="tab-cocina" onclick="switchView('cocina')" class="px-3 py-1 rounded transition flex items-center gap-1.5">
        <i class="fa-solid fa-utensils"></i> <span class="hidden sm:inline">Cocina</span>
      </button>
      <button id="tab-salon" onclick="switchView('salon')" class="px-3 py-1 rounded transition flex items-center gap-1.5">
        <i class="fa-solid fa-tv"></i> <span class="hidden sm:inline">Salón</span>
      </button>
    </nav>

    <div class="flex items-center gap-2 text-xs">
      <div class="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded border border-slate-800">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-[10px] text-emerald-400 font-bold uppercase">Online</span>
      </div>
      <button onclick="logout()" class="p-1.5 text-slate-400 hover:text-red-400">
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    </div>
  </header>

  <!-- CONTENIDO VISTAS -->
  <main class="flex-1 relative overflow-hidden bg-slate-950">

    <!-- BARRA -->
    <section id="view-barra" class="h-full hidden flex-col lg:flex-row p-2 sm:p-4 gap-3 overflow-hidden">
      <div class="flex-1 flex flex-col gap-3 h-full overflow-hidden">
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex flex-wrap gap-2 items-center shrink-0">
          <input type="text" id="client-id-input" placeholder="Nombre / Ticket" class="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500 min-w-[130px]">
          <select id="order-type-select" class="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200">
            <option value="Salón">Salón</option>
            <option value="Barra">Barra</option>
            <option value="Para Llevar">Llevar</option>
          </select>
        </div>

        <div id="category-tabs" class="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar shrink-0"></div>

        <div class="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl p-2 overflow-y-auto custom-scrollbar">
          <div id="menu-items-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"></div>
        </div>
      </div>

      <div class="w-full lg:w-80 bg-slate-900 border border-slate-800 rounded-xl flex flex-col shrink-0 h-1/3 lg:h-full overflow-hidden">
        <div class="p-2.5 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
          <span class="font-bold text-xs text-slate-200">Comanda Actual</span>
          <span id="cart-total" class="text-amber-400 font-black text-sm">0.00€</span>
        </div>
        <div id="cart-items-list" class="flex-1 p-2 overflow-y-auto custom-scrollbar flex flex-col gap-1.5"></div>
        <div class="p-2.5 border-t border-slate-800 bg-slate-900/90 flex flex-col gap-2">
          <input type="text" id="order-notes-input" placeholder="Notas cocina..." class="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200">
          <button onclick="submitOrder()" class="bg-amber-500 hover:bg-amber-400 text-black font-black py-2.5 rounded-lg text-xs shadow-lg shadow-amber-500/20">
            ENVIAR A COCINA
          </button>
        </div>
      </div>
    </section>

    <!-- COCINA -->
    <section id="view-cocina" class="h-full hidden flex-col p-3 overflow-hidden">
      <div id="kitchen-orders-grid" class="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 overflow-y-auto custom-scrollbar pb-6"></div>
    </section>

    <!-- SALÓN -->
    <section id="view-salon" class="h-full hidden flex-col p-4 overflow-hidden bg-slate-950">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col overflow-hidden">
          <h2 class="text-xl font-black text-slate-400 border-b border-slate-800 pb-2 mb-3 uppercase tracking-wider flex items-center gap-2">
            <i class="fa-solid fa-spinner animate-spin text-amber-500"></i> En Preparación
          </h2>
          <div id="salon-preparando-list" class="flex-1 grid grid-cols-2 gap-2 overflow-y-auto custom-scrollbar content-start"></div>
        </div>

        <div class="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 flex flex-col overflow-hidden">
          <h2 class="text-xl font-black text-emerald-400 border-b border-emerald-500/30 pb-2 mb-3 uppercase tracking-wider flex items-center gap-2">
            <i class="fa-solid fa-bell text-emerald-400 animate-bounce"></i> Listos para Recoger
          </h2>
          <div id="salon-listos-list" class="flex-1 grid grid-cols-1 gap-3 overflow-y-auto custom-scrollbar content-start"></div>
        </div>
      </div>
    </section>

  </main>

  <script>
    const socket = io();
    const categories = ${JSON.stringify(MENU_CATEGORIES)};
    const menuItems = ${JSON.stringify(MENU_ITEMS)};

    let userRole = localStorage.getItem('kk_role') || null;
    let selectedCategory = 'rac_a';
    let currentCart = [];
    let ordersList = [];
    let audioCtx = null;

    window.addEventListener('DOMContentLoaded', () => {
      if (userRole) {
        initSession();
      }
    });

    function handleLogin(e) {
      e.preventDefault();
      const pin = document.getElementById('pin-input').value;
      socket.emit('login', pin);
    }

    socket.on('login_success', (role) => {
      userRole = role;
      localStorage.setItem('kk_role', role);
      document.getElementById('login-modal').classList.add('hidden');
      document.getElementById('login-error').classList.add('hidden');
      initSession();
    });

    socket.on('login_error', () => {
      document.getElementById('login-error').classList.remove('hidden');
    });

    function logout() {
      localStorage.removeItem('kk_role');
      location.reload();
    }

    function initSession() {
      document.getElementById('login-modal').classList.add('hidden');
      document.getElementById('role-badge').innerText = userRole;

      const nav = document.getElementById('role-nav');
      if (userRole === 'barra') {
        nav.classList.remove('hidden');
        switchView('barra');
      } else if (userRole === 'cocina') {
        nav.classList.add('hidden');
        switchView('cocina');
      } else if (userRole === 'salon') {
        nav.classList.add('hidden');
        switchView('salon');
      }

      renderCategories();
      renderMenuItems();
      renderCart();
    }

    function switchView(view) {
      if (userRole === 'cocina' && view !== 'cocina') return;
      if (userRole === 'salon' && view !== 'salon') return;

      ['barra', 'cocina', 'salon'].forEach(v => {
        const tab = document.getElementById(\`tab-\${v}\`);
        const sec = document.getElementById(\`view-\${v}\`);
        if (v === view) {
          if (tab) tab.className = "px-3 py-1 rounded bg-amber-500 text-black font-bold";
          sec.classList.remove('hidden');
          sec.classList.add('flex');
        } else {
          if (tab) tab.className = "px-3 py-1 rounded text-slate-400 hover:text-white";
          sec.classList.add('hidden');
          sec.classList.remove('flex');
        }
      });
    }

    // SINCRONIZACIÓN WEBSOCKETS TIEMPO REAL
    socket.on('sync_orders', (orders) => {
      const hadNewReady = orders.some(o => o.status === 'listo' && !ordersList.some(prev => prev.id === o.id && prev.status === 'listo'));
      ordersList = orders;
      
      if (hadNewReady && (userRole === 'salon' || userRole === 'barra')) {
        playBeep();
      }

      renderKitchen();
      renderSalon();
    });

    // BARRA
    function renderCategories() {
      document.getElementById('category-tabs').innerHTML = categories.map(c => \`
        <button onclick="selectedCategory='\${c.id}'; renderCategories(); renderMenuItems();" class="px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap border \${selectedCategory === c.id ? 'bg-amber-500 text-black border-amber-500' : 'bg-slate-900 text-slate-300 border-slate-800'}\">
          \${c.name}
        </button>
      \`).join('');
    }

    function renderMenuItems() {
      const filtered = menuItems.filter(i => i.category === selectedCategory);
      document.getElementById('menu-items-grid').innerHTML = filtered.map(i => \`
        <button onclick="addToCart('\${i.id}')" class="bg-slate-900 border border-slate-800 p-2 rounded-lg text-left transition hover:border-amber-500/50 flex flex-col justify-between">
          <span class="font-bold text-xs text-slate-200 line-clamp-2 mb-1">\${i.name}</span>
          <span class="text-xs font-black text-amber-500">\${i.price.toFixed(2)}€</span>
        </button>
      \`).join('');
    }

    function addToCart(id) {
      const item = menuItems.find(i => i.id === id);
      const exist = currentCart.find(i => i.id === id);
      if (exist) exist.qty++;
      else currentCart.push({ ...item, qty: 1 });
      renderCart();
    }

    function updateQty(id, delta) {
      const idx = currentCart.findIndex(i => i.id === id);
      if (idx !== -1) {
        currentCart[idx].qty += delta;
        if (currentCart[idx].qty <= 0) currentCart.splice(idx, 1);
      }
      renderCart();
    }

    function renderCart() {
      const list = document.getElementById('cart-items-list');
      const total = currentCart.reduce((sum, i) => sum + (i.price * i.qty), 0);
      document.getElementById('cart-total').innerText = \`\${total.toFixed(2)}€\`;

      if (currentCart.length === 0) {
        list.innerHTML = \`<div class="text-center py-6 text-slate-600 text-xs">Sin ítems seleccionados</div>\`;
        return;
      }

      list.innerHTML = currentCart.map(i => \`
        <div class="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center text-xs">
          <span class="font-semibold text-slate-300 truncate pr-1">\${i.name}</span>
          <div class="flex items-center gap-1.5 shrink-0">
            <button onclick="updateQty('\${i.id}', -1)" class="w-4 h-4 bg-slate-800 text-slate-300 rounded flex items-center justify-center">-</button>
            <span class="font-bold text-amber-400 font-mono">\${i.qty}</span>
            <button onclick="updateQty('\${i.id}', 1)" class="w-4 h-4 bg-slate-800 text-slate-300 rounded flex items-center justify-center">+</button>
          </div>
        </div>
      \`).join('');
    }

    function submitOrder() {
      if (currentCart.length === 0) return;
      const client = document.getElementById('client-id-input').value.trim();
      const type = document.getElementById('order-type-select').value;
      const notes = document.getElementById('order-notes-input').value.trim();

      socket.emit('new_order', { client, type, notes, items: currentCart });

      currentCart = [];
      document.getElementById('client-id-input').value = '';
      document.getElementById('order-notes-input').value = '';
      renderCart();
    }

    // COCINA
    function renderKitchen() {
      const active = ordersList.filter(o => o.status === 'preparando');
      const grid = document.getElementById('kitchen-orders-grid');

      if (active.length === 0) {
        grid.innerHTML = \`<div class="col-span-full text-center py-20 text-slate-600 text-sm">Sin comandas pendientes en cocina</div>\`;
        return;
      }

      grid.innerHTML = active.map((ord, idx) => {
        const mins = Math.floor((Date.now() - ord.timestamp) / 60000);
        const isUrgent = mins >= 10;
        return \`
          <div class="bg-slate-900 border \${isUrgent ? 'border-red-500 animate-ring' : 'border-slate-800'} rounded-xl p-3 flex flex-col justify-between shadow-lg">
            <div>
              <div class="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <span class="font-black text-sm text-amber-400">#\${ord.ticketNum} - \${ord.client}</span>
                <span class="text-[10px] font-mono bg-slate-950 px-1.5 py-0.5 rounded text-slate-400">\${mins} min</span>
              </div>
              <ul class="space-y-1 text-xs text-slate-200 mb-2">
                \${ord.items.map(i => \`<li class="flex justify-between"><span>\${i.name}</span><strong class="text-amber-400">x\${i.qty}</strong></li>\`).join('')}
              </ul>
              \${ord.notes ? \`<p class="text-[10px] text-amber-300 bg-amber-500/10 p-1.5 rounded mb-2"><strong>Nota:</strong> \${ord.notes}</p>\` : ''}
            </div>
            <button onclick="socket.emit('update_status', { id: '\${ord.id}', status: 'listo' })" class="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-2 rounded text-xs">
              MARCAR LISTO
            </button>
          </div>
        \`;
      }).join('');
    }

    // SALÓN
    function renderSalon() {
      const prep = ordersList.filter(o => o.status === 'preparando');
      const listos = ordersList.filter(o => o.status === 'listo');

      document.getElementById('salon-preparando-list').innerHTML = prep.map(o => \`
        <div class="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-center">
          <span class="font-bold text-sm text-slate-300 block truncate">#\${o.ticketNum} \${o.client}</span>
        </div>
      \`).join('');

      document.getElementById('salon-listos-list').innerHTML = listos.map(o => \`
        <div class="bg-emerald-500/10 border-2 border-emerald-500 p-3 rounded-xl flex justify-between items-center">
          <div>
            <span class="font-black text-xl text-emerald-400 block">#\${o.ticketNum} \${o.client}</span>
            <span class="text-[10px] text-emerald-300 font-semibold">PASAR A BARRA</span>
          </div>
          \${userRole === 'barra' ? \`<button onclick="socket.emit('update_status', { id: '\${o.id}', status: 'entregado' })" class="bg-emerald-500 text-black text-xs font-bold px-2.5 py-1 rounded">Entregado</button>\` : ''}
        </div>
      \`).join('');
    }

    function playBeep() {
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.value = 587.33;
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch (e) {}
    }
  </script>
</body>
</html>
  `);
});

// LOGICA SERVIDOR WEBSOCKETS
io.on('connection', (socket) => {

  // Validar PIN de Acceso
  socket.on('login', (pin) => {
    if (pin === ROLES_PINS.barra) socket.emit('login_success', 'barra');
    else if (pin === ROLES_PINS.cocina) socket.emit('login_success', 'cocina');
    else if (pin === ROLES_PINS.salon) socket.emit('login_success', 'salon');
    else socket.emit('login_error');
  });

  // Enviar lista actual al conectarse
  socket.emit('sync_orders', activeOrders);

  // Nuevo pedido desde Barra
  socket.on('new_order', (data) => {
    const ticket = orderCounter++;
    const newOrder = {
      id: 'ORD-' + Date.now(),
      ticketNum: ticket,
      client: data.client || `Cliente #${ticket}`,
      type: data.type,
      notes: data.notes,
      items: data.items,
      status: 'preparando',
      timestamp: Date.now()
    };
    activeOrders.unshift(newOrder);
    io.emit('sync_orders', activeOrders);
  });

  // Actualizar estado (Preparando -> Listo -> Entregado)
  socket.on('update_status', ({ id, status }) => {
    const order = activeOrders.find(o => o.id === id);
    if (order) {
      if (status === 'entregado') {
        activeOrders = activeOrders.filter(o => o.id !== id);
      } else {
        order.status = status;
      }
      io.emit('sync_orders', activeOrders);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});