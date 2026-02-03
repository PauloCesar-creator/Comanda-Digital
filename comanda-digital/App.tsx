
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { MenuItem, Table, OrderItem, DailyStats } from './types';
import { INITIAL_MENU, TOTAL_TABLES, SERVICE_FEE } from './constants';
import { db } from './firebase';
import { ref, onValue, set, update, push } from 'firebase/database';

// Pages
import MenuPage from './pages/MenuPage';
import TablesPage from './pages/TablesPage';
import KitchenPage from './pages/KitchenPage';
import AdminPage from './pages/AdminPage';

// Components
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    totalRevenue: 0,
    completedOrdersCount: 0,
    history: []
  });

  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false
  });

  // Listeners em tempo real do Firebase
  useEffect(() => {
    // 1. Monitorar Cardápio
    const menuRef = ref(db, 'menu');
    onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMenu(Object.values(data));
      } else {
        // Se estiver vazio, inicializa com os padrões
        set(menuRef, INITIAL_MENU);
      }
    });

    // 2. Monitorar Mesas
    const tablesRef = ref(db, 'tables');
    onValue(tablesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Firebase transforma arrays em objetos às vezes, garantimos que seja array
        const tableList = Array.isArray(data) ? data : Object.values(data);
        setTables(tableList);
      } else {
        // Se estiver vazio, inicializa com 15 mesas fixas
        const initialTables = Array.from({ length: TOTAL_TABLES }, (_, i) => ({ id: i + 1, orders: [] }));
        set(tablesRef, initialTables);
      }
    });

    // 3. Monitorar Estatísticas
    const statsRef = ref(db, 'dailyStats');
    onValue(statsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDailyStats({
          ...data,
          history: data.history ? Object.values(data.history) : []
        });
      }
    });
  }, []);

  const triggerNotification = (message: string) => {
    setNotification({ message, visible: true });
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (error) {}
    setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 3000);
  };

  // Operações de Cardápio no Firebase
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const id = Date.now().toString();
    set(ref(db, `menu/${id}`), { ...item, id });
  };

  const updateMenuItem = (item: MenuItem) => {
    set(ref(db, `menu/${item.id}`), item);
  };

  const deleteMenuItem = (id: string) => {
    set(ref(db, `menu/${id}`), null);
  };

  const addCustomTable = (name: string) => {
    const nextId = Math.max(...tables.map(t => t.id), 100) + 1;
    // No Firebase, adicionamos um novo nó no array/objeto de mesas
    const newTable = { id: nextId, customerName: name, orders: [] };
    
    // Atualiza a lista completa de mesas no Firebase
    set(ref(db, 'tables'), [...tables, newTable]);
    triggerNotification(`Comanda aberta: ${name}`);
  };

  // Função Principal: Adicionar Pedido (Realtime)
  const sendOrderToTable = (tableId: number, menuItem: MenuItem, quantity: number = 1) => {
    // Localizar índice da mesa
    const tableIndex = tables.findIndex(t => t.id === tableId);
    if (tableIndex === -1) return;

    const table = tables[tableIndex];
    const newOrders: OrderItem[] = Array.from({ length: quantity }, (_, idx) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9) + idx,
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      category: menuItem.category,
      status: 'PENDING',
      timestamp: Date.now()
    }));

    // Atualiza apenas os pedidos daquela mesa no Firebase
    const updatedOrders = [...(table.orders || []), ...newOrders];
    set(ref(db, `tables/${tableIndex}/orders`), updatedOrders);

    const displayName = table.customerName || `Mesa ${tableId}`;
    triggerNotification(`${quantity}x ${menuItem.name} em ${displayName}`);
  };

  // Atualizar Status (Cozinha -> Pronto)
  const updateOrderStatus = (tableId: number, orderId: string, status: 'DONE') => {
    const tableIndex = tables.findIndex(t => t.id === tableId);
    if (tableIndex === -1) return;

    const table = tables[tableIndex];
    const updatedOrders = table.orders.map(o => o.id === orderId ? { ...o, status } : o);
    
    set(ref(db, `tables/${tableIndex}/orders`), updatedOrders);
  };

  // Função Principal: Remover Pedido (Realtime)
  const removeOrder = (tableId: number, orderId: string) => {
    const tableIndex = tables.findIndex(t => t.id === tableId);
    if (tableIndex === -1) return;

    const table = tables[tableIndex];
    const updatedOrders = table.orders.filter(o => o.id !== orderId);
    
    set(ref(db, `tables/${tableIndex}/orders`), updatedOrders);
  };

  const closeTableAccount = (tableId: number, useServiceFee: boolean) => {
    const table = tables.find(t => t.id === tableId);
    if (!table || !table.orders || table.orders.length === 0) return;
    
    const subtotal = table.orders.reduce((acc, curr) => acc + curr.price, 0);
    const finalAmount = useServiceFee ? subtotal * (1 + SERVICE_FEE) : subtotal;
    
    // 1. Atualizar Estatísticas no Firebase
    const newStats = {
      totalRevenue: dailyStats.totalRevenue + finalAmount,
      completedOrdersCount: dailyStats.completedOrdersCount + 1,
    };
    
    update(ref(db, 'dailyStats'), newStats);
    // Adicionar ao histórico usando push para gerar ID único
    push(ref(db, 'dailyStats/history'), { 
      tableId, 
      amount: finalAmount, 
      timestamp: Date.now(), 
      withService: useServiceFee 
    });
    
    // 2. Limpar ou remover a mesa
    if (tableId > 100) {
      // Remover comanda personalizada
      const updatedTables = tables.filter(t => t.id !== tableId);
      set(ref(db, 'tables'), updatedTables);
    } else {
      // Limpar mesa fixa
      const tableIndex = tables.findIndex(t => t.id === tableId);
      set(ref(db, `tables/${tableIndex}/orders`), []);
    }
    
    const displayName = table.customerName || `Mesa ${tableId}`;
    triggerNotification(`${displayName} finalizada! R$ ${finalAmount.toFixed(2)}`);
  };

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-[#0f172a] pb-24 text-slate-100">
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm transition-all duration-500 transform ${notification.visible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
          <div className="bg-[#52c48a] text-[#0f172a] p-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border-2 border-emerald-400">
            <i className="fas fa-check-circle text-lg"></i>
            <p className="text-sm">{notification.message}</p>
          </div>
        </div>

        <main className="flex-1 max-w-lg mx-auto w-full p-6">
          <Routes>
            <Route path="/" element={<MenuPage menu={menu} onAdd={addMenuItem} onUpdate={updateMenuItem} onDelete={deleteMenuItem} onSendToTable={sendOrderToTable} tables={tables} />} />
            <Route path="/tables" element={<TablesPage tables={tables} onCloseAccount={closeTableAccount} onRemoveItem={removeOrder} onAddCustomTable={addCustomTable} />} />
            <Route path="/kitchen" element={<KitchenPage tables={tables} onComplete={updateOrderStatus} onDelete={removeOrder} dailyStats={dailyStats} />} />
            <Route path="/admin" element={<AdminPage stats={dailyStats} onReset={() => set(ref(db, 'dailyStats'), { totalRevenue: 0, completedOrdersCount: 0, history: [] })} />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </HashRouter>
  );
};

export default App;
