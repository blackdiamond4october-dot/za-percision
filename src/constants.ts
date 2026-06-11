import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'High-Velocity Dispensing Valve',
    description: 'Precision-engineered valve for high-speed bottling lines. Reduced friction and high heat resistance.',
    category: 'Valves',
    images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'],
    compatibility: 'Pepsi Bottling Line Model AB-250, Coke Series X',
    material: '316L Stainless Steel / Titanium Alloy',
    dimensions: '120mm x 85mm'
  },
  {
    id: '2',
    name: 'Industrial Carbide Gear S4',
    description: 'Ultra-tough drive gear designed for heavy-duty industrial conveyors and mixing systems.',
    category: 'Mechanical',
    images: ['https://images.unsplash.com/photo-1530124560676-419991244f08?auto=format&fit=crop&q=80&w=800'],
    compatibility: 'Universal Heavy Duty Conveyors',
    material: 'Tungsten Carbide Coating',
    dimensions: '220mm Diameter, 24 Teeth'
  },
  {
    id: '3',
    name: 'Precision Hydraulic Manifold',
    description: 'Advanced manifold block for complex hydraulic systems in packaging machinery.',
    category: 'Hydraulics',
    images: ['https://images.unsplash.com/photo-1617400327663-88225337fc9a?auto=format&fit=crop&q=80&w=800'],
    compatibility: 'Krones Packaging Systems',
    material: 'Anodized Aluminum 7075',
    dimensions: '300mm x 150mm x 100mm'
  },
  {
    id: '4',
    name: 'Ceramic Bearing Kit Z-Series',
    description: 'High-rpm ceramic bearings designed for motors in sanitary environments.',
    category: 'Bearings',
    images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800'],
    compatibility: 'All Standard 40mm shafts',
    material: 'Silicon Nitride (Si3N4)',
    dimensions: 'ID: 40mm, OD: 80mm'
  }
];

export const ADMIN_CODE = 'admin';
export const COMPANY_EMAIL = 'workspaceforsystem@gmail.com';
export const COMPANY_WHATSAPP = '+1234567890';
export const TECHNICAL_SUPPORT_PHONE = '03034008573';
export const COMPANY_NAME = 'ZA PRECISION';
