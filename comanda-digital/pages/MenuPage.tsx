
import React, { useState, useMemo } from 'react';
import { MenuItem, Table } from '../types';

interface MenuPageProps {
  menu: MenuItem[];
  tables: Table[];
  onAdd: (item: Omit<MenuItem, 'id'>) => void;
  onUpdate: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onSendToTable: (tableId: number, item: MenuItem, quantity: number) => void;
}

const MenuPage: React.FC<MenuPageProps> = ({ menu, tables, onAdd, onUpdate, onDelete, onSendToTable }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  // Estados para o fluxo de pedido
  const [itemSelectingQuantity, setItemSelectingQuantity] = useState<MenuItem | null>(null);
  const [selectedItemForOrder, setSelectedItemForOrder] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { name: 'Prato', label: 'Pratos', icon: 'fa-hamburger' },
    { name: 'Bebidas Sem Alcool', label: 'Bebidas', icon: 'fa-glass-water' },
    { name: 'Bebidas Alcólicas', label: 'Alcoólicos', icon: 'fa-beer-mug-empty' }
  ];

  // Ordem visual do mapa de mesas (Exatamente como solicitado e usado em TablesPage)
  const tableLayoutOrder = [
    11, 4, 3,
    10, 5, 2,
    9, 6, 1,
    8, 7, null
  ];

  const filteredMenu = menu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Comandas extras/por nome (todas disponíveis para receber pedido)
  const extraTables = useMemo(() => 
    tables.filter(t => t.id > 11 || t.customerName)
  , [tables]);

  const handleItemClick = (item: MenuItem) => {
    setQuantity(1);
    setItemSelectingQuantity(item);
  };

  const confirmQuantity = () => {
    setSelectedItemForOrder(itemSelectingQuantity);
    setItemSelectingQuantity(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Estilo Mockup */}
      <div className="flex justify-between items-center">
        <button className="text-slate-400 text-2xl"><i className="fas fa-bars"></i></button>
        <h2 className="text-xl font-bold">Menu</h2>
        <div className="w-8"></div>
      </div>

      {/* Filtros de Categorias */}
      <div className="flex justify-around py-2 overflow-x-auto no-scrollbar gap-2">
        {categories.map((cat) => (
          <button 
            key={cat.name}
            onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
            className="flex flex-col items-center gap-2 group min-w-[80px]"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${selectedCategory === cat.name ? 'border-[#52c48a] bg-[#52c48a] text-[#0f172a]' : 'border-amber-500/30 text-amber-500'}`}>
              <i className={`fas ${cat.icon}`}></i>
            </div>
            <span className={`text-[9px] font-black uppercase tracking-tighter ${selectedCategory === cat.name ? 'text-[#52c48a]' : 'text-slate-500'}`}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      {/* Busca */}
      <div className="relative">
        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
        <input 
          type="text" 
          placeholder="Buscar no cardápio..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1e293b] border-2 border-emerald-500/20 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-emerald-500/50 transition-all"
        />
      </div>

      {/* Lista de Itens */}
      <div className="flex flex-col gap-4">
        {filteredMenu.map(item => (
          <div key={item.id} className="bg-[#1e293b] p-3 rounded-2xl flex items-center gap-4 shadow-lg border border-slate-800/50 min-h-[100px]">
            <div 
              onClick={() => handleItemClick(item)}
              className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer shadow-inner bg-slate-900"
            >
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 active:opacity-100 transition-opacity">
                <i className="fas fa-plus text-white text-lg"></i>
              </div>
            </div>

            <div 
              onClick={() => handleItemClick(item)}
              className="flex-1 min-w-0 cursor-pointer flex flex-col justify-center"
            >
              <h4 className="text-base font-black text-slate-100 leading-tight line-clamp-2 overflow-hidden">
                {item.name}
              </h4>
              <div className="flex items-center flex-wrap gap-2 mt-1">
                <span className="text-[#52c48a] font-black text-sm whitespace-nowrap">R$ {item.price.toFixed(2)}</span>
                <span className="text-[7px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 font-bold uppercase tracking-wider">
                  {item.category === 'Bebidas Alcólicas' ? 'Alcólico' : item.category === 'Bebidas Sem Alcool' ? 'Bebida' : 'Prato'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 pr-1">
              <button 
                onClick={(e) => { e.stopPropagation(); setEditingItem(item); }} 
                className="text-slate-500 hover:text-blue-400 transition-colors p-2 text-2xl active:scale-90"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} 
                className="text-slate-500 hover:text-red-500 transition-colors p-2 text-2xl active:scale-90"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FAB Adicionar Item ao Cardápio */}
      <button 
        onClick={() => setIsAdding(true)}
        className="fixed bottom-24 right-6 bg-amber-500 text-slate-900 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl active:scale-95 z-40 border-4 border-[#0f172a]"
      >
        <i className="fas fa-plus text-xl"></i>
      </button>

      {/* Modal 1: SELETOR DE QUANTIDADE */}
      {itemSelectingQuantity && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-6">
          <div className="bg-[#1e293b] w-full max-w-sm rounded-[2rem] p-8 border border-slate-700 shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200">
            <img src={itemSelectingQuantity.imageUrl} className="w-24 h-24 rounded-2xl object-cover mb-4 shadow-xl border-2 border-slate-700" alt="" />
            <h3 className="text-xl font-black text-white text-center mb-1">{itemSelectingQuantity.name}</h3>
            <p className="text-[#52c48a] font-bold text-sm mb-8">R$ {itemSelectingQuantity.price.toFixed(2)} unit.</p>
            
            <div className="flex items-center gap-8 mb-10">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-3xl font-black text-slate-400 active:scale-90 border border-slate-700">
                <i className="fas fa-minus"></i>
              </button>
              <span className="text-6xl font-black text-white min-w-[80px] text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-16 h-16 bg-[#52c48a] rounded-full flex items-center justify-center text-3xl font-black text-[#0f172a] active:scale-90 shadow-lg shadow-emerald-500/20">
                <i className="fas fa-plus"></i>
              </button>
            </div>

            <div className="w-full flex flex-col gap-3">
              <button onClick={confirmQuantity} className="w-full py-5 bg-[#52c48a] text-[#0f172a] rounded-2xl font-black text-lg shadow-xl uppercase tracking-widest active:scale-95 transition-all">
                Confirmar Quantidade
              </button>
              <button onClick={() => setItemSelectingQuantity(null)} className="w-full py-4 text-slate-500 font-bold text-xs uppercase tracking-widest">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: SELEÇÃO DE MESA (Redesenhado para ser idêntico ao mapa principal) */}
      {selectedItemForOrder && (
        <div className="fixed inset-0 bg-[#0f172a] z-[120] flex flex-col p-6 overflow-y-auto no-scrollbar animate-in slide-in-from-right duration-300">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setSelectedItemForOrder(null)} className="text-slate-500 text-2xl p-2 active:scale-75 transition-transform">
              <i className="fas fa-arrow-left"></i>
            </button>
            <div className="text-center">
               <h3 className="text-xl font-black uppercase tracking-widest text-white">Onde servir?</h3>
               <p className="text-[10px] text-[#52c48a] font-bold uppercase tracking-widest">
                Lançando {quantity}x {selectedItemForOrder.name}
               </p>
            </div>
            <div className="w-12"></div>
          </div>

          {/* Grid de Mesas Fixas (Idêntico ao TablesPage) */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {tableLayoutOrder.map((tableId, index) => {
              if (tableId === null) return <div key={`empty-${index}`} className="w-full aspect-square"></div>;
              
              const table = tables.find(t => t.id === tableId);
              const isActive = table && table.orders.length > 0;
              
              return (
                <button
                  key={`sel-table-${tableId}`}
                  onClick={() => {
                    onSendToTable(tableId, selectedItemForOrder, quantity);
                    setSelectedItemForOrder(null);
                  }}
                  className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center transition-all border-2 active:scale-90 ${
                    isActive 
                      ? 'bg-[#1e293b] border-emerald-500 shadow-lg shadow-emerald-500/10 text-white' 
                      : 'bg-transparent border-slate-800 text-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-black opacity-30 block -mb-1">MESA</span>
                  <span className="text-3xl font-black">{tableId}</span>
                </button>
              );
            })}
          </div>

          {/* Seção de Comandas Extras (Idêntico ao TablesPage) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="h-px flex-1 bg-slate-800"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Comandas Avulsas</span>
              <div className="h-px flex-1 bg-slate-800"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pb-10">
              {extraTables.map(t => (
                <button
                  key={`sel-extra-${t.id}`}
                  onClick={() => {
                    onSendToTable(t.id, selectedItemForOrder, quantity);
                    setSelectedItemForOrder(null);
                  }}
                  className={`border-2 p-4 rounded-2xl flex items-center justify-between shadow-lg active:scale-95 transition-all ${
                    t.orders.length > 0 
                    ? 'bg-[#1e293b] border-emerald-500/30' 
                    : 'bg-slate-900 border-slate-700 opacity-80'
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
                  <i className="fas fa-plus text-xs text-amber-500"></i>
                </button>
              ))}
              {extraTables.length === 0 && (
                <p className="col-span-2 text-center text-slate-600 text-[10px] font-bold uppercase py-4">Nenhuma comanda extra aberta</p>
              )}
            </div>
          </div>
          
          <button 
            onClick={() => setSelectedItemForOrder(null)} 
            className="w-full py-5 bg-slate-900/50 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-slate-800 mt-auto"
          >
            Cancelar Lançamento
          </button>
        </div>
      )}

      {/* Modais Administrativos */}
      {(isAdding || editingItem) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[130] flex items-center justify-center p-6">
          <div className="bg-[#1e293b] w-full rounded-3xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold mb-4">{isAdding ? 'Novo Item' : 'Editar Item'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const itemData = {
                name: formData.get('name') as string,
                price: parseFloat(formData.get('price') as string),
                category: formData.get('category') as string,
                imageUrl: formData.get('imageUrl') as string,
              };
              if (editingItem) {
                onUpdate({ ...editingItem, ...itemData });
              } else {
                onAdd(itemData);
              }
              setIsAdding(false);
              setEditingItem(null);
            }} className="space-y-4">
              <input name="name" defaultValue={editingItem?.name} placeholder="Nome" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none text-slate-100" required />
              <input name="imageUrl" defaultValue={editingItem?.imageUrl} placeholder="URL Imagem" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none text-slate-100" />
              <div className="grid grid-cols-2 gap-4">
                <input name="price" type="number" step="0.01" defaultValue={editingItem?.price} placeholder="Preço" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none text-slate-100" required />
                <select name="category" defaultValue={editingItem?.category || 'Prato'} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none text-slate-100">
                  <option value="Prato">Prato</option>
                  <option value="Bebidas Alcólicas">Bebidas Alcólicas</option>
                  <option value="Bebidas Sem Alcool">Bebidas Sem Alcool</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => { setIsAdding(false); setEditingItem(null); }} className="flex-1 py-3 bg-slate-800 rounded-xl font-bold">Voltar</button>
                <button type="submit" className="flex-1 py-3 bg-[#52c48a] text-[#0f172a] rounded-xl font-bold">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
