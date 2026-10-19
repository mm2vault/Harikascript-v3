import { MM2Item } from '../types';

export type MM2ItemWithoutId = Omit<MM2Item, 'id'>;

export const MM2_ENCYCLOPEDIA: MM2ItemWithoutId[] = [
  // --- TOP ANCIENT & GODLY SETS ---
  {
    name: 'Harvester',
    type: 'Ancient',
    category: 'Gun',
    value: 3850,
    demand: 'Çok Yüksek',
    rarity: 'Ancient Godly',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80',
    stability: 'Yükseliyor',
    origin: 'Halloween Event 2022'
  },
  {
    name: 'Bat',
    type: 'Ancient',
    category: 'Knife',
    value: 3700,
    demand: 'Çok Yüksek',
    rarity: 'Ancient Godly',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    stability: 'Yükseliyor',
    origin: 'Halloween Event 2022'
  },
  {
    name: 'Icepiercer',
    type: 'Ancient',
    category: 'Gun',
    value: 3600,
    demand: 'Çok Yüksek',
    rarity: 'Ancient Tier',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&auto=format&fit=crop&q=80',
    stability: 'Yükseliyor',
    origin: 'Christmas Event 2022'
  },
  {
    name: 'Traveler\'s Axe',
    type: 'Ancient',
    category: 'Knife',
    value: 4100,
    demand: 'Çok Yüksek',
    rarity: 'Ancient Godly',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    stability: 'Yükseliyor',
    origin: 'Halloween Event 2023'
  },
  {
    name: 'Traveler\'s Gun',
    type: 'Ancient',
    category: 'Gun',
    value: 3950,
    demand: 'Çok Yüksek',
    rarity: 'Ancient Tier',
    imageUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&auto=format&fit=crop&q=80',
    stability: 'Yükseliyor',
    origin: 'Halloween Event 2023'
  },
  {
    name: 'Corrupt',
    type: 'Unique',
    category: 'Knife',
    value: 3200,
    demand: 'Çok Yüksek',
    rarity: 'Unique / Glitched',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Data Reset Glitch 2014'
  },
  {
    name: 'Darksword',
    type: 'Godly',
    category: 'Knife',
    value: 820,
    demand: 'Yüksek',
    rarity: 'Godly Ancient',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Halloween 2023 Box'
  },
  {
    name: 'Darkshot',
    type: 'Godly',
    category: 'Gun',
    value: 780,
    demand: 'Yüksek',
    rarity: 'Godly Ancient',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Halloween 2023 Box'
  },
  {
    name: 'Gingerscythe',
    type: 'Ancient',
    category: 'Knife',
    value: 890,
    demand: 'Yüksek',
    rarity: 'Ancient Godly',
    imageUrl: 'https://images.unsplash.com/photo-1512474932049-78ac69ede12c?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Christmas Event 2023'
  },
  {
    name: 'Sakura',
    type: 'Godly',
    category: 'Knife',
    value: 1250,
    demand: 'Çok Yüksek',
    rarity: 'Godly Bloom Set',
    imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&auto=format&fit=crop&q=80',
    stability: 'Yükseliyor',
    origin: 'Spring Bloom Event 2023'
  },
  {
    name: 'Blossom',
    type: 'Godly',
    category: 'Gun',
    value: 1200,
    demand: 'Çok Yüksek',
    rarity: 'Godly Bloom Set',
    imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&auto=format&fit=crop&q=80',
    stability: 'Yükseliyor',
    origin: 'Spring Bloom Event 2023'
  },
  {
    name: 'Ocean',
    type: 'Godly',
    category: 'Gun',
    value: 215,
    demand: 'Yüksek',
    rarity: 'Godly Summer Set',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80',
    stability: 'Yükseliyor',
    origin: 'Summer Event 2023'
  },
  {
    name: 'Waves',
    type: 'Godly',
    category: 'Knife',
    value: 210,
    demand: 'Yüksek',
    rarity: 'Godly Summer Set',
    imageUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&auto=format&fit=crop&q=80',
    stability: 'Yükseliyor',
    origin: 'Summer Event 2023'
  },
  {
    name: 'Candy',
    type: 'Godly',
    category: 'Knife',
    value: 240,
    demand: 'Yüksek',
    rarity: 'Godly Holiday',
    imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Christmas 2015'
  },
  {
    name: 'Sugar',
    type: 'Godly',
    category: 'Gun',
    value: 235,
    demand: 'Yüksek',
    rarity: 'Godly Holiday',
    imageUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Christmas 2015'
  },
  {
    name: 'Icebreaker',
    type: 'Ancient',
    category: 'Knife',
    value: 135,
    demand: 'Normal',
    rarity: 'Ancient Godly',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Christmas 2020'
  },
  {
    name: 'Iceblaster',
    type: 'Godly',
    category: 'Gun',
    value: 130,
    demand: 'Normal',
    rarity: 'Godly Tier',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Christmas 2020'
  },
  {
    name: 'Elderwood Scythe',
    type: 'Ancient',
    category: 'Knife',
    value: 175,
    demand: 'Yüksek',
    rarity: 'Ancient Godly',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Halloween 2019'
  },
  {
    name: 'Elderwood Revolver',
    type: 'Godly',
    category: 'Gun',
    value: 125,
    demand: 'Normal',
    rarity: 'Godly Tier',
    imageUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Halloween 2019'
  },
  {
    name: 'Elderwood Blade',
    type: 'Ancient',
    category: 'Knife',
    value: 140,
    demand: 'Normal',
    rarity: 'Ancient Tier',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Halloween 2022'
  },
  {
    name: 'Heartblade',
    type: 'Godly',
    category: 'Knife',
    value: 160,
    demand: 'Çok Yüksek',
    rarity: 'Godly Love Tier',
    imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&auto=format&fit=crop&q=80',
    stability: 'Yükseliyor',
    origin: 'Valentine\'s Day Shop'
  },
  {
    name: 'Nik\'s Scythe',
    type: 'Unique',
    category: 'Knife',
    value: 150000,
    demand: 'Çok Yüksek',
    rarity: 'Developer Exclusive',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Given personally by Nikilis'
  },
  // --- CHROMA SETS ---
  {
    name: 'Chroma Candleflame',
    type: 'Chroma',
    category: 'Knife',
    value: 1450,
    demand: 'Çok Yüksek',
    rarity: 'Chroma Ancient',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    stability: 'Yükseliyor',
    origin: 'Halloween 2021 Box'
  },
  {
    name: 'Chroma Swirly Gun',
    type: 'Chroma',
    category: 'Gun',
    value: 1950,
    demand: 'Çok Yüksek',
    rarity: 'Chroma Ancient',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80',
    stability: 'Yükseliyor',
    origin: 'Christmas 2021 Box'
  },
  {
    name: 'Chroma Darkbringer',
    type: 'Chroma',
    category: 'Gun',
    value: 350,
    demand: 'Yüksek',
    rarity: 'Chroma Godly',
    imageUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Mystery Box #2'
  },
  {
    name: 'Chroma Lightbringer',
    type: 'Chroma',
    category: 'Gun',
    value: 340,
    demand: 'Yüksek',
    rarity: 'Chroma Godly',
    imageUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Mystery Box #2'
  },
  {
    name: 'Chroma Luger',
    type: 'Chroma',
    category: 'Gun',
    value: 210,
    demand: 'Normal',
    rarity: 'Chroma Godly',
    imageUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Mystery Box #1'
  },
  {
    name: 'Chroma Gemstone',
    type: 'Chroma',
    category: 'Knife',
    value: 200,
    demand: 'Normal',
    rarity: 'Chroma Godly',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Mystery Box #1'
  },
  {
    name: 'Chroma Laser',
    type: 'Chroma',
    category: 'Gun',
    value: 190,
    demand: 'Normal',
    rarity: 'Chroma Godly',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Gun Box #3'
  },
  {
    name: 'Chroma Fang',
    type: 'Chroma',
    category: 'Knife',
    value: 180,
    demand: 'Normal',
    rarity: 'Chroma Godly',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Knife Box #2'
  },
  {
    name: 'Chroma Heat',
    type: 'Chroma',
    category: 'Knife',
    value: 175,
    demand: 'Normal',
    rarity: 'Chroma Godly',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Rainbow Box'
  },
  {
    name: 'Chroma Slasher',
    type: 'Chroma',
    category: 'Knife',
    value: 170,
    demand: 'Normal',
    rarity: 'Chroma Godly',
    imageUrl: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Knife Box #4'
  },
  {
    name: 'Chroma Shark',
    type: 'Chroma',
    category: 'Gun',
    value: 165,
    demand: 'Normal',
    rarity: 'Chroma Godly',
    imageUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Gun Box #2'
  },
  {
    name: 'Chroma Deathshard',
    type: 'Chroma',
    category: 'Knife',
    value: 155,
    demand: 'Normal',
    rarity: 'Chroma Godly',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Knife Box #1'
  },
  {
    name: 'Chroma Tides',
    type: 'Chroma',
    category: 'Knife',
    value: 150,
    demand: 'Normal',
    rarity: 'Chroma Godly',
    imageUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Knife Box #5'
  },
  {
    name: 'Chroma Saw',
    type: 'Chroma',
    category: 'Knife',
    value: 140,
    demand: 'Düşük',
    rarity: 'Chroma Godly',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    stability: 'Düşüyor',
    origin: 'Knife Box #3'
  },
  {
    name: 'Chroma Seer',
    type: 'Chroma',
    category: 'Knife',
    value: 135,
    demand: 'Düşük',
    rarity: 'Chroma Godly',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80',
    stability: 'Düşüyor',
    origin: 'Crafting Machine'
  },
  // --- CLASSIC GODLIES & VINTAGES ---
  {
    name: 'Luger',
    type: 'Godly',
    category: 'Gun',
    value: 75,
    demand: 'Yüksek',
    rarity: 'Godly Classic',
    imageUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Gun Box #1'
  },
  {
    name: 'Red Luger',
    type: 'Godly',
    category: 'Gun',
    value: 110,
    demand: 'Yüksek',
    rarity: 'Godly Holiday',
    imageUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Christmas 2019'
  },
  {
    name: 'Green Luger',
    type: 'Godly',
    category: 'Gun',
    value: 105,
    demand: 'Yüksek',
    rarity: 'Godly Holiday',
    imageUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Christmas 2019'
  },
  {
    name: 'Nebula',
    type: 'Godly',
    category: 'Knife',
    value: 65,
    demand: 'Normal',
    rarity: 'Godly Shop',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Gem Shop 2021'
  },
  {
    name: 'Spectre',
    type: 'Godly',
    category: 'Gun',
    value: 195,
    demand: 'Yüksek',
    rarity: 'Godly Ancient',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80',
    stability: 'Yükseliyor',
    origin: 'Halloween 2022 Pass'
  },
  {
    name: 'Phantom',
    type: 'Godly',
    category: 'Knife',
    value: 190,
    demand: 'Yüksek',
    rarity: 'Godly Ancient',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    stability: 'Yükseliyor',
    origin: 'Halloween 2022 Pass'
  },
  {
    name: 'America',
    type: 'Vintage',
    category: 'Gun',
    value: 45,
    demand: 'Düşük',
    rarity: 'Vintage Classic',
    imageUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&auto=format&fit=crop&q=80',
    stability: 'Düşüyor',
    origin: 'MM1 Classic Weapon'
  },
  {
    name: 'Blood',
    type: 'Vintage',
    category: 'Knife',
    value: 40,
    demand: 'Düşük',
    rarity: 'Vintage Classic',
    imageUrl: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=400&auto=format&fit=crop&q=80',
    stability: 'Düşüyor',
    origin: 'MM1 Classic Weapon'
  },
  {
    name: 'Ghost',
    type: 'Vintage',
    category: 'Knife',
    value: 38,
    demand: 'Düşük',
    rarity: 'Vintage Classic',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    stability: 'Düşüyor',
    origin: 'MM1 Classic Weapon'
  },
  {
    name: 'Pixel',
    type: 'Godly',
    category: 'Knife',
    value: 70,
    demand: 'Normal',
    rarity: 'Godly Classic',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Knife Box #3'
  },
  {
    name: 'Clockwork',
    type: 'Godly',
    category: 'Knife',
    value: 65,
    demand: 'Normal',
    rarity: 'Godly Classic',
    imageUrl: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Toy Box'
  },
  {
    name: 'Icewing',
    type: 'Ancient',
    category: 'Knife',
    value: 12,
    demand: 'Düşük',
    rarity: 'Ancient Duped',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&auto=format&fit=crop&q=80',
    stability: 'Düşüyor',
    origin: 'Christmas 2018 Gamepass'
  },
  {
    name: 'Hallowscythe',
    type: 'Ancient',
    category: 'Knife',
    value: 95,
    demand: 'Normal',
    rarity: 'Ancient Halloween',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Halloween 2020'
  },
  {
    name: 'Hallowgun',
    type: 'Godly',
    category: 'Gun',
    value: 80,
    demand: 'Normal',
    rarity: 'Godly Halloween',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80',
    stability: 'Sabit',
    origin: 'Halloween 2020'
  }
];

