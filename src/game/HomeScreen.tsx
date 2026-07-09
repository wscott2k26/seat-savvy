import React, { useMemo, useState } from 'react';
import { useGame } from './GameProvider';
import { PetPreview, ShopItemPreview } from './ItemPreview';
import {
  HOME_UPGRADES,
  SHOP_ITEMS,
  homeById,
  homePriceLabel,
  itemById,
  shopItemPriceLabel,
  totalStars,
  type HomeUpgrade,
  type ShopCategory,
  type ShopItem,
} from './lifeData';

type SceneMode = 'inside' | 'outside';
type HomeTrayCategory =
  | 'living'
  | 'bedroom'
  | 'kitchen'
  | 'bathroom'
  | 'outdoor'
  | 'decor'
  | 'lighting'
  | 'pets'
  | 'views';

const HOME_TRAY_CATEGORIES: { id: HomeTrayCategory; label: string }[] = [
  { id: 'living', label: 'Living Room' },
  { id: 'bedroom', label: 'Bedroom' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'bathroom', label: 'Bathroom' },
  { id: 'outdoor', label: 'Outdoor' },
  { id: 'decor', label: 'Decor' },
  { id: 'lighting', label: 'Lighting' },
  { id: 'pets', label: 'Pets' },
  { id: 'views', label: 'Views' },
];

const HOME_ITEM_KINDS = new Set(['furniture', 'decor', 'wallpaper', 'floor', 'view', 'pet']);

