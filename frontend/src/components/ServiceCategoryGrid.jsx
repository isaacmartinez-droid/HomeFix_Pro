import { useEffect, useState } from 'react';
import { categoriesApi } from '../services/api';
export default function ServiceCategoryGrid({ onSelect }) {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { categoriesApi.list().then(setCategories).catch(err => setError(err.message)); }, []);
  return <div>{error && <p role="alert" className="text-red-700">{error}</p>}<div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
    {categories.map(category => <button key={category.id} onClick={() => onSelect?.(category)} className="p-lg bg-white rounded-xl border hover:border-primary text-center">
      <span className="material-symbols-outlined text-primary text-3xl">{category.icon}</span>
      <span className="block font-semibold mt-3">{category.name}</span><span className="block text-sm mt-1">{category.description}</span>
    </button>)}
  </div></div>;
}
