
import React, { useState, useMemo } from 'react';
import { Table, OrderItem } from '../types';
import { SERVICE_FEE } from '../constants';

interface TablesPageProps {
  tables: Table[];
  onCloseAccount: (tableId: number, useServiceFee: boolean) => void;
  onRemoveItem: (tableId: number, orderId: string) => void;
  onAddCustomTable: (name: string) => void;
}

interface GroupedOrder {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  lastOrderId: string;
}

const TablesPage: React.FC<TablesPageProps> = ({ tables, onCloseAccount, onRemoveItem, onAddCustomTable }) => {
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [newCustomerName, setNewCustomerName] = useState('');

  // Mapeamento visual das mesas fixas (1 a 11) conforme solicitado
  const tableLayoutOrder = [
    11, 4, 3,
    10, 5, 2,
    9, 6, 1,
    8, 7, null
  ];

  const selectedTable = useMemo(() => tables.find(t => t.id === selectedTableId) || null, [tables, selectedTableId]);

  const groupedOrders = useMemo(() => {
    if (!selectedTable) return [];
    return selectedTable.orders.reduce((acc: GroupedOrder[], order: OrderItem) => {
      const existing = acc.find(item => item.name === order.name);
      if (existing) {
        existing.quantity += 1;
        existing.totalPrice += order.price;
        existing.lastOrderId = order.id;
      } else {
        acc.push({ name: order.name, quantity: 1, unitPrice: order.price, totalPrice: order.price, lastOrderId: order.id });
      }
      return acc;
    }, []);
  }, [selectedTable]);

  const subtotal = useMemo(() => selectedTable ? selectedTable.orders.reduce((acc, curr) => acc + curr.price, 0) : 0, [selectedTable]);
  const serviceCharge = useMemo(() => subtotal * SERVICE_FEE, [subtotal]);

  // Filtra as mesas que não estão no grid (comandas personalizadas e mesas > 11)
  // Removida a trava de orders.length > 0 para permitir visualizar comandas vazias recém-abertas
  const extraTables = tables.filter(t => t.id > 11 || t.customerName);

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCustomerName.trim()) {
      onAddCustomTable(newCustomerName.trim());
      setNewCustomerName('');
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center space-y-1">
        <i className="fas fa-map-location-dot text-amber-500 text-3xl"></i>
        <h1 className="text-xl font-black uppercase tracking-widest">Mapa de <br/><span className="text-[#52c48a]">Mesas</span></h1>
      </div>
      
      {/* Grid de Mesas Fixas (1-11) */}
      <div className="grid grid-cols-3 gap-3">
        {tableLayoutOrder.map((tableId, index) => {
          if (tableId === null) return <div key={`empty-${index}`} className="w-full aspect-square"></div>;
          
          const table = tables.find(t => t.id === tableId);
          const isActive = table && table.orders.length > 0;
          
          return (
            <div key={`table-${tableId}`} className="relative">
               <button
                onClick={() => setSelectedTableId(tableId)}
                className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center transition-all border-2 active:scale-90 ${
                  isActive 
                    ? 'bg-[#1e293b] border-emerald-500 shadow-lg shadow-emerald-500/10 text-white' 
                    : 'bg-transparent border-slate-800 text-slate-700'
                }`}
              >
                <span className="text-xs font-black opacity-30 block -mb-1">MESA</span>
                <span className="text-3xl font-black">{tableId}</span>
                {isActive && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Seção de Comandas Extras/Personalizadas */}
      <div className="space-y-4 pt-6">
        <div className="flex items-center gap-3 px-2">
          <div className="h-px flex-1 bg-slate-800"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Comandas Avulsas</span>
          <div className="h-px flex-1 bg-slate-800"></div>
        </div>

        {/* Formulário para adicionar comanda por nome */}
        <form onSubmit={handleAddCustom} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Nome do Cliente..." 
            value={newCustomerName}
            onChange={(e) => setNewCustomerName(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none transition-all"
          />
          <button 
            type="submit"
            className="bg-amber-500 text-slate-900 px-4 rounded-xl font-black text-xs uppercase active:scale-95 transition-all"
          >
            Abrir
          </button>
        </form>

        {/* Lista de comandas ativas fora do grid ou por nome */}
        <div className="grid grid-cols-2 gap-3">
          {extraTables.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTableId(t.id)}
              className={`border-2 p-4 rounded-2xl flex items-center justify-between shadow-lg active:scale-95 transition-all ${
                t.orders.length > 0 
                ? 'bg-[#1e293b] border-emerald-500/30' 
                : 'bg-slate-900 border-slate-700 opacity-60'
              }`}
            >
              <div className="text-left">
                <span className={`text-[8px] font-black uppercase block leading-none ${t.orders.length > 0 ? 'text-emerald-500' : 'text-slate-500'}`}>
                  {t.customerName ? 'CLIENTE' : `MESA ${t.id}`}
                </span>
                <span className="text-sm font-black text-white truncate max-w-[100px] block">
                  {t.customerName || `Mesa ${t.id}`}
                </span>
              </div>
              <i className={`fas ${t.orders.length > 0 ? 'fa-chevron-right text-emerald-500' : 'fa-plus text-slate-600'} text-xs`}></i>
            </button>
          ))}
          {extraTables.length === 0 && (
            <p className="col-span-2 text-center text-slate-600 text-[10px] font-bold uppercase py-4">Nenhuma comanda extra ativa</p>
          )}
        </div>
      </div>

      {/* Overlay de Detalhes da Mesa (Modal) */}
      {selectedTable && (
        <div className="fixed inset-0 bg-[#0f172a] z-[100] flex flex-col p-6 animate-in slide-in-from-right duration-300">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setSelectedTableId(null)} className="text-slate-500 text-2xl p-2 active:scale-75 transition-transform">
              <i className="fas fa-arrow-left"></i>
            </button>
            <div className="text-center">
               <h3 className="text-2xl font-black">{selectedTable.customerName || `Mesa ${selectedTable.id}`}</h3>
               <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedTable.orders.length > 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                {selectedTable.orders.length > 0 ? 'Conta Aberta' : 'Vazia / Novo Pedido'}
               </p>
            </div>
            <div className="w-12"></div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-4">
            {groupedOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-20">
                <i className="fas fa-receipt text-6xl mb-4"></i>
                <p className="font-bold uppercase tracking-widest text-xs">Vá para o Cardápio e adicione itens!</p>
              </div>
            ) : (
              groupedOrders.map((group, idx) => (
                <div key={idx} className="bg-slate-800/40 p-4 rounded-2xl flex justify-between items-center border border-slate-700/50">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="bg-amber-500 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-lg uppercase">x{group.quantity}</span>
                      <span className="text-white font-black text-base">{group.name}</span>
                    </div>
                    <span className="text-slate-500 text-[9px] font-bold uppercase ml-11 tracking-wider">Unit: R$ {group.unitPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-[#52c48a] font-black text-sm">R$ {group.totalPrice.toFixed(2)}</span>
                     <button onClick={() => onRemoveItem(selectedTable.id, group.lastOrderId)} className="w-9 h-9 flex items-center justify-center bg-red-500/10 text-red-500 rounded-xl active:scale-90">
                        <i className="fas fa-trash-can text-xs"></i>
                     </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedTable.orders.length > 0 && (
            <div className="pt-4 space-y-4 animate-in fade-in slide-in-from-bottom-5">
               <div className="bg-slate-800/60 p-6 rounded-[2rem] border border-slate-700/50 space-y-3 shadow-2xl">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Consumo</span>
                    <span className="text-slate-300 font-black text-lg">R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
                    <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Serviço (10%)</span>
                    <span className="text-amber-500 font-black text-lg">+ R$ {serviceCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[#52c48a] font-black text-xs uppercase tracking-widest">Total Geral</span>
                    <span className="text-[#52c48a] font-black text-3xl">R$ {(subtotal + serviceCharge).toFixed(2)}</span>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 gap-3">
                 <button
                    onClick={() => { onCloseAccount(selectedTable.id, true); setSelectedTableId(null); }}
                    className="w-full bg-[#52c48a] text-[#0f172a] py-5 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all flex flex-col items-center justify-center border-b-4 border-emerald-700"
                 >
                   PAGAR COM TAXA
                   <span className="text-[10px] font-black mt-1 opacity-70">R$ {(subtotal + serviceCharge).toFixed(2)}</span>
                 </button>
                 
                 <button
                    onClick={() => { onCloseAccount(selectedTable.id, false); setSelectedTableId(null); }}
                    className="w-full py-4 bg-slate-800 text-slate-500 rounded-2xl font-bold text-[10px] uppercase tracking-widest border border-slate-700 active:scale-95 transition-all"
                 >
                   Pagar Sem Taxa (R$ {subtotal.toFixed(2)})
                 </button>
               </div>
            </div>
          )}
          {selectedTable.orders.length === 0 && (
             <button
              onClick={() => setSelectedTableId(null)}
              className="w-full py-5 bg-slate-800 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs"
             >
               Fechar Painel
             </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TablesPage;
