import type { EnvironmentId } from './types';

export type SceneFamily =
  | 'bus'
  | 'classroom'
  | 'coffee'
  | 'restaurant'
  | 'theater'
  | 'airport'
  | 'wedding'
  | 'cruise';

export interface LocationDefinition {
  id: EnvironmentId;
  label: string;
  scene: SceneFamily;
  from: string;
  to: string;
  glow: string;
}

export const LOCATION_DEFINITIONS: LocationDefinition[] = [
  { id: 'bus', label: 'Bus', scene: 'bus', from: '#15263f', to: '#314a50', glow: '#d6a84f' },
  { id: 'classroom', label: 'Classroom', scene: 'classroom', from: '#211930', to: '#493a56', glow: '#c7a66a' },
  { id: 'coffee', label: 'Cafe', scene: 'coffee', from: '#251a2d', to: '#60402f', glow: '#d6a84f' },
  { id: 'restaurant', label: 'Dinner', scene: 'restaurant', from: '#1d142b', to: '#65324d', glow: '#c9868f' },
  { id: 'theater', label: 'Theater', scene: 'theater', from: '#11152b', to: '#342352', glow: '#a99ad6' },
  { id: 'airport', label: 'Airport', scene: 'airport', from: '#102037', to: '#31516c', glow: '#9fb6d9' },
  { id: 'wedding', label: 'Wedding', scene: 'wedding', from: '#21172d', to: '#6a4058', glow: '#d6a84f' },
  { id: 'cruise', label: 'Cruise Ship', scene: 'cruise', from: '#0d2035', to: '#216073', glow: '#9fd1d9' },
  { id: 'library', label: 'Library', scene: 'classroom', from: '#1a1730', to: '#4a3528', glow: '#d9b66f' },
  { id: 'hospital', label: 'Hospital', scene: 'airport', from: '#0f2234', to: '#3f6672', glow: '#b7d6e8' },
  { id: 'train', label: 'Train Car', scene: 'bus', from: '#102032', to: '#455a5c', glow: '#d6a84f' },
  { id: 'subway', label: 'Subway Platform', scene: 'bus', from: '#101723', to: '#343b4b', glow: '#9fb6d9' },
  { id: 'ferry', label: 'Ferry Deck', scene: 'cruise', from: '#0e2b45', to: '#28799e', glow: '#9fd1d9' },
  { id: 'campsite', label: 'Campsite', scene: 'wedding', from: '#0f241d', to: '#6b442e', glow: '#f0a85f' },
  { id: 'museum', label: 'Museum Gallery', scene: 'theater', from: '#17182b', to: '#4d4265', glow: '#d6a84f' },
  { id: 'aquarium', label: 'Aquarium', scene: 'cruise', from: '#082436', to: '#126b7c', glow: '#67d6e8' },
  { id: 'zoo', label: 'Zoo Pavilion', scene: 'wedding', from: '#10291e', to: '#4d6a34', glow: '#b7d6c8' },
  { id: 'planetarium', label: 'Planetarium', scene: 'theater', from: '#050816', to: '#27264d', glow: '#9fb6d9' },
  { id: 'shopping-mall', label: 'Shopping Mall', scene: 'airport', from: '#162033', to: '#5a3c60', glow: '#f0c76a' },
  { id: 'arcade', label: 'Arcade', scene: 'theater', from: '#11142b', to: '#5e2f78', glow: '#d987ff' },
  { id: 'bowling-alley', label: 'Bowling Alley', scene: 'theater', from: '#101827', to: '#3b2f5a', glow: '#f35f79' },
  { id: 'spa', label: 'Spa Retreat', scene: 'coffee', from: '#10231f', to: '#496b5b', glow: '#b7d6c8' },
  { id: 'fitness-studio', label: 'Fitness Studio', scene: 'classroom', from: '#101827', to: '#31516c', glow: '#f0c76a' },
  { id: 'office', label: 'Office Floor', scene: 'classroom', from: '#111827', to: '#374151', glow: '#9fb6d9' },
  { id: 'coworking-space', label: 'Coworking Space', scene: 'coffee', from: '#151a2f', to: '#4a3b5f', glow: '#d6a84f' },
  { id: 'courthouse', label: 'Courthouse', scene: 'classroom', from: '#1d1b2d', to: '#5a4a35', glow: '#d6a84f' },
  { id: 'bank', label: 'Bank Lobby', scene: 'airport', from: '#101827', to: '#28453b', glow: '#f0c76a' },
  { id: 'hotel-lobby', label: 'Hotel Lobby', scene: 'restaurant', from: '#1b1221', to: '#68402d', glow: '#f0c76a' },
  { id: 'ski-lodge', label: 'Ski Lodge', scene: 'coffee', from: '#102038', to: '#5f3e33', glow: '#f4e6c8' },
  { id: 'beach-resort', label: 'Beach Resort', scene: 'cruise', from: '#0b3c55', to: '#d9875f', glow: '#f4e6c8' },
  { id: 'city-park', label: 'City Park', scene: 'wedding', from: '#0f241d', to: '#2f6f53', glow: '#b7d6c8' },
  { id: 'botanical-garden', label: 'Botanical Garden', scene: 'wedding', from: '#0d271c', to: '#416b3c', glow: '#c7e3b6' },
  { id: 'rooftop-party', label: 'Rooftop Party', scene: 'restaurant', from: '#080b18', to: '#49335f', glow: '#f0c76a' },
  { id: 'concert-hall', label: 'Concert Hall', scene: 'theater', from: '#0b0d18', to: '#4c2148', glow: '#d6a84f' },
  { id: 'street-festival', label: 'Street Festival', scene: 'wedding', from: '#172033', to: '#74394e', glow: '#f0c76a' },
  { id: 'farmers-market', label: 'Farmers Market', scene: 'coffee', from: '#172317', to: '#6b4b25', glow: '#d6a84f' },
  { id: 'food-truck-park', label: 'Food Truck Park', scene: 'restaurant', from: '#102037', to: '#74402d', glow: '#f0a85f' },
  { id: 'diner', label: 'Diner', scene: 'restaurant', from: '#151126', to: '#7a2e4a', glow: '#f4c64a' },
  { id: 'bakery', label: 'Bakery', scene: 'coffee', from: '#22152b', to: '#7b4d35', glow: '#f0c76a' },
  { id: 'pizzeria', label: 'Pizzeria', scene: 'restaurant', from: '#1d1422', to: '#743026', glow: '#f0a85f' },
  { id: 'sushi-bar', label: 'Sushi Bar', scene: 'restaurant', from: '#0c1f2b', to: '#315f58', glow: '#f4e6c8' },
  { id: 'board-game-cafe', label: 'Board Game Cafe', scene: 'coffee', from: '#1c1529', to: '#5a3c60', glow: '#d6a84f' },
  { id: 'bookstore', label: 'Bookstore', scene: 'classroom', from: '#1a1730', to: '#5a3c2f', glow: '#d6a84f' },
  { id: 'art-studio', label: 'Art Studio', scene: 'classroom', from: '#191831', to: '#6a4058', glow: '#d987ff' },
  { id: 'science-lab', label: 'Science Lab', scene: 'classroom', from: '#0f1f34', to: '#31516c', glow: '#9fd1d9' },
  { id: 'observatory', label: 'Observatory', scene: 'theater', from: '#050816', to: '#22345f', glow: '#9fb6d9' },
  { id: 'spaceship', label: 'Spaceship', scene: 'airport', from: '#050816', to: '#263a5f', glow: '#67d6e8' },
  { id: 'castle-banquet', label: 'Castle Banquet', scene: 'restaurant', from: '#171126', to: '#5a354d', glow: '#f0c76a' },
];

export const LOCATION_LOOKUP = Object.fromEntries(
  LOCATION_DEFINITIONS.map((location) => [location.id, location]),
) as Record<EnvironmentId, LocationDefinition>;

export const ENVIRONMENT_LABELS = Object.fromEntries(
  LOCATION_DEFINITIONS.map((location) => [location.id, location.label]),
) as Record<EnvironmentId, string>;

export function locationFor(id: EnvironmentId): LocationDefinition {
  return LOCATION_LOOKUP[id] ?? LOCATION_LOOKUP.bus;
}

export function sceneForLocation(id: EnvironmentId): SceneFamily {
  return locationFor(id).scene;
}
