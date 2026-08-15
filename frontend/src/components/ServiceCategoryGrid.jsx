import React from 'react';

const SERVICE_CATEGORIES = [
  {
    id: 1,
    name: 'Electricidad',
    description: 'Instalaciones y reparaciones eléctricas',
    icon: 'electrical_services',
    color: 'bg-warning-container text-warning',
  },
  {
    id: 2,
    name: 'Plomería',
    description: 'Tuberías, grifos y filtraciones',
    icon: 'plumbing',
    color: 'bg-info-container text-info',
  },
  {
    id: 3,
    name: 'Aire Acondicionado',
    description: 'Mantenimiento y reparación de A/C',
    icon: 'ac_unit',
    color: 'bg-primary-container text-primary',
  },
  {
    id: 4,
    name: 'Mantenimiento General',
    description: 'Reparaciones varias y pintura',
    icon: 'handyman',
    color: 'bg-success-container text-success',
  },
];

const ServiceCategoryGrid = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
      {SERVICE_CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect && onSelect(category)}
          className="group flex flex-col items-center p-lg bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary hover:shadow-soft transition-all duration-200 cursor-pointer text-left"
        >
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-md ${category.color} group-hover:scale-110 transition-transform duration-200`}>
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {category.icon}
            </span>
          </div>
          <span className="font-headline-sm text-headline-sm text-on-surface text-center">{category.name}</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 text-center">
            {category.description}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ServiceCategoryGrid;
