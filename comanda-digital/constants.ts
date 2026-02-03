
import { MenuItem } from './types';

export const INITIAL_MENU: MenuItem[] = [
  // Pratos
  { id: 'p1', name: 'Filé de Tilápia', price: 55.00, category: 'Prato', imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=200&q=80' },
  { id: 'p2', name: 'Costela de Caranha', price: 55.00, category: 'Prato', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80' },
  { id: 'p3', name: 'Frango a Passarinho', price: 45.00, category: 'Prato', imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=200&q=80' },
  { id: 'p4', name: 'Filé de Tilápia c/ Camarão', price: 85.00, category: 'Prato', imageUrl: 'https://images.unsplash.com/photo-1551248429-42405d283557?auto=format&fit=crop&w=200&q=80' },
  { id: 'p5', name: 'Batata Frita', price: 25.00, category: 'Prato', imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=200&q=80' },
  { id: 'p6', name: 'Batata Frita c/ Bacon e Cheddar', price: 30.00, category: 'Prato', imageUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=200&q=80' },
  { id: 'p7', name: 'Picanha acebolada', price: 90.00, category: 'Prato', imageUrl: 'https://images.unsplash.com/photo-1558030006-45c6758c331c?auto=format&fit=crop&w=200&q=80' },
  { id: 'p8', name: 'Mandioca', price: 20.00, category: 'Prato', imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=200&q=80' },

  // Bebidas Alcólicas
  { id: 'a1', name: 'Heineken Lata', price: 6.00, category: 'Bebidas Alcólicas', imageUrl: 'https://images.unsplash.com/photo-1618885472179-5e474019f2a9?auto=format&fit=crop&w=200&q=80' },
  { id: 'a2', name: 'Antartica', price: 5.00, category: 'Bebidas Alcólicas', imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=200&q=80' },
  { id: 'a3', name: 'Brahma pilsen', price: 5.00, category: 'Bebidas Alcólicas', imageUrl: 'https://images.unsplash.com/photo-1584225065152-4a1454aa3d4e?auto=format&fit=crop&w=200&q=80' },
  { id: 'a4', name: 'Stella Gold', price: 6.00, category: 'Bebidas Alcólicas', imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=200&q=80' },
  { id: 'a5', name: 'Budweiser', price: 5.00, category: 'Bebidas Alcólicas', imageUrl: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&w=200&q=80' },
  { id: 'a6', name: 'Spaten', price: 6.00, category: 'Bebidas Alcólicas', imageUrl: 'https://images.unsplash.com/photo-1597075095400-b08703f69438?auto=format&fit=crop&w=200&q=80' },
  { id: 'a7', name: 'Gin Tônica Lata', price: 10.00, category: 'Bebidas Alcólicas', imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=200&q=80' },
  { id: 'a8', name: 'Smirnoff Lata', price: 12.00, category: 'Bebidas Alcólicas', imageUrl: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=200&q=80' },

  // Bebidas Sem Álcool
  { id: 's1', name: 'Heineken 0%', price: 6.00, category: 'Bebidas Sem Alcool', imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=200&q=80' },
  { id: 's2', name: 'Refri Lata', price: 6.00, category: 'Bebidas Sem Alcool', imageUrl: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=200&q=80' },
  { id: 's3', name: 'Cola cola 2L', price: 14.00, category: 'Bebidas Sem Alcool', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80' },
  { id: 's4', name: 'Fanta 2L', price: 14.00, category: 'Bebidas Sem Alcool', imageUrl: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&w=200&q=80' },
  { id: 's5', name: 'Guaraná 1,5L', price: 10.00, category: 'Bebidas Sem Alcool', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80' },
  { id: 's6', name: 'Suco caixinha', price: 3.00, category: 'Bebidas Sem Alcool', imageUrl: 'https://images.unsplash.com/photo-1600271886342-adbc2dcb049f?auto=format&fit=crop&w=200&q=80' },
  { id: 's7', name: 'Suco Lata', price: 6.00, category: 'Bebidas Sem Alcool', imageUrl: 'https://images.unsplash.com/photo-1621506289937-4c40a7675574?auto=format&fit=crop&w=200&q=80' },
];

export const TOTAL_TABLES = 15;
export const SERVICE_FEE = 0.10;