const HomeScreen: React.FC = () => {
  const {
    openMenu,
    openShop,
    progress,
    selectPet,
    toggleDecorItem,
    upgradeHome,
  } = useGame();
  const [category, setCategory] = useState<HomeTrayCategory>('living');
  const [sceneMode, setSceneMode] = useState<SceneMode>('inside');
  const home = homeById(progress.life.homeId);
  const equipped = useMemo(() => new Set(progress.life.equippedDecor), [progress.life.equippedDecor]);
  const owned = useMemo(() => new Set(progress.life.ownedItems), [progress.life.ownedItems]);
  const ownedHomes = useMemo(
    () => new Set(['tiny-studio', progress.life.homeId, ...(progress.life.ownedHomes ?? [])]),
    [progress.life.homeId, progress.life.ownedHomes],
  );
  const selectedPet = itemById(progress.life.selectedPet);
  const stars = totalStars(progress.stars);
  const homeItems = SHOP_ITEMS.filter((item) => HOME_ITEM_KINDS.has(item.kind));
  const visibleItems = homeItems.filter((item) => homeCategoryFor(item) === category);
  const homeStats = homeProgressStats(home);

  const handleItem = (item: ShopItem) => {
    if (!owned.has(item.id)) {
      openShop();
      return;
    }
    if (item.kind === 'pet') {
      selectPet(item.id);
      return;
    }
    toggleDecorItem(item.id);
  };

  return (
    <div className="safe-screen relative h-full w-full overflow-y-auto bg-[radial-gradient(circle_at_18%_0%,rgba(214,168,79,0.13),transparent_26%),linear-gradient(180deg,#030712_0%,#0a1022_40%,#1b1126_100%)] text-[#f8edd2]">
      <header className="safe-header relative overflow-hidden rounded-b-[34px] border-b border-[#d6a84f]/22 bg-[linear-gradient(145deg,rgba(4,9,20,0.98),rgba(24,20,42,0.96)_52%,rgba(8,23,38,0.98))] pb-5 shadow-[0_24px_58px_rgba(0,0,0,0.54),0_0_36px_rgba(214,168,79,0.11)]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),transparent_48%,rgba(0,0,0,0.22))]" />
        <div className="relative flex items-center justify-between">
          <button
            onClick={openMenu}
            className="safe-hit grid place-items-center rounded-full border border-white/10 bg-white/10 text-[#fff5d8] shadow-lg ring-1 ring-[#d6a84f]/15 transition hover:bg-white/15 active:scale-95"
            type="button"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            onClick={openShop}
            className="rounded-full bg-gradient-to-r from-[#d6a84f] to-[#f0c76a] px-4 py-2 text-sm font-black text-[#15101f] shadow-[0_12px_28px_rgba(214,168,79,0.24)] transition hover:-translate-y-0.5 active:scale-95"
            type="button"
          >
            Visit Shop
          </button>
        </div>
        <p className="relative mt-4 text-xs font-black uppercase tracking-[0.18em] text-[#d6a84f]">
          Home Studio
        </p>
        <h1 className="relative font-display text-3xl font-black text-[#fff5d8]">
          {home.label}
        </h1>
        <p className="relative mt-1 text-sm font-semibold leading-relaxed text-[#d9cda9]">
          {home.description}
        </p>
        <div className="relative mt-4 grid grid-cols-3 gap-2 text-center text-[11px] font-black text-[#f6d98d]">
          <span className="rounded-2xl border border-[#d6a84f]/22 bg-[#d6a84f]/10 px-2 py-2">{homeStats.rooms}</span>
          <span className="rounded-2xl border border-[#d6a84f]/22 bg-[#d6a84f]/10 px-2 py-2">{homeStats.size}</span>
          <span className="rounded-2xl border border-[#d6a84f]/22 bg-[#d6a84f]/10 px-2 py-2">{homeStats.vibe}</span>
        </div>
      </header>

      <main className="safe-content space-y-5 pt-5">
        <section className="rounded-[30px] border border-white/10 bg-white/8 p-2 shadow-[0_22px_44px_rgba(0,0,0,0.32)]">
          <div className="grid grid-cols-2 gap-2">
            {(['inside', 'outside'] as SceneMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setSceneMode(mode)}
                className={`rounded-2xl px-3 py-2 text-sm font-black capitalize active:scale-95 ${
                  sceneMode === mode
                    ? 'bg-[#d6a84f] text-[#15101f]'
                    : 'border border-white/10 bg-[#071022]/70 text-[#d9cda9]'
                }`}
                type="button"
              >
                {mode}
              </button>
            ))}
          </div>
        </section>

        <HomeScene
          equipped={equipped}
          home={home}
          mode={sceneMode}
          selectedPet={selectedPet}
        />

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,16,33,0.88),rgba(6,12,26,0.76))] p-4 shadow-[0_22px_44px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-black text-[#fff5d8]">Furnishings</h2>
              <p className="text-xs font-semibold text-[#a9a0b5]">
                Equip owned pieces or jump to the shop for more home upgrades.
              </p>
            </div>
            <span className="rounded-full border border-[#d6a84f]/22 bg-[#d6a84f]/12 px-3 py-1 text-xs font-black text-[#f6d98d]">
              {owned.size} owned
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {HOME_TRAY_CATEGORIES.map((tray) => (
              <button
                key={tray.id}
                onClick={() => setCategory(tray.id)}
                className={`shrink-0 rounded-full px-3 py-2 text-xs font-black shadow transition active:scale-95 ${
                  category === tray.id
                    ? 'bg-[#d6a84f] text-[#15101f]'
                    : 'border border-white/10 bg-white/8 text-[#d9cda9]'
                }`}
                type="button"
              >
                {tray.label}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {visibleItems.map((item) => (
              <DecorCard
                key={item.id}
                equipped={equipped.has(item.id) || progress.life.selectedPet === item.id}
                item={item}
                owned={owned.has(item.id)}
                stars={stars}
                onClick={() => handleItem(item)}
              />
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,16,33,0.88),rgba(6,12,26,0.76))] p-4 shadow-[0_22px_44px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur">
          <h2 className="font-display text-xl font-black text-[#fff5d8]">Home Upgrades</h2>
          <p className="text-xs font-semibold text-[#a9a0b5]">
            Every move gets bigger: more rooms, better exterior, richer interior, and more flex space.
          </p>
          <div className="mt-3 space-y-3">
            {HOME_UPGRADES.map((candidate) => (
              <HomeUpgradeCard
                key={candidate.id}
                active={candidate.id === progress.life.homeId}
                canAfford={progress.coins >= candidate.cost}
                home={candidate}
                lockedPremium={!!candidate.premium && !progress.premium}
                lockedStars={!!candidate.starsRequired && stars < candidate.starsRequired}
                owned={ownedHomes.has(candidate.id)}
                onClick={() => upgradeHome(candidate.id)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const HomeScene: React.FC<{
  equipped: Set<string>;
  home: HomeUpgrade;
  mode: SceneMode;
  selectedPet?: ShopItem;
}> = ({ equipped, home, mode, selectedPet }) => {
  const mood = homeMood(home.id, equipped);
  return (
    <section className={`relative overflow-hidden rounded-[34px] border border-[#d6a84f]/22 bg-[#050816] shadow-[0_30px_70px_rgba(0,0,0,0.55),0_0_28px_rgba(214,168,79,0.11)] ${sceneHeightClass(home.size)}`}>
      {mode === 'inside' ? (
        <InteriorScene equipped={equipped} home={home} mood={mood} selectedPet={selectedPet} />
      ) : (
        <ExteriorScene equipped={equipped} home={home} mood={mood} />
      )}
      <div className="absolute left-4 top-4 rounded-2xl border border-white/10 bg-[#030712]/48 px-3 py-2 text-left shadow-xl backdrop-blur">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#d6a84f]">
          {mode === 'inside' ? mood.insideKicker : mood.outsideKicker}
        </p>
        <p className="font-display text-lg font-black leading-none text-[#fff5d8]">{home.label}</p>
      </div>
    </section>
  );
};

const InteriorScene: React.FC<{
  equipped: Set<string>;
  home: HomeUpgrade;
  mood: HomeMood;
  selectedPet?: ShopItem;
}> = ({ equipped, home, mood, selectedPet }) => (
  <>
    <div className="absolute inset-0" style={{ background: mood.wall }} />
    <div className="absolute inset-x-0 bottom-0 h-[44%]" style={{ background: mood.floor }} />
    <div className="absolute inset-x-0 bottom-[38%] h-10 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.24))]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_10%,rgba(255,220,150,0.16),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_42%,rgba(0,0,0,0.38))]" />
    <InteriorArchitecture homeId={home.id} />
    <Window mood={mood} />
    <BuiltInRoomFeatures homeId={home.id} />
    <EquippedDecor equipped={equipped} selectedPet={selectedPet} />
  </>
);

const ExteriorScene: React.FC<{
  equipped: Set<string>;
  home: HomeUpgrade;
  mood: HomeMood;
}> = ({ equipped, home, mood }) => (
  <>
    <div className="absolute inset-0" style={{ background: mood.sky }} />
    <div className="absolute inset-x-0 bottom-0 h-[33%]" style={{ background: mood.ground }} />
    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_42%,rgba(0,0,0,0.36))]" />
    <BackdropLandscape view={mood.view} />
    <HomeFacade homeId={home.id} />
    {equipped.has('flower-planter') && <OutdoorPlanters />}
    {equipped.has('mailbox') && <Mailbox />}
    {equipped.has('porch-chair') && <PorchChair />}
    {equipped.has('fire-pit') && <OutdoorFirePit />}
    {equipped.has('hot-tub') && <HotTub />}
    {equipped.has('pool-lights') && <PoolLights />}
  </>
);

type HomeMood = {
  insideKicker: string;
  outsideKicker: string;
  view: string;
  wall: string;
  floor: string;
  sky: string;
  ground: string;
};

function homeMood(homeId: string, equipped: Set<string>): HomeMood {
  const view = viewFor(equipped, homeId);
  const wallpaper = equipped.has('penthouse-wallpaper')
    ? 'linear-gradient(135deg,#050816,#171122 48%,#2c2140)'
    : equipped.has('coastal-wallpaper')
    ? 'linear-gradient(135deg,#d8c7a2,#5d91a6 56%,#0d4057)'
    : equipped.has('forest-wallpaper')
    ? 'linear-gradient(135deg,#102820,#26382f 56%,#0b1728)'
    : equipped.has('plum-wallpaper')
    ? 'linear-gradient(135deg,#141020,#32213f 54%,#091322)'
    : 'linear-gradient(135deg,#0c1427,#1e2536 48%,#17111f)';
  const floor = equipped.has('marble-floor')
    ? 'repeating-linear-gradient(105deg,#d9d2c0 0 22px,#a9a0b5 22px 44px)'
    : equipped.has('soft-rug-floor')
    ? 'repeating-linear-gradient(105deg,#2b2434 0 18px,#211b2a 18px 36px)'
    : equipped.has('polished-floor')
    ? 'repeating-linear-gradient(105deg,#7a5833 0 22px,#5b3f26 22px 44px)'
    : 'repeating-linear-gradient(105deg,#533824 0 20px,#3f2b1d 20px 40px)';

  const moods: Record<string, HomeMood> = {
    'tiny-studio': {
      insideKicker: 'One-room start',
      outsideKicker: 'Starter block',
      view,
      wall: wallpaper,
      floor,
      sky: 'linear-gradient(180deg,#1b2436,#2d3445 58%,#121722)',
      ground: 'linear-gradient(180deg,#263327,#121812)',
    },
    'small-trailer': {
      insideKicker: 'Trailer kitchenette',
      outsideKicker: 'Awning and wheels',
      view: 'neighborhood',
      wall: 'repeating-linear-gradient(90deg,#1b2028 0 34px,#252832 34px 68px)',
      floor: 'repeating-linear-gradient(105deg,#4f3928 0 18px,#3a2a20 18px 36px)',
      sky: 'linear-gradient(180deg,#263045,#6e5d43 60%,#20242d)',
      ground: 'linear-gradient(180deg,#5d4a32,#2d241b)',
    },
    'starter-apartment': {
      insideKicker: 'Two-zone apartment',
      outsideKicker: 'Walk-up living',
      view: 'skyline',
      wall: 'linear-gradient(135deg,#101827,#202d43 52%,#12111d)',
      floor: 'repeating-linear-gradient(105deg,#63472e 0 22px,#493421 22px 44px)',
      sky: 'linear-gradient(180deg,#111d33,#2d4062 58%,#111827)',
      ground: 'linear-gradient(180deg,#36404e,#161b24)',
    },
    'suburban-house': {
      insideKicker: 'Real house flow',
      outsideKicker: 'Front yard unlocked',
      view: 'neighborhood',
      wall: 'linear-gradient(135deg,#1b2431,#354055 52%,#18131d)',
      floor: 'repeating-linear-gradient(105deg,#7a5634 0 22px,#5a3d25 22px 44px)',
      sky: 'linear-gradient(180deg,#2d4764,#6b7d8a 60%,#213047)',
      ground: 'linear-gradient(180deg,#537044,#26381f)',
    },
    'city-apartment': {
      insideKicker: 'City evening',
      outsideKicker: 'Tall city block',
      view: 'skyline',
      wall: 'linear-gradient(135deg,#091426,#1c263b 48%,#10101c)',
      floor,
      sky: 'linear-gradient(180deg,#081326,#243a65 58%,#050816)',
      ground: 'linear-gradient(180deg,#101827,#050816)',
    },
    'cozy-cabin': {
      insideKicker: 'Warm timber',
      outsideKicker: 'Forest porch',
      view: 'mountain',
      wall: 'linear-gradient(135deg,#23170f,#4b2f1b 54%,#151018)',
      floor: 'repeating-linear-gradient(105deg,#7a4d27 0 22px,#5d381e 22px 44px)',
      sky: 'linear-gradient(180deg,#263848,#52665b 60%,#17251f)',
      ground: 'linear-gradient(180deg,#31472e,#172512)',
    },
    'beach-cottage': {
      insideKicker: 'Ocean light',
      outsideKicker: 'Beach porch',
      view: 'ocean',
      wall: 'linear-gradient(135deg,#0e2330,#22445a 54%,#101827)',
      floor: 'repeating-linear-gradient(105deg,#8c6b43 0 22px,#6f5337 22px 44px)',
      sky: 'linear-gradient(180deg,#98c7d9,#398aa4 58%,#165069)',
      ground: 'linear-gradient(180deg,#ccb27a,#8d7042)',
    },
    'lake-house': {
      insideKicker: 'Quiet water',
      outsideKicker: 'Deck and dock',
      view: 'lake',
      wall: 'linear-gradient(135deg,#12211f,#26352d 54%,#0d1724)',
      floor: 'repeating-linear-gradient(105deg,#73512f 0 22px,#52371f 22px 44px)',
      sky: 'linear-gradient(180deg,#516979,#3c6870 58%,#102d34)',
      ground: 'linear-gradient(180deg,#2d5d5d,#173334)',
    },
    'city-loft': {
      insideKicker: 'Skyline loft',
      outsideKicker: 'Warehouse windows',
      view: 'skyline',
      wall: 'linear-gradient(135deg,#070d19,#20273b 46%,#120d1f)',
      floor: 'repeating-linear-gradient(105deg,#6a4b30 0 26px,#493321 26px 52px)',
      sky: 'linear-gradient(180deg,#071025,#1f3760 58%,#040713)',
      ground: 'linear-gradient(180deg,#111827,#030712)',
    },
    'garden-villa': {
      insideKicker: 'Garden rooms',
      outsideKicker: 'Villa path',
      view: 'garden',
      wall: 'linear-gradient(135deg,#17251f,#40543e 52%,#102018)',
      floor: 'repeating-linear-gradient(105deg,#80623d 0 22px,#5f472a 22px 44px)',
      sky: 'linear-gradient(180deg,#5b7a8d,#9bb38f 58%,#315044)',
      ground: 'linear-gradient(180deg,#5f8c4c,#25401f)',
    },
    'luxury-penthouse': {
      insideKicker: 'Full Adventure',
      outsideKicker: 'Rooftop luxury',
      view: 'skyline',
      wall: 'linear-gradient(135deg,#050816,#171122 46%,#1d1731)',
      floor: 'repeating-linear-gradient(105deg,#87633b 0 24px,#604627 24px 48px)',
      sky: 'linear-gradient(180deg,#050816,#1c2f57 60%,#030712)',
      ground: 'linear-gradient(180deg,#101827,#050816)',
    },
    'dream-estate': {
      insideKicker: 'Estate grand room',
      outsideKicker: 'Driveway and pool',
      view: 'estate',
      wall: 'linear-gradient(135deg,#110d1b,#2d243c 50%,#071022)',
      floor: 'repeating-linear-gradient(105deg,#a17a43 0 24px,#76552f 24px 48px)',
      sky: 'linear-gradient(180deg,#0b1530,#304f7a 58%,#050816)',
      ground: 'linear-gradient(180deg,#4f7142,#17321f)',
    },
  };

  return moods[homeId] ?? moods['tiny-studio'];
}

function sceneHeightClass(size: HomeUpgrade['size']): string {
  if (size === 'premium') return 'h-[540px]';
  if (size === 'large') return 'h-[480px]';
  if (size === 'medium') return 'h-[430px]';
  if (size === 'small') return 'h-[405px]';
  return 'h-[370px]';
}

function homeProgressStats(home: HomeUpgrade) {
  if (home.size === 'premium') return { rooms: '5+ rooms', size: 'Estate size', vibe: 'Endgame' };
  if (home.size === 'large') return { rooms: '4 rooms', size: 'Large', vibe: 'Glow-up' };
  if (home.size === 'medium') return { rooms: '3 rooms', size: 'Medium', vibe: 'Settled' };
  if (home.size === 'small') return { rooms: '2 rooms', size: 'Small', vibe: 'Moving up' };
  return { rooms: '1 room', size: 'Tiny', vibe: 'Starter' };
}

const InteriorArchitecture: React.FC<{ homeId: string }> = ({ homeId }) => {
  const big = ['suburban-house', 'beach-cottage', 'lake-house', 'city-loft', 'garden-villa', 'luxury-penthouse', 'dream-estate'].includes(homeId);
  return (
    <>
      <span className={`absolute left-[4%] top-[16%] rounded-[28px] border border-[#f6d98d]/16 bg-[#9fb6d9]/18 shadow-xl ${big ? 'h-28 w-36' : 'h-20 w-28'}`} />
      {big && <span className="absolute left-[42%] top-[15%] h-24 w-28 rounded-[28px] border border-[#f6d98d]/14 bg-[#9fb6d9]/14 shadow-xl" />}
      {homeId === 'small-trailer' && <span className="absolute left-[4%] right-[4%] top-[12%] h-5 rounded-full bg-[#d6a84f]/18" />}
      {homeId === 'cozy-cabin' && <span className="absolute left-0 right-0 top-[23%] h-4 bg-[repeating-linear-gradient(90deg,#6b4426_0_28px,#4a2f1c_28px_56px)] shadow-lg" />}
      {homeId === 'city-loft' && <span className="absolute left-[6%] right-[6%] top-[10%] h-px bg-[#d6a84f]/34" />}
      {homeId === 'luxury-penthouse' && <span className="absolute right-[9%] top-[22%] h-32 w-24 rounded-t-[40px] bg-[#d6a84f]/16 shadow-xl" />}
      {homeId === 'dream-estate' && <span className="absolute left-[18%] right-[18%] top-[8%] h-2 rounded-full bg-[#d6a84f]/35 shadow-[0_0_18px_rgba(214,168,79,0.28)]" />}
    </>
  );
};

const BuiltInRoomFeatures: React.FC<{ homeId: string }> = ({ homeId }) => (
  <>
    <FloorLamp />
    <KitchenCompact large={['suburban-house', 'beach-cottage', 'lake-house', 'garden-villa', 'dream-estate'].includes(homeId)} />
    <MediaConsole upgraded={['city-apartment', 'city-loft', 'luxury-penthouse', 'dream-estate'].includes(homeId)} />
    {['cozy-cabin', 'lake-house'].includes(homeId) && <Fireplace builtIn />}
    {['luxury-penthouse', 'dream-estate'].includes(homeId) && <TrophyWall />}
  </>
);

const EquippedDecor: React.FC<{ equipped: Set<string>; selectedPet?: ShopItem }> = ({ equipped, selectedPet }) => (
  <>
    {(equipped.has('old-couch') || equipped.has('sectional-sofa')) && <ModernSofa big={equipped.has('sectional-sofa')} />}
    {(equipped.has('cozy-bed') || equipped.has('luxury-bed')) && <StudioBed luxury={equipped.has('luxury-bed')} />}
    {(equipped.has('small-table') || equipped.has('kitchen-island')) && <CoffeeTable big={equipped.has('kitchen-island')} />}
    {(equipped.has('starter-plant') || equipped.has('flower-planter')) && <TallPlant />}
    {equipped.has('bookshelf') && <RealBookshelf />}
    {(equipped.has('gaming-chair') || equipped.has('reading-chair')) && <LoungeChair />}
    {equipped.has('desk-setup') && <DeskSetup />}
    {equipped.has('coffee-maker') && <CounterCoffee />}
    {equipped.has('diner-booth') && <DinerBooth />}
    {equipped.has('wall-art') && <WallArt />}
    {equipped.has('round-mirror') && <WallMirror />}
    {equipped.has('trophy-shelf') && <TrophyShelf />}
    {equipped.has('aquarium') && <Aquarium />}
    {equipped.has('fireplace') && <Fireplace />}
    {equipped.has('cozy-rug') && <Rug />}
    {equipped.has('bath-mat') && <BathMat />}
    {equipped.has('pet-bed') && <PetBed />}
    {(equipped.has('neon-sign') || equipped.has('string-lights')) && <NeonSign stringLights={equipped.has('string-lights')} />}
    {equipped.has('floor-lamp-upgrade') && <SecondLamp />}
    {equipped.has('piano') && <Piano />}
    {equipped.has('jukebox') && <Jukebox />}
    {equipped.has('telescope') && <Telescope />}
    {equipped.has('spa-candles') && <SpaCandles />}
    {equipped.has('gold-fridge') && <GoldFridge />}
    {selectedPet && <Pet kind={selectedPet.preview} />}
  </>
);

const Window: React.FC<{ mood: { view: string } }> = ({ mood }) => {
  const backgrounds: Record<string, string> = {
    rain: 'linear-gradient(180deg,#1c2b45,#496078 62%,#1b283a)',
    neighborhood: 'linear-gradient(180deg,#293348,#655640 62%,#20242d)',
    skyline: 'linear-gradient(180deg,#0c1730,#1f3760 58%,#070b14)',
    ocean: 'linear-gradient(180deg,#8db8c7,#256b83 58%,#0d4057)',
    mountain: 'linear-gradient(180deg,#5b6d7c,#2f4a40 60%,#13241c)',
    lake: 'linear-gradient(180deg,#4e6475,#275a5f 58%,#102d34)',
    garden: 'linear-gradient(180deg,#789b75,#3f6f4b 58%,#17331e)',
    estate: 'linear-gradient(180deg,#9fb6d9,#304f7a 58%,#101827)',
  };
  return (
    <div className="absolute right-[7%] top-[12%] h-36 w-36 overflow-hidden rounded-[28px] border border-[#f6d98d]/18 p-2 shadow-[0_20px_38px_rgba(0,0,0,0.42)] ring-4 ring-[#050816]/70" style={{ background: backgrounds[mood.view] ?? backgrounds.rain }}>
      <div className="absolute inset-x-0 bottom-0 h-12 bg-black/20" />
      {(mood.view === 'skyline' || mood.view === 'estate') && <Skyline />}
      {mood.view === 'rain' && <RainLines />}
      {mood.view === 'neighborhood' && <Neighborhood />}
      {(mood.view === 'ocean' || mood.view === 'lake') && <WaterLines />}
      {mood.view === 'mountain' && <MountainLines />}
      {mood.view === 'garden' && <GardenLines />}
      <div className="relative grid h-full grid-cols-2 gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="rounded-xl bg-white/10 shadow-inner" />
        ))}
      </div>
    </div>
  );
};

const HomeFacade: React.FC<{ homeId: string }> = ({ homeId }) => {
  const facade = facadeSpec(homeId);
  return (
    <div className="absolute left-1/2 bottom-[25%] h-[46%] w-[72%] -translate-x-1/2">
      <span className="absolute left-1/2 top-0 h-[32%] w-[62%] -translate-x-1/2 rounded-t-[42px]" style={{ background: facade.roof, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} />
      <span className="absolute bottom-0 left-1/2 h-[78%] w-[78%] -translate-x-1/2 rounded-t-[28px] border border-white/12 shadow-2xl" style={{ background: facade.body }} />
      <span className="absolute bottom-0 left-1/2 h-[28%] w-[18%] -translate-x-1/2 rounded-t-2xl bg-[#17111f] ring-2 ring-[#d6a84f]/18" />
      <span className="absolute bottom-[42%] left-[20%] h-[19%] w-[18%] rounded-2xl bg-[#9fb6d9]/42 ring-2 ring-white/20" />
      <span className="absolute bottom-[42%] right-[20%] h-[19%] w-[18%] rounded-2xl bg-[#9fb6d9]/42 ring-2 ring-white/20" />
      {facade.extra === 'wheels' && <><span className="absolute -bottom-4 left-[21%] h-8 w-8 rounded-full bg-[#050816] ring-4 ring-[#343a46]" /><span className="absolute -bottom-4 right-[21%] h-8 w-8 rounded-full bg-[#050816] ring-4 ring-[#343a46]" /></>}
      {facade.extra === 'balcony' && <span className="absolute bottom-[30%] left-[18%] right-[18%] h-4 rounded-full bg-[#d6a84f]/32" />}
      {facade.extra === 'pool' && <span className="absolute -bottom-12 left-[8%] right-[8%] h-12 rounded-[50%] bg-[#2fa0c6]/55 shadow-[0_0_24px_rgba(47,160,198,0.28)]" />}
    </div>
  );
};

function facadeSpec(homeId: string) {
  if (homeId === 'small-trailer') return { body: 'linear-gradient(180deg,#c7a26b,#7b5f42)', roof: '#4a2f1c', extra: 'wheels' };
  if (homeId === 'starter-apartment') return { body: 'linear-gradient(180deg,#35445a,#1c2634)', roof: '#151b26', extra: 'none' };
  if (homeId === 'suburban-house') return { body: 'linear-gradient(180deg,#9c6f50,#5e3f2a)', roof: '#402719', extra: 'none' };
  if (homeId === 'city-apartment') return { body: 'linear-gradient(180deg,#24354f,#0f1724)', roof: '#0b1020', extra: 'none' };
  if (homeId === 'cozy-cabin') return { body: 'repeating-linear-gradient(90deg,#6b4426_0_26px,#4a2f1c_26px_52px)', roof: '#2d1c12', extra: 'none' };
  if (homeId === 'beach-cottage') return { body: 'linear-gradient(180deg,#eadfcb,#8db8c7)', roof: '#d6a84f', extra: 'balcony' };
  if (homeId === 'lake-house') return { body: 'linear-gradient(180deg,#6a4a2e,#26382f)', roof: '#2b1d13', extra: 'balcony' };
  if (homeId === 'city-loft') return { body: 'linear-gradient(180deg,#1d2740,#071022)', roof: '#050816', extra: 'balcony' };
  if (homeId === 'garden-villa') return { body: 'linear-gradient(180deg,#d8c7a2,#6b8461)', roof: '#526443', extra: 'balcony' };
  if (homeId === 'luxury-penthouse') return { body: 'linear-gradient(180deg,#161226,#050816)', roof: '#d6a84f', extra: 'balcony' };
  if (homeId === 'dream-estate') return { body: 'linear-gradient(180deg,#eadfcb,#90724b)', roof: '#2a1c13', extra: 'pool' };
  return { body: 'linear-gradient(180deg,#3b445d,#1c2433)', roof: '#151b26', extra: 'none' };
}

const BackdropLandscape: React.FC<{ view: string }> = ({ view }) => (
  <div className="absolute inset-x-0 bottom-[33%] h-[34%] opacity-75">
    {(view === 'skyline' || view === 'estate') && <Skyline />}
    {view === 'mountain' && <MountainLines />}
    {(view === 'ocean' || view === 'lake') && <WaterLines />}
    {view === 'garden' && <GardenLines />}
    {view === 'neighborhood' && <Neighborhood />}
  </div>
);

const ModernSofa: React.FC<{ big?: boolean }> = ({ big = false }) => (
  <div className={`absolute left-[7%] bottom-[22%] ${big ? 'h-28 w-52' : 'h-24 w-40'}`}>
    <div className="absolute bottom-0 h-14 w-full rounded-[24px] bg-[linear-gradient(180deg,#4f435d,#30263c)] shadow-[0_18px_26px_rgba(0,0,0,0.42)] ring-1 ring-white/8" />
    <div className="absolute bottom-10 left-3 right-3 h-14 rounded-[24px] bg-[linear-gradient(180deg,#6a5a74,#43364f)] shadow-lg" />
    <div className="absolute bottom-12 left-7 h-9 w-11 rounded-2xl bg-[#1f2638]/72" />
    <div className="absolute bottom-12 right-8 h-9 w-11 rounded-2xl bg-[#a86a78]/58" />
  </div>
);

const StudioBed: React.FC<{ luxury?: boolean }> = ({ luxury = false }) => (
  <div className={`absolute right-[6%] bottom-[20%] ${luxury ? 'h-24 w-44' : 'h-20 w-36'}`}>
    <div className={`absolute bottom-0 h-12 w-full rounded-[20px] shadow-xl ring-1 ring-white/8 ${luxury ? 'bg-[#3b2b16]' : 'bg-[#4b2c38]'}`} />
    <div className="absolute bottom-8 left-3 right-3 h-9 rounded-2xl bg-[#d8c7a2]/80" />
    <div className="absolute bottom-[52px] left-5 h-6 w-12 rounded-xl bg-[#253650]" />
    {luxury && <span className="absolute bottom-[55px] right-6 h-5 w-10 rounded-xl bg-[#d6a84f]/70" />}
  </div>
);

const CoffeeTable: React.FC<{ big?: boolean }> = ({ big = false }) => (
  <div className={`absolute left-[42%] bottom-[22%] h-12 ${big ? 'w-36' : 'w-24'}`}>
    <div className="absolute bottom-4 h-4 w-full rounded-full bg-[linear-gradient(180deg,#9b7045,#5d3a21)] shadow-[0_14px_20px_rgba(0,0,0,0.34)] ring-1 ring-[#f6d98d]/14" />
    <span className="absolute bottom-0 left-4 h-5 w-1.5 rounded bg-[#2b1d13]" />
    <span className="absolute bottom-0 right-4 h-5 w-1.5 rounded bg-[#2b1d13]" />
  </div>
);

const FloorLamp = () => (
  <div className="absolute left-[5%] top-[26%] h-40 w-20">
    <span className="absolute left-9 top-12 h-24 w-1.5 rounded-full bg-[#8a6a3b]" />
    <span className="absolute bottom-0 left-4 h-3 w-14 rounded-full bg-black/32" />
    <span className="absolute left-4 top-2 h-14 w-12 rounded-[22px] bg-[linear-gradient(180deg,#f4d68a,#9b6c32)] shadow-[0_0_32px_rgba(244,214,138,0.36)]" />
  </div>
);

const KitchenCompact: React.FC<{ large?: boolean }> = ({ large = false }) => (
  <div className={`absolute right-[5%] bottom-[21%] h-28 ${large ? 'w-44' : 'w-36'} opacity-95`}>
    <div className="absolute bottom-0 h-16 w-full rounded-t-2xl bg-[linear-gradient(180deg,#2a3344,#151b26)] shadow-xl ring-1 ring-white/8" />
    <div className="absolute bottom-16 left-2 right-2 h-3 rounded-full bg-[#b58a53]" />
    <span className="absolute bottom-8 left-4 h-7 w-8 rounded-lg bg-[#0f1724] ring-1 ring-white/10" />
    <span className="absolute bottom-8 right-5 h-7 w-10 rounded-lg bg-[#3f4b5e]" />
    <span className="absolute bottom-22 left-6 h-12 w-24 rounded-2xl bg-[#0b1020]/72 shadow-inner" />
  </div>
);

const MediaConsole: React.FC<{ upgraded: boolean }> = ({ upgraded }) => (
  <div className="absolute left-[35%] top-[41%] h-20 w-32">
    <div className={`absolute left-5 top-0 h-12 w-24 rounded-xl bg-[#050816] shadow-xl ring-4 ${upgraded ? 'ring-[#d6a84f]/28' : 'ring-[#243148]'}`}>
      <div className="absolute inset-2 rounded-lg bg-[linear-gradient(135deg,#17243a,#0b1020)]" />
    </div>
    <div className="absolute bottom-0 h-8 w-32 rounded-2xl bg-[linear-gradient(180deg,#3b2a21,#211811)] shadow-lg" />
  </div>
);

const TallPlant = () => <div className="absolute left-[19%] bottom-[21%] h-28 w-16"><span className="absolute bottom-0 left-5 h-9 w-9 rounded-t-xl bg-[linear-gradient(180deg,#6d4329,#402719)] shadow-lg" /><span className="absolute bottom-8 left-4 h-16 w-5 -rotate-12 rounded-full bg-[#6f9b58] shadow-lg" /><span className="absolute bottom-9 left-8 h-[68px] w-5 rotate-12 rounded-full bg-[#87aa67] shadow-lg" /><span className="absolute bottom-[68px] left-6 h-12 w-5 rotate-45 rounded-full bg-[#5f854d] shadow-lg" /></div>;
const RealBookshelf = () => <div className="absolute left-[5%] top-[36%] h-32 w-20 rounded-2xl bg-[linear-gradient(180deg,#4b2f1f,#241811)] p-2 shadow-2xl ring-1 ring-[#f6d98d]/10">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="mb-2 flex gap-1"><span className="h-3 w-4 rounded-sm bg-[#d6a84f]/70" /><span className="h-3 w-6 rounded-sm bg-[#7f8fa3]/80" /><span className="h-3 flex-1 rounded-sm bg-[#a86a78]/70" /></div>)}</div>;
const LoungeChair = () => <div className="absolute right-[20%] bottom-[22%] h-24 w-20"><div className="absolute bottom-2 left-2 h-16 w-14 rounded-[24px] bg-[linear-gradient(180deg,#31536c,#17263a)] shadow-xl" /><div className="absolute bottom-0 left-0 h-6 w-[72px] rounded-full bg-black/24" /></div>;
const DeskSetup = () => <div className="absolute left-[49%] bottom-[25%] h-20 w-32"><div className="absolute bottom-0 h-4 w-full rounded-full bg-[#6a4129] shadow-xl" /><span className="absolute bottom-4 left-3 h-12 w-20 rounded-xl bg-[#08111f] ring-2 ring-[#394b63]" /><span className="absolute bottom-4 right-5 h-9 w-5 rounded bg-[#d6a84f]/70" /></div>;
const CounterCoffee = () => <div className="absolute right-[12%] bottom-[40%] h-10 w-10 rounded-xl bg-[linear-gradient(180deg,#cba15d,#6d4524)] shadow-[0_0_16px_rgba(214,168,79,0.18)] ring-1 ring-white/12"><span className="absolute left-3 top-2 h-5 w-4 rounded bg-[#101827]" /><span className="absolute -top-5 left-4 h-5 w-1 rounded-full bg-white/35 blur-[1px]" /></div>;
const WallArt = () => <div className="absolute left-[28%] top-[17%] h-16 w-24 rounded-2xl border-4 border-[#5d4026] bg-[linear-gradient(135deg,#d6a84f66,#273751)] shadow-xl" />;
const WallMirror = () => <div className="absolute right-[28%] top-[18%] h-16 w-16 rounded-full border-4 border-[#d6a84f]/55 bg-[#9fb6d9]/22 shadow-xl" />;
const TrophyShelf = () => <div className="absolute left-[31%] top-[30%] h-10 w-28 rounded-xl bg-[#6a4129] shadow-xl"><span className="absolute left-5 top-[-18px] h-6 w-5 rounded-t-full bg-[#d6a84f]" /><span className="absolute right-5 top-[-15px] h-5 w-5 rounded-full bg-[#f6d98d]" /></div>;
const Aquarium = () => <div className="absolute right-[31%] bottom-[36%] h-14 w-24 rounded-2xl bg-[linear-gradient(180deg,#3aa0c0aa,#103645cc)] shadow-xl ring-2 ring-[#b7d6e8]/55"><span className="absolute left-4 top-5 h-2 w-5 rounded-full bg-[#f0c76a]" /><span className="absolute right-5 top-7 h-2 w-4 rounded-full bg-[#a86a78]" /></div>;
const Fireplace: React.FC<{ builtIn?: boolean }> = ({ builtIn = false }) => <div className={`absolute right-[9%] bottom-[22%] h-[72px] w-28 rounded-t-3xl bg-[linear-gradient(180deg,#2b1c22,#120d12)] shadow-2xl ring-2 ring-[#d6a84f]/18 ${builtIn ? 'opacity-85' : ''}`}><span className="absolute bottom-3 left-10 h-10 w-5 rounded-full bg-[#f0c76a] shadow-[0_0_28px_rgba(240,199,106,0.62)]" /><span className="absolute bottom-3 left-14 h-8 w-5 rounded-full bg-[#a86a78]" /></div>;
const Rug = () => <div className="absolute bottom-[9%] left-[24%] right-[18%] h-20 rounded-[50%] bg-[radial-gradient(circle,#a86a7870,#4b223450_62%,transparent_70%)] shadow-[0_18px_28px_rgba(0,0,0,0.22)]" />;
const BathMat = () => <div className="absolute bottom-[12%] right-[32%] h-12 w-24 rounded-[50%] bg-[#8db8c7]/45 shadow-xl" />;
const PetBed = () => <div className="absolute bottom-[11%] right-[7%] h-10 w-20 rounded-full bg-[linear-gradient(180deg,#6e4151,#3a2330)] shadow-xl ring-1 ring-[#d6a84f]/16" />;
const NeonSign: React.FC<{ stringLights?: boolean }> = ({ stringLights = false }) => stringLights ? <div className="absolute left-[18%] right-[12%] top-[9%] flex justify-between">{Array.from({ length: 8 }).map((_, i) => <span key={i} className="h-3 w-3 rounded-full bg-[#f6d98d] shadow-[0_0_16px_rgba(246,217,141,0.72)]" />)}</div> : <div className="absolute right-[9%] top-[27%] rounded-full border border-[#d6a84f]/40 px-4 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#f6d98d] shadow-[0_0_22px_rgba(214,168,79,0.46)]">Stay Cozy</div>;
const SecondLamp = () => <div className="absolute right-[3%] top-[30%] h-36 w-14"><span className="absolute left-6 top-10 h-24 w-1 rounded bg-[#8a6a3b]" /><span className="absolute left-1 top-0 h-12 w-12 rounded-[20px] bg-[#f6d98d]/78 shadow-[0_0_28px_rgba(246,217,141,0.45)]" /></div>;
const Piano = () => <div className="absolute left-[8%] bottom-[37%] h-14 w-28 rounded-t-2xl bg-[#100d12] shadow-xl ring-1 ring-[#d6a84f]/18"><span className="absolute bottom-1 left-3 right-3 h-3 bg-[repeating-linear-gradient(90deg,#fff_0_8px,#111_8px_11px)]" /></div>;
const Jukebox = () => <div className="absolute left-[6%] bottom-[21%] h-24 w-16 rounded-t-[28px] bg-[linear-gradient(180deg,#a86a78,#231422)] shadow-xl ring-2 ring-[#d6a84f]/20"><span className="absolute left-3 right-3 top-4 h-8 rounded-full bg-[#f6d98d]/45" /></div>;
const Telescope = () => <div className="absolute right-[19%] top-[28%] h-20 w-20"><span className="absolute left-4 top-7 h-3 w-16 -rotate-12 rounded-full bg-[#9fb6d9]" /><span className="absolute left-8 top-9 h-12 w-1 rounded bg-[#d6a84f]" /></div>;
const SpaCandles = () => <div className="absolute right-[40%] bottom-[18%] flex gap-2">{[10, 14, 12].map((h, i) => <span key={i} className="w-3 rounded-t-sm bg-[#f6d98d] shadow-[0_0_12px_rgba(246,217,141,0.5)]" style={{ height: h }} />)}</div>;
const GoldFridge = () => <div className="absolute right-[4%] bottom-[33%] h-24 w-14 rounded-xl bg-[linear-gradient(180deg,#d6a84f,#8a632b)] shadow-xl ring-1 ring-white/15"><span className="absolute left-2 top-12 h-px w-10 bg-black/30" /></div>;
const DinerBooth = () => <div className="absolute left-[10%] bottom-[30%] h-20 w-36"><span className="absolute bottom-0 left-0 h-10 w-14 rounded-2xl bg-[#7b3149]" /><span className="absolute bottom-0 right-0 h-10 w-14 rounded-2xl bg-[#7b3149]" /><span className="absolute bottom-8 left-[52px] h-4 w-9 rounded-full bg-[#9b7045]" /></div>;
const Pet: React.FC<{ kind: string }> = ({ kind }) => <div className="ts-pet-idle absolute bottom-[11%] right-[22%] h-20 w-24"><PetPreview kind={kind} /></div>;

const OutdoorPlanters = () => <><span className="absolute bottom-[24%] left-[18%] h-12 w-12 rounded-t-xl bg-[#6d4329] shadow-lg" /><span className="absolute bottom-[31%] left-[20%] h-10 w-8 rounded-full bg-[#729d58]" /><span className="absolute bottom-[24%] right-[18%] h-12 w-12 rounded-t-xl bg-[#6d4329] shadow-lg" /><span className="absolute bottom-[31%] right-[20%] h-10 w-8 rounded-full bg-[#87aa67]" /></>;
const Mailbox = () => <div className="absolute bottom-[24%] left-[7%] h-16 w-12"><span className="absolute bottom-0 left-5 h-10 w-1.5 bg-[#5d4026]" /><span className="absolute top-0 h-8 w-12 rounded-t-2xl bg-[#d6a84f] shadow-xl" /></div>;
const PorchChair = () => <div className="absolute bottom-[25%] right-[9%] h-16 w-16"><span className="absolute bottom-2 h-8 w-14 rounded-xl bg-[#31536c]" /><span className="absolute top-0 left-3 h-11 w-10 rounded-t-2xl bg-[#4f6f8a]" /></div>;
const OutdoorFirePit = () => <div className="absolute bottom-[13%] left-[43%] h-16 w-24"><span className="absolute bottom-0 h-8 w-full rounded-[50%] bg-[#2b1c22]" /><span className="absolute bottom-5 left-10 h-8 w-4 rounded-full bg-[#f0c76a] shadow-[0_0_26px_rgba(240,199,106,0.65)]" /></div>;
const HotTub = () => <div className="absolute bottom-[15%] right-[18%] h-16 w-28 rounded-[28px] bg-[#3aa0c0]/50 shadow-[0_0_24px_rgba(58,160,192,0.4)] ring-4 ring-[#eadfcb]/35" />;
const PoolLights = () => <div className="absolute bottom-[7%] left-[16%] right-[16%] flex justify-between">{Array.from({ length: 7 }).map((_, i) => <span key={i} className="h-3 w-3 rounded-full bg-[#f6d98d] shadow-[0_0_16px_rgba(246,217,141,0.7)]" />)}</div>;

const DecorCard: React.FC<{ equipped: boolean; item: ShopItem; owned: boolean; stars: number; onClick: () => void }> = ({ equipped, item, owned, stars, onClick }) => {
  const lockedForStars = !!item.starsRequired && stars < item.starsRequired;
  const price = shopItemPriceLabel(item);
  const status = owned ? (equipped ? 'Equipped' : 'Owned') : item.premium ? 'Premium preview' : lockedForStars ? `${item.starsRequired} stars` : `${item.cost ?? 0} coins`;
  return (
    <button onClick={onClick} className={`min-h-[136px] rounded-[24px] border p-3 text-left shadow-[0_16px_28px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 active:scale-[0.98] ${equipped ? 'border-[#d6a84f]/60 bg-[#d6a84f]/16' : owned ? 'border-white/12 bg-white/8' : 'border-white/8 bg-[#040816]/58 opacity-85'}`} type="button">
      <div className="mb-3 h-12 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,#151d2e,#31213c)] shadow-inner"><ShopItemPreview item={item} /></div>
      <p className="font-display text-sm font-black leading-tight text-[#fff5d8]">{item.label}</p>
      <p className="mt-1 line-clamp-2 text-[11px] font-semibold leading-snug text-[#a9a0b5]">{item.description}</p>
      <div className="mt-2 flex flex-wrap gap-2"><span className="inline-flex rounded-full bg-black/30 px-2 py-1 text-[10px] font-black text-[#f6d98d]">{price}</span><span className="inline-flex rounded-full border border-white/10 bg-white/8 px-2 py-1 text-[10px] font-black text-[#d9cda9]">{status}</span></div>
    </button>
  );
};

const HomeUpgradeCard: React.FC<{ active: boolean; canAfford: boolean; home: HomeUpgrade; lockedPremium: boolean; lockedStars: boolean; owned: boolean; onClick: () => boolean }> = ({ active, canAfford, home, lockedPremium, lockedStars, owned, onClick }) => {
  const status = active ? 'Current' : owned ? 'Move in' : lockedPremium ? 'Premium' : lockedStars ? 'Locked' : !canAfford ? 'Need coins' : 'Buy';
  const statusClass = active ? 'bg-[#d6a84f] text-[#15101f]' : owned ? 'bg-[#b7d6c8] text-[#102018]' : lockedStars || lockedPremium || !canAfford ? 'border border-white/10 bg-white/8 text-[#a9a0b5]' : 'bg-[#f6d98d] text-[#15101f]';
  return (
    <button onClick={onClick} className={`w-full overflow-hidden rounded-[24px] border p-3 text-left shadow-[0_16px_30px_rgba(0,0,0,0.32)] transition hover:-translate-y-0.5 active:scale-[0.99] ${active ? 'border-[#d6a84f]/70 bg-[#d6a84f]/18 shadow-[0_18px_36px_rgba(214,168,79,0.16)]' : owned ? 'border-[#b7d6c8]/36 bg-[#b7d6c8]/10' : 'border-white/10 bg-white/8'}`} type="button">
      <div className="flex gap-3">
        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#050816]"><MiniRoom homeId={home.id} />{owned && !active && <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-[#b7d6c8] text-[#102018] shadow"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg></span>}</div>
        <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><span className="font-display text-sm font-black text-[#fff5d8]">{home.label}</span><span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${statusClass}`}>{status}</span></div><p className="mt-1 line-clamp-2 text-xs font-semibold text-[#a9a0b5]">{home.description}</p><p className="mt-2 text-[10px] font-black uppercase tracking-wide text-[#d6a84f]">{owned ? 'Owned' : homePriceLabel(home)}{lockedStars && !owned ? ' / locked' : ''}</p></div>
      </div>
    </button>
  );
};

const MiniRoom: React.FC<{ homeId: string }> = ({ homeId }) => {
  const mood = homeMood(homeId, new Set());
  return <div className="relative h-full w-full" style={{ background: mood.wall }}><div className="absolute inset-x-0 bottom-0 h-7" style={{ background: mood.floor }} /><span className="absolute left-2 top-2 h-8 w-10 rounded-xl bg-[#9fb6d9]/38 ring-1 ring-white/20" /><span className="absolute bottom-3 left-3 h-4 w-11 rounded-lg bg-[#6a4a75]" /><span className="absolute bottom-4 right-3 h-2 w-8 rounded bg-[#8a5a2b]" />{['luxury-penthouse', 'dream-estate'].includes(homeId) && <span className="absolute right-2 top-2 h-8 w-5 rounded bg-[#d6a84f]/30" />}</div>;
};

function homeCategoryFor(item: ShopItem): HomeTrayCategory {
  if (item.kind === 'pet') return 'pets';
  if (item.kind === 'view' || item.kind === 'wallpaper' || item.kind === 'floor') return 'views';
  if (item.category === 'kitchen') return 'kitchen';
  if (item.category === 'bathroom') return 'bathroom';
  if (item.category === 'outdoor') return 'outdoor';
  if (item.category === 'lighting') return 'lighting';
  if (['cozy-bed', 'luxury-bed', 'pet-bed', 'bath-mat'].includes(item.id)) return 'bedroom';
  if (['starter-plant', 'bookshelf', 'wall-art', 'round-mirror', 'trophy-shelf', 'aquarium', 'cozy-rug', 'piano', 'jukebox', 'telescope', 'spa-candles'].includes(item.id)) return 'decor';
  return 'living';
}

function viewFor(equipped: Set<string>, homeId: string): string {
  if (equipped.has('skyline-view')) return 'skyline';
  if (equipped.has('lake-view')) return 'lake';
  if (equipped.has('ocean-view')) return 'ocean';
  if (equipped.has('mountain-view')) return 'mountain';
  if (homeId === 'city-apartment' || homeId === 'city-loft' || homeId === 'luxury-penthouse') return 'skyline';
  if (homeId === 'beach-cottage') return 'ocean';
  if (homeId === 'lake-house') return 'lake';
  if (homeId === 'cozy-cabin') return 'mountain';
  if (homeId === 'garden-villa') return 'garden';
  if (homeId === 'dream-estate') return 'estate';
  if (homeId === 'small-trailer' || homeId === 'suburban-house') return 'neighborhood';
  return 'rain';
}

const Skyline: React.FC<{ mini?: boolean }> = ({ mini = false }) => <div className="absolute inset-x-2 bottom-2 flex items-end gap-1 opacity-70">{[18, 28, 22, 34, 25, 16].map((height, i) => <span key={i} className="w-3 rounded-t-sm bg-[#050816]/80" style={{ height: mini ? height * 0.6 : height }} />)}</div>;
const RainLines = () => <div className="absolute inset-0 opacity-45">{Array.from({ length: 10 }).map((_, i) => <span key={i} className="absolute top-0 h-full w-px rotate-12 bg-white/45" style={{ left: `${8 + i * 9}%` }} />)}</div>;
const Neighborhood = () => <div className="absolute inset-x-3 bottom-3 flex items-end gap-2 opacity-60"><span className="h-8 w-10 rounded-t-lg bg-[#2f2630]" /><span className="h-11 w-8 rounded-t-lg bg-[#3b332c]" /><span className="h-7 w-12 rounded-t-lg bg-[#243141]" /></div>;
const WaterLines = () => <div className="absolute inset-x-0 bottom-6 space-y-2 opacity-55"><span className="block h-px bg-white/60" /><span className="block h-px bg-white/40" /><span className="block h-px bg-white/30" /></div>;
const MountainLines = () => <div className="absolute inset-x-2 bottom-4 flex items-end opacity-70"><span className="h-14 w-20 bg-[#17251f]" style={{ clipPath: 'polygon(0 100%,45% 0,100% 100%)' }} /><span className="-ml-8 h-11 w-[72px] bg-[#20342b]" style={{ clipPath: 'polygon(0 100%,55% 0,100% 100%)' }} /></div>;
const GardenLines = () => <div className="absolute inset-x-2 bottom-2 flex items-end justify-around opacity-65">{[18, 25, 16, 30, 20].map((height, i) => <span key={i} className="w-8 rounded-t-full bg-[#1f4a2f]" style={{ height }} />)}</div>;

export default HomeScreen;
