
import React, { useMemo } from 'react';
import { Table, DailyStats, OrderItem } from '../types';

interface KitchenPageProps {
  tables: Table[];
  dailyStats: DailyStats;
  onComplete: (tableId: number, orderId: string, status: 'DONE') => void;
  onDelete: (tableId: number, orderId: string) => void;
}

const KitchenPage: React.FC<KitchenPageProps> = ({ tables, onComplete, onDelete, dailyStats }) => {
  const pendingOrders = useMemo(() => {
    const orders: { tableId: number; order: OrderItem }[] = [];
    tables.forEach(t => {
      t.orders.forEach(o => {
        if (o.status === 'PENDING' && o.category === 'Prato') {
          orders.push({ tableId: t.id, order: o });
        }
      });
    });
    return orders.sort((a, b) => a.order.timestamp - b.order.timestamp);
  }, [tables]);

  const completedCount = useMemo(() => 
    tables.reduce((acc, t) => acc + t.orders.filter(o => o.status === 'DONE' && o.category === 'Prato').length, 0)
  , [tables]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black">Cozinha</h2>
        <span className="bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase">{pendingOrders.length} Pendentes</span>
      </div>

      <div className="space-y-4">
        {pendingOrders.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/50 rounded-3xl border border-dashed border-slate-700">
            <i className="fas fa-check-circle text-4xl text-emerald-500/20 mb-3"></i>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Tudo limpo por aqui!</p>
          </div>
        ) : (
          pendingOrders.map(({ tableId, order }) => (
            <div key={order.id} className="bg-[#1e293b] p-5 rounded-2xl border-l-4 border-amber-500 shadow-xl flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black text-amber-500 uppercase">Mesa {tableId}</span>
                <h4 className="text-lg font-black text-slate-100 mt-1">{order.name}</h4>
                <p className="text-xs text-slate-500 font-bold mt-1">
                  <i className="far fa-clock mr-1"></i>
                  {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onDelete(tableId, order.id)} className="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl active:scale-90 transition-transform"><i className="fas fa-trash"></i></button>
                <button onClick={() => onComplete(tableId, order.id, 'DONE')} className="w-12 h-12 bg-[#52c48a]/10 text-[#52c48a] rounded-xl active:scale-90 transition-transform text-xl"><i className="fas fa-check"></i></button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-8 border-t border-slate-800 grid grid-cols-2 gap-4">
        <div className="bg-[#1e293b] p-4 rounded-2xl border border-slate-800">
           <span className="text-[8px] uppercase font-black text-slate-500 tracking-widest">Concluídos Hoje</span>
           <p className="text-2xl font-black text-emerald-500">{completedCount}</p>
        </div>
        <div className="bg-[#1e293b] p-4 rounded-2xl border border-slate-800">
           <span className="text-[8px] uppercase font-black text-slate-500 tracking-widest">Eficiência</span>
           <p className="text-2xl font-black text-amber-500">100%</p>
        </div>
      </div>
    </div>
  );
};

export default KitchenPage;