// Helper: Normalize string for fuzzy comparison
function normalizeQuery(str: string): string {
  return str
    .toLowerCase()
    .replace(/['’\-_\s]/g, '')
    .trim();
}

/**
 * Looks up MM2 item from the verified encyclopedia
 */
export function lookupMM2Item(query: string): MM2ItemWithoutId | null {
  if (!query || !query.trim()) return null;
  const cleanQ = normalizeQuery(query);

  // 1. Exact or normalized match
  for (const item of MM2_ENCYCLOPEDIA) {
    if (normalizeQuery(item.name) === cleanQ) {
      return item;
    }
  }

  // 2. Contains match
  for (const item of MM2_ENCYCLOPEDIA) {
    const itemNorm = normalizeQuery(item.name);
    if (itemNorm.includes(cleanQ) || cleanQ.includes(itemNorm)) {
      return item;
    }
  }

  // 3. Word token match (e.g. user typed "luger chroma" -> matches "Chroma Luger")
  const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  if (tokens.length > 1) {
    for (const item of MM2_ENCYCLOPEDIA) {
      const itemLower = item.name.toLowerCase();
      if (tokens.every(token => itemLower.includes(token))) {
        return item;
      }
    }
  }

  return null;
}

/**
 * Intelligently generates an MM2 item specification if not in encyclopedia and AI is offline
 */
export function synthesizeMM2Item(rawName: string): MM2ItemWithoutId {
  const name = rawName.trim().charAt(0).toUpperCase() + rawName.trim().slice(1);
  const lower = name.toLowerCase();

  // Determine category
  let category: 'Knife' | 'Gun' | 'Pet' = 'Knife';
  if (lower.includes('gun') || lower.includes('luger') || lower.includes('shot') || lower.includes('blaster') || lower.includes('revolver') || lower.includes('pistol') || lower.includes('piercer')) {
    category = 'Gun';
  } else if (lower.includes('pet') || lower.includes('doge') || lower.includes('cat') || lower.includes('dragon') || lower.includes('bear')) {
    category = 'Pet';
  }

  // Determine type
  let type: 'Godly' | 'Ancient' | 'Chroma' | 'Vintage' | 'Unique' = 'Godly';
  if (lower.includes('chroma')) {
    type = 'Chroma';
  } else if (lower.includes('ancient') || lower.includes('scythe') || lower.includes('axe') || lower.includes('harvester')) {
    type = 'Ancient';
  } else if (lower.includes('vintage') || lower.includes('classic')) {
    type = 'Vintage';
  } else if (lower.includes('unique') || lower.includes('corrupt')) {
    type = 'Unique';
  }

  // Calculate approximate value
  let value = 180;
  if (type === 'Ancient') value = 850;
  if (type === 'Chroma') value = 320;
  if (type === 'Unique') value = 2400;

  // Curated theme images based on weapon category
  let imageUrl = 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=400&auto=format&fit=crop&q=80';
  if (category === 'Gun') {
    imageUrl = 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&auto=format&fit=crop&q=80';
  } else if (category === 'Pet') {
    imageUrl = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80';
  } else if (type === 'Chroma') {
    imageUrl = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80';
  }

  return {
    name,
    type,
    category,
    value,
    demand: 'Yüksek',
    rarity: `${type} Tier`,
    imageUrl,
    stability: 'Yükseliyor',
    origin: 'MM2 Event / Topluluk Eşyası'
  };
}
