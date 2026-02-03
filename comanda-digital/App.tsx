
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { MenuItem, Table, OrderItem, DailyStats } from './types';
import { INITIAL_MENU, TOTAL_TABLES, SERVICE_FEE } from './constants';

// Pages
import MenuPage from './pages/MenuPage';
import TablesPage from './pages/TablesPage';
import KitchenPage from './pages/KitchenPage';
import AdminPage from './pages/AdminPage';

// Components
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [tables, setTables] = useState<Table[]>(
    Array.from({ length: TOTAL_TABLES }, (_, i) => ({ id: i + 1, orders: [] }))
  );
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    totalRevenue: 0,
    completedOrdersCount: 0,
    history: []
  });

  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false
  });

  useEffect(() => {
    const savedMenu = localStorage.getItem('rest_menu');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    const savedTables = localStorage.getItem('rest_tables');
    if (savedTables) setTables(JSON.parse(savedTables));
    const savedStats = localStorage.getItem('rest_stats');
    if (savedStats) setDailyStats(JSON.parse(savedStats));
  }, []);

  useEffect(() => {
    localStorage.setItem('rest_menu', JSON.stringify(menu));
    localStorage.setItem('rest_tables', JSON.stringify(tables));
    localStorage.setItem('rest_stats', JSON.stringify(dailyStats));
  }, [menu, tables, dailyStats]);

  const triggerNotification = (message: string) => {
    setNotification({ message, visible: true });
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (error) {}
    setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 3000);
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => setMenu([...menu, { ...item, id: Date.now().toString() }]);
  const updateMenuItem = (item: MenuItem) => setMenu(menu.map(m => m.id === item.id ? item : m));
  const deleteMenuItem = (id: string) => setMenu(menu.filter(m => m.id !== id));

  const addCustomTable = (name: string) => {
    const nextId = Math.max(...tables.map(t => t.id), 100) + 1;
    setTables([...tables, { id: nextId, customerName: name, orders: [] }]);
    triggerNotification(`Comanda aberta: ${name}`);
  };

  const sendOrderToTable = (tableId: number, menuItem: MenuItem, quantity: number = 1) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        const newOrders: OrderItem[] = Array.from({ length: quantity }, (_, idx) => ({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9) + idx,
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          category: menuItem.category,
          status: 'PENDING',
          timestamp: Date.now()
        }));
        
        const displayName = t.customerName || `Mesa ${tableId}`;
        const qtyText = quantity > 1 ? `(${quantity}x)` : '';
        
        if (menuItem.category === 'Prato') {
          triggerNotification(`Cozinha ${qtyText}: ${menuItem.name} (${displayName})`);
        } else if (menuItem.category.toLowerCase().includes('bebida')) {
          triggerNotification(`Bebida ${qtyText}: ${menuItem.name} enviada para ${displayName}`);
        } else {
          triggerNotification(`${qtyText} ${menuItem.name} adicionado a ${displayName}`);
        }
        
        return { ...t, orders: [...t.orders, ...newOrders] };
      }
      return t;
    }));
  };

  const updateOrderStatus = (tableId: number, orderId: string, status: 'DONE') => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return { ...t, orders: t.orders.map(o => o.id === orderId ? { ...o, status } : o) };
      }
      return t;
    }));
  };

  const removeOrder = (tableId: number, orderId: string) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, orders: t.orders.filter(o => o.id !== orderId) } : t));
  };

  const closeTableAccount = (tableId: number, useServiceFee: boolean) => {
    const table = tables.find(t => t.id === tableId);
    if (!table || table.orders.length === 0) return;
    
    const subtotal = table.orders.reduce((acc, curr) => acc + curr.price, 0);
    const finalAmount = useServiceFee ? subtotal * (1 + SERVICE_FEE) : subtotal;
    
    setDailyStats(prev => ({
      totalRevenue: prev.totalRevenue + finalAmount,
      completedOrdersCount: prev.completedOrdersCount + 1,
      history: [...prev.history, { tableId, amount: finalAmount, timestamp: Date.now(), withService: useServiceFee }]
    }));
    
    // Se for uma comanda personalizada (ID > 100), removemos da lista. Se for mesa fixa, apenas limpamos os pedidos.
    if (tableId > 100) {
      setTables(prev => prev.filter(t => t.id !== tableId));
    } else {
      setTables(prev => prev.map(t => t.id === tableId ? { ...t, orders: [] } : t));
    }
    
    const displayName = table.customerName || `Mesa ${tableId}`;
    triggerNotification(`${displayName} finalizada! Total: R$ ${finalAmount.toFixed(2)}`);
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
            <Route path="/admin" element={<AdminPage stats={dailyStats} onReset={() => setDailyStats({ totalRevenue: 0, completedOrdersCount: 0, history: [] })} />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </HashRouter>
  );
};

export default App;
