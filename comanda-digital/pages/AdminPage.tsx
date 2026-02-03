
import React, { useState } from 'react';
import { DailyStats } from '../types';

interface AdminPageProps {
  stats: DailyStats;
  onReset: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ stats, onReset }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'caixa' && password === '2345') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Credenciais inválidas!');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto border-2 border-slate-700 shadow-xl mb-4">
            <i className="fas fa-lock text-[#52c48a] text-3xl"></i>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-widest">Acesso <span className="text-[#52c48a]">Admin</span></h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Área restrita ao fechamento</p>
        </div>

        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input
                type="text"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 p-4 pl-12 rounded-2xl outline-none focus:border-[#52c48a] transition-all text-sm font-medium"
                required
              />
            </div>
            <div className="relative">
              <i className="fas fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 p-4 pl-12 rounded-2xl outline-none focus:border-[#52c48a] transition-all text-sm font-medium"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center animate-bounce">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-[#52c48a] text-[#0f172a] rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg active:scale-95 transition-all mt-4"
          >
            Entrar no Sistema
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black">Caixa</h2>
        <button 
          onClick={() => setIsLoggedIn(false)} 
          className="text-slate-500 hover:text-red-400 text-xs font-bold flex items-center gap-2"
        >
          Sair <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>

      <div className="bg-gradient-to-br from-[#52c48a] to-emerald-800 p-8 rounded-[2.5rem] text-[#0f172a] shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[#0f172a]/60 text-xs font-black uppercase tracking-widest">Faturamento do Dia</span>
          <h3 className="text-5xl font-black mt-2 mb-8">R$ {stats.totalRevenue.toFixed(0)}<span className="text-2xl opacity-50">,{(stats.totalRevenue % 1).toFixed(2).split('.')[1]}</span></h3>
          
          <div className="flex justify-between items-center">
             <div>
               <p className="text-xs font-black uppercase opacity-60">Atendimentos</p>
               <p className="text-2xl font-black">{stats.completedOrdersCount}</p>
             </div>
             <div className="bg-[#0f172a]/10 p-3 rounded-2xl"><i className="fas fa-vault text-2xl"></i></div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Fluxo de Caixa</h3>
          <span className="text-[10px] font-bold text-slate-600 uppercase">{stats.history.length} Operações</span>
        </div>
        <div className="space-y-2">
          {stats.history.length === 0 ? (
            <div className="text-center py-10 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
               <p className="text-slate-600 italic text-sm">Sem movimentações...</p>
            </div>
          ) : (
            stats.history.slice().reverse().map((entry, i) => (
              <div key={i} className="bg-[#1e293b] p-4 rounded-xl flex justify-between items-center border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center font-black text-xs text-emerald-500 shadow-inner">{entry.tableId}</div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">Mesa {entry.tableId}</h4>
                    <p className="text-[10px] text-slate-500 font-bold">
                      {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {entry.withService ? 'C/ Taxa' : 'S/ Taxa'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-emerald-500">R$ {entry.amount.toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button 
        onClick={() => {
          if(confirm('Deseja realmente zerar o caixa do dia? Esta ação não pode ser desfeita.')) {
            onReset();
          }
        }}
        className="w-full py-5 bg-red-500/10 text-red-500 font-black rounded-2xl border border-red-500/20 active:bg-red-500/20 transition-all uppercase tracking-widest text-xs mt-10"
      >
        Limpar Caixa do Dia
      </button>
    </div>
  );
};

export default AdminPage;
