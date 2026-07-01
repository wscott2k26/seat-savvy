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
  type ShopItem,
} from './lifeData';

type HomeTrayCategory =
  | 'living'
  | 'bedroom'
  | 'kitchen'
  | 'decor'
  | 'lighting'
  | 'pets'
  | 'views';

const HOME_TRAY_CATEGORIES: { id: HomeTrayCategory; label: string }[] = [
  { id: 'living', label: 'Living Room' },
  { id: 'bedroom', label: 'Bedroom' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'decor', label: 'Decor' },
  { id: 'lighting', label: 'Lighting' },
  { id: 'pets', label: 'Pets' },
  { id: 'views', label: 'Views' },
];

const HOME_ITEM_KINDS = new Set([
  'furniture',
  'decor',
  'wallpaper',
  'floor',
  'view',
  'pet',
]);

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
  const home = homeById(progress.life.homeId);
  const equipped = useMemo(
    () => new Set(progress.life.equippedDecor),
    [progress.life.equippedDecor],
  );
  const owned = useMemo(
    () => new Set(progress.life.ownedItems),
    [progress.life.ownedItems],
  );
  const ownedHomes = useMemo(
    () =>
      new Set([
        'tiny-studio',
        progress.life.homeId,
        ...(progress.life.ownedHomes ?? []),
      ]),
    [progress.life.homeId, progress.life.ownedHomes],
  );
  const selectedPet = itemById(progress.life.selectedPet);
  const stars = totalStars(progress.stars);
  const homeItems = SHOP_ITEMS.filter((item) => HOME_ITEM_KINDS.has(item.kind));
  const visibleItems = homeItems.filter(
    (item) => homeCategoryFor(item) === category,
  );

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
      </header>

      <main className="safe-content space-y-5 pt-5">
        <RoomScene
          equipped={equipped}
          home={home}
          selectedPet={selectedPet}
        />

        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,16,33,0.88),rgba(6,12,26,0.76))] p-4 shadow-[0_22px_44px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-black text-[#fff5d8]">
                Furnishings
              </h2>
              <p className="text-xs font-semibold text-[#a9a0b5]">
                Equip owned pieces or open the shop to unlock more.
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
          <h2 className="font-display text-xl font-black text-[#fff5d8]">
            Home Upgrades
          </h2>
          <p className="text-xs font-semibold text-[#a9a0b5]">
            Better views and larger rooms unlock gradually through play.
          </p>
          <div className="mt-3 space-y-3">
            {HOME_UPGRADES.map((candidate) => (
              <HomeUpgradeCard
                key={candidate.id}
                active={candidate.id === progress.life.homeId}
                canAfford={progress.coins >= candidate.cost}
                home={candidate}
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

const RoomScene: React.FC<{
  equipped: Set<string>;
  home: HomeUpgrade;
  selectedPet?: ShopItem;
}> = ({ equipped, home, selectedPet }) => {
  const mood = roomMood(home.id, equipped);
  return (
    <section className="relative h-[390px] overflow-hidden rounded-[34px] border border-[#d6a84f]/22 bg-[#050816] shadow-[0_30px_70px_rgba(0,0,0,0.55),0_0_28px_rgba(214,168,79,0.11)]">
      <div className="absolute inset-0" style={{ background: mood.wall }} />
      <div className="absolute inset-x-0 bottom-0 h-[44%]" style={{ background: mood.floor }} />
      <div className="absolute inset-x-0 bottom-[38%] h-10 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.24))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_10%,rgba(255,220,150,0.16),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_42%,rgba(0,0,0,0.38))]" />

      <HomeArchitecture homeId={home.id} />
      <Window mood={mood} />
      <KitchenCompact />
      <FloorLamp />
      <MediaConsole upgraded={equipped.has('tiny-tv')} />

      {equipped.has('old-couch') && <ModernSofa />}
      {equipped.has('cozy-bed') && <StudioBed />}
      {equipped.has('small-table') && <CoffeeTable />}
      {equipped.has('starter-plant') && <TallPlant />}
      {equipped.has('bookshelf') && <RealBookshelf />}
      {equipped.has('gaming-chair') && <LoungeChair />}
      {equipped.has('desk-setup') && <DeskSetup />}
      {equipped.has('coffee-maker') && <CounterCoffee />}
      {equipped.has('wall-art') && <WallArt />}
      {equipped.has('aquarium') && <Aquarium />}
      {equipped.has('fireplace') && <Fireplace />}
      {equipped.has('cozy-rug') && <Rug />}
      {equipped.has('pet-bed') && <PetBed />}
      {equipped.has('neon-sign') && <NeonSign />}
      {selectedPet && <Pet kind={selectedPet.preview} />}

      <div className="absolute left-4 top-4 rounded-2xl border border-white/10 bg-[#030712]/48 px-3 py-2 text-left shadow-xl backdrop-blur">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#d6a84f]">
          {mood.kicker}
        </p>
        <p className="font-display text-lg font-black leading-none text-[#fff5d8]">
          {home.label}
        </p>
      </div>
    </section>
  );
};

function roomMood(homeId: string, equipped: Set<string>) {
  const view = viewFor(equipped, homeId);
  const wallpaper = equipped.has('forest-wallpaper')
    ? 'linear-gradient(135deg,#102820,#26382f 56%,#0b1728)'
    : equipped.has('plum-wallpaper')
    ? 'linear-gradient(135deg,#141020,#32213f 54%,#091322)'
    : 'linear-gradient(135deg,#0c1427,#1e2536 48%,#17111f)';
  const floor = equipped.has('soft-rug-floor')
    ? 'repeating-linear-gradient(105deg,#2b2434 0 18px,#211b2a 18px 36px)'
    : equipped.has('polished-floor')
    ? 'repeating-linear-gradient(105deg,#7a5833 0 22px,#5b3f26 22px 44px)'
    : 'repeating-linear-gradient(105deg,#533824 0 20px,#3f2b1d 20px 40px)';

  const moods: Record<string, { kicker: string; view: string; wall: string; floor: string }> = {
    'tiny-studio': {
      kicker: 'Tiny studio',
      view,
      wall: wallpaper,
      floor,
    },
    'small-trailer': {
      kicker: 'Modest and warm',
      view: 'neighborhood',
      wall: 'repeating-linear-gradient(90deg,#1b2028 0 34px,#252832 34px 68px)',
      floor: 'repeating-linear-gradient(105deg,#4f3928 0 18px,#3a2a20 18px 36px)',
    },
    'starter-apartment': {
      kicker: 'Urban starter',
      view: 'skyline',
      wall: 'linear-gradient(135deg,#101827,#202d43 52%,#12111d)',
      floor: 'repeating-linear-gradient(105deg,#63472e 0 22px,#493421 22px 44px)',
    },
    'city-apartment': {
      kicker: 'City evening',
      view: 'skyline',
      wall: 'linear-gradient(135deg,#091426,#1c263b 48%,#10101c)',
      floor,
    },
    'cozy-cabin': {
      kicker: 'Warm timber',
      view: 'mountain',
      wall: 'linear-gradient(135deg,#23170f,#4b2f1b 54%,#151018)',
      floor: 'repeating-linear-gradient(105deg,#7a4d27 0 22px,#5d381e 22px 44px)',
    },
    'beach-cottage': {
      kicker: 'Ocean light',
      view: 'ocean',
      wall: 'linear-gradient(135deg,#0e2330,#22445a 54%,#101827)',
      floor: 'repeating-linear-gradient(105deg,#8c6b43 0 22px,#6f5337 22px 44px)',
    },
    'city-loft': {
      kicker: 'Skyline loft',
      view: 'skyline',
      wall: 'linear-gradient(135deg,#070d19,#20273b 46%,#120d1f)',
      floor: 'repeating-linear-gradient(105deg,#6a4b30 0 26px,#493321 26px 52px)',
    },
    'lake-house': {
      kicker: 'Quiet water',
      view: 'lake',
      wall: 'linear-gradient(135deg,#12211f,#26352d 54%,#0d1724)',
      floor: 'repeating-linear-gradient(105deg,#73512f 0 22px,#52371f 22px 44px)',
    },
    'luxury-penthouse': {
      kicker: 'Full Adventure',
      view: 'skyline',
      wall: 'linear-gradient(135deg,#050816,#171122 46%,#1d1731)',
      floor: 'repeating-linear-gradient(105deg,#87633b 0 24px,#604627 24px 48px)',
    },
  };

  return moods[homeId] ?? moods['tiny-studio'];
}

const HomeArchitecture: React.FC<{ homeId: string }> = ({ homeId }) => {
  if (homeId === 'small-trailer') {
    return (
      <>
        <span className="absolute left-[4%] right-[4%] top-[14%] h-5 rounded-full bg-[#d6a84f]/18 shadow-[0_0_18px_rgba(214,168,79,0.12)]" />
        <span className="absolute left-[8%] top-[18%] h-16 w-28 rounded-[26px] border-4 border-[#050816]/70 bg-[#8aa3b9]/36" />
        <span className="absolute right-[8%] bottom-[18%] h-14 w-24 rounded-t-3xl bg-[#25303a]/72 shadow-xl" />
      </>
    );
  }
  if (homeId === 'starter-apartment') {
    return (
      <>
        <span className="absolute left-[7%] top-[16%] h-24 w-24 rounded-t-[46px] border-4 border-[#805d38]/70 bg-[#9fb6d9]/22 shadow-xl" />
        <span className="absolute left-[8%] right-[42%] top-[43%] h-3 rounded-full bg-[#9b7045]/70" />
        <span className="absolute left-[12%] top-[37%] h-12 w-24 rounded-2xl bg-[#101827]/55" />
      </>
    );
  }
  if (homeId === 'city-apartment') {
    return (
      <>
        <span className="absolute left-[6%] top-[10%] h-[46%] w-16 rounded-2xl border border-[#9fb6d9]/24 bg-[#13223a]/72 shadow-xl" />
        <span className="absolute left-[24%] top-[10%] h-[46%] w-16 rounded-2xl border border-[#9fb6d9]/24 bg-[#13223a]/72 shadow-xl" />
        <span className="absolute left-[7%] top-[31%] h-px w-[33%] bg-white/20" />
      </>
    );
  }
  if (homeId === 'cozy-cabin') {
    return (
      <>
        <span className="absolute left-0 right-0 top-[22%] h-4 bg-[repeating-linear-gradient(90deg,#6b4426_0_28px,#4a2f1c_28px_56px)] shadow-lg" />
        <span className="absolute left-[10%] top-[9%] h-[48%] w-4 rounded-full bg-[#6b4426]/82" />
        <span className="absolute right-[12%] top-[9%] h-[48%] w-4 rounded-full bg-[#6b4426]/82" />
      </>
    );
  }
  if (homeId === 'beach-cottage') {
    return (
      <>
        <span className="absolute left-[6%] top-[14%] h-28 w-32 rounded-t-[58px] border-4 border-[#eadfcb]/45 bg-[#8db8c7]/28 shadow-xl" />
        <span className="absolute left-[7%] right-[7%] top-[50%] h-2 rounded-full bg-[#eadfcb]/28" />
        <span className="absolute left-[13%] top-[49%] h-16 w-24 rounded-t-[38px] bg-[#d6a84f]/18" />
      </>
    );
  }
  if (homeId === 'city-loft') {
    return (
      <>
        <span className="absolute left-[5%] right-[5%] top-[9%] h-px bg-[#d6a84f]/30" />
        <span className="absolute left-[7%] top-[11%] h-[52%] w-20 rounded-xl border border-[#9fb6d9]/22 bg-[#08111f]/72" />
        <span className="absolute left-[31%] top-[11%] h-[52%] w-20 rounded-xl border border-[#9fb6d9]/22 bg-[#08111f]/72" />
        <span className="absolute left-[7%] top-[36%] h-px w-[45%] bg-white/18" />
      </>
    );
  }
  if (homeId === 'lake-house') {
    return (
      <>
        <span className="absolute left-[7%] top-[13%] h-28 w-36 rounded-[30px] border-4 border-[#6a4a2e]/70 bg-[#7aa5c7]/24 shadow-xl" />
        <span className="absolute left-[7%] right-[7%] bottom-[39%] h-3 rounded-full bg-[#6a4a2e]/64" />
        <span className="absolute left-[15%] bottom-[34%] h-10 w-28 rounded-t-2xl bg-[#24382f]/64" />
      </>
    );
  }
  if (homeId === 'luxury-penthouse') {
    return (
      <>
        <span className="absolute left-[4%] top-[8%] h-[58%] w-[26%] rounded-3xl border border-[#d6a84f]/22 bg-[#071022]/72 shadow-2xl" />
        <span className="absolute left-[34%] top-[8%] h-[58%] w-[26%] rounded-3xl border border-[#d6a84f]/22 bg-[#071022]/72 shadow-2xl" />
        <span className="absolute right-[8%] top-[26%] h-24 w-20 rounded-t-[36px] bg-[#d6a84f]/16 shadow-xl" />
      </>
    );
  }

  return (
    <>
      <span className="absolute left-[8%] top-[16%] h-20 w-28 rounded-3xl border border-[#f6d98d]/16 bg-[#9fb6d9]/18 shadow-xl" />
      <span className="absolute left-[9%] top-[45%] h-3 w-36 rounded-full bg-[#8a623b]/56" />
    </>
  );
};

const Window: React.FC<{ mood: { view: string } }> = ({ mood }) => {
  const backgrounds: Record<string, string> = {
    rain: 'linear-gradient(180deg,#1c2b45,#496078 62%,#1b283a)',
    neighborhood: 'linear-gradient(180deg,#293348,#655640 62%,#20242d)',
    skyline: 'linear-gradient(180deg,#0c1730,#1f3760 58%,#070b14)',
    ocean: 'linear-gradient(180deg,#8db8c7,#256b83 58%,#0d4057)',
    mountain: 'linear-gradient(180deg,#5b6d7c,#2f4a40 60%,#13241c)',
    lake: 'linear-gradient(180deg,#4e6475,#275a5f 58%,#102d34)',
  };
  return (
    <div className="absolute right-[7%] top-[12%] h-36 w-36 overflow-hidden rounded-[28px] border border-[#f6d98d]/18 p-2 shadow-[0_20px_38px_rgba(0,0,0,0.42)] ring-4 ring-[#050816]/70" style={{ background: backgrounds[mood.view] ?? backgrounds.rain }}>
      <div className="absolute inset-x-0 bottom-0 h-12 bg-black/20" />
      {mood.view === 'skyline' && <Skyline />}
      {mood.view === 'rain' && <RainLines />}
      {mood.view === 'neighborhood' && <Neighborhood />}
      {(mood.view === 'ocean' || mood.view === 'lake') && <WaterLines />}
      {mood.view === 'mountain' && <MountainLines />}
      <div className="relative grid h-full grid-cols-2 gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="rounded-xl bg-white/10 shadow-inner" />
        ))}
      </div>
    </div>
  );
};

const ModernSofa = () => (
  <div className="absolute left-[8%] bottom-[23%] h-24 w-40">
    <div className="absolute bottom-0 h-14 w-full rounded-[24px] bg-[linear-gradient(180deg,#4f435d,#30263c)] shadow-[0_18px_26px_rgba(0,0,0,0.42)] ring-1 ring-white/8" />
    <div className="absolute bottom-10 left-3 h-14 w-32 rounded-[24px] bg-[linear-gradient(180deg,#6a5a74,#43364f)] shadow-lg" />
    <div className="absolute bottom-12 left-7 h-9 w-11 rounded-2xl bg-[#1f2638]/72" />
    <div className="absolute bottom-12 right-8 h-9 w-11 rounded-2xl bg-[#a86a78]/58" />
    <div className="absolute bottom-0 left-6 h-3 w-3 rounded-full bg-black/40" />
    <div className="absolute bottom-0 right-6 h-3 w-3 rounded-full bg-black/40" />
  </div>
);

const StudioBed = () => (
  <div className="absolute right-[6%] bottom-[21%] h-20 w-36">
    <div className="absolute bottom-0 h-12 w-full rounded-[20px] bg-[#4b2c38] shadow-xl ring-1 ring-white/8" />
    <div className="absolute bottom-8 left-3 h-9 w-28 rounded-2xl bg-[#d8c7a2]/80" />
    <div className="absolute bottom-[52px] left-5 h-6 w-12 rounded-xl bg-[#253650]" />
  </div>
);

const CoffeeTable = () => (
  <div className="absolute left-[42%] bottom-[22%] h-12 w-24">
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

const KitchenCompact = () => (
  <div className="absolute right-[5%] bottom-[21%] h-28 w-36 opacity-95">
    <div className="absolute bottom-0 h-16 w-full rounded-t-2xl bg-[linear-gradient(180deg,#2a3344,#151b26)] shadow-xl ring-1 ring-white/8" />
    <div className="absolute bottom-16 left-2 h-3 w-32 rounded-full bg-[#b58a53]" />
    <span className="absolute bottom-8 left-4 h-7 w-8 rounded-lg bg-[#0f1724] ring-1 ring-white/10" />
    <span className="absolute bottom-8 right-5 h-7 w-10 rounded-lg bg-[#3f4b5e]" />
    <span className="absolute bottom-22 left-6 h-12 w-24 rounded-2xl bg-[#0b1020]/72 shadow-inner" />
  </div>
);

const MediaConsole: React.FC<{ upgraded: boolean }> = ({ upgraded }) => (
  <div className="absolute left-[35%] top-[41%] h-20 w-32">
    <div className={`absolute top-0 left-5 h-12 w-24 rounded-xl bg-[#050816] shadow-xl ring-4 ${upgraded ? 'ring-[#d6a84f]/28' : 'ring-[#243148]'}`}>
      <div className="absolute inset-2 rounded-lg bg-[linear-gradient(135deg,#17243a,#0b1020)]" />
    </div>
    <div className="absolute bottom-0 h-8 w-32 rounded-2xl bg-[linear-gradient(180deg,#3b2a21,#211811)] shadow-lg" />
  </div>
);

const TallPlant = () => (
  <div className="absolute left-[19%] bottom-[21%] h-28 w-16">
    <span className="absolute bottom-0 left-5 h-9 w-9 rounded-t-xl bg-[linear-gradient(180deg,#6d4329,#402719)] shadow-lg" />
    <span className="absolute bottom-8 left-4 h-16 w-5 rounded-full bg-[#6f9b58] -rotate-12 shadow-lg" />
    <span className="absolute bottom-9 left-8 h-[68px] w-5 rounded-full bg-[#87aa67] rotate-12 shadow-lg" />
    <span className="absolute bottom-[68px] left-6 h-12 w-5 rounded-full bg-[#5f854d] rotate-45 shadow-lg" />
  </div>
);

const RealBookshelf = () => (
  <div className="absolute left-[5%] top-[36%] h-32 w-20 rounded-2xl bg-[linear-gradient(180deg,#4b2f1f,#241811)] p-2 shadow-2xl ring-1 ring-[#f6d98d]/10">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="mb-2 flex gap-1">
        <span className="h-3 w-4 rounded-sm bg-[#d6a84f]/70" />
        <span className="h-3 w-6 rounded-sm bg-[#7f8fa3]/80" />
        <span className="h-3 flex-1 rounded-sm bg-[#a86a78]/70" />
      </div>
    ))}
  </div>
);

const LoungeChair = () => (
  <div className="absolute right-[20%] bottom-[22%] h-24 w-20">
    <div className="absolute bottom-2 left-2 h-16 w-14 rounded-[24px] bg-[linear-gradient(180deg,#31536c,#17263a)] shadow-xl" />
    <div className="absolute bottom-0 left-0 h-6 w-[72px] rounded-full bg-black/24" />
  </div>
);

const DeskSetup = () => (
  <div className="absolute left-[49%] bottom-[25%] h-20 w-32">
    <div className="absolute bottom-0 h-4 w-full rounded-full bg-[#6a4129] shadow-xl" />
    <span className="absolute bottom-4 left-3 h-12 w-20 rounded-xl bg-[#08111f] ring-2 ring-[#394b63]" />
    <span className="absolute bottom-4 right-5 h-9 w-5 rounded bg-[#d6a84f]/70" />
  </div>
);

const CounterCoffee = () => (
  <div className="absolute right-[12%] bottom-[40%] h-10 w-10 rounded-xl bg-[linear-gradient(180deg,#cba15d,#6d4524)] shadow-[0_0_16px_rgba(214,168,79,0.18)] ring-1 ring-white/12">
    <span className="absolute left-3 top-2 h-5 w-4 rounded bg-[#101827]" />
    <span className="absolute -top-5 left-4 h-5 w-1 rounded-full bg-white/35 blur-[1px]" />
  </div>
);

const WallArt = () => (
  <div className="absolute left-[28%] top-[17%] h-16 w-24 rounded-2xl border-4 border-[#5d4026] bg-[linear-gradient(135deg,#d6a84f66,#273751)] shadow-xl" />
);

const Aquarium = () => (
  <div className="absolute right-[31%] bottom-[36%] h-14 w-24 rounded-2xl bg-[linear-gradient(180deg,#3aa0c0aa,#103645cc)] shadow-xl ring-2 ring-[#b7d6e8]/55">
    <span className="absolute left-4 top-5 h-2 w-5 rounded-full bg-[#f0c76a]" />
    <span className="absolute right-5 top-7 h-2 w-4 rounded-full bg-[#a86a78]" />
  </div>
);

const Fireplace = () => (
  <div className="absolute right-[9%] bottom-[22%] h-[72px] w-28 rounded-t-3xl bg-[linear-gradient(180deg,#2b1c22,#120d12)] shadow-2xl ring-2 ring-[#d6a84f]/18">
    <span className="absolute bottom-3 left-10 h-10 w-5 rounded-full bg-[#f0c76a] shadow-[0_0_28px_rgba(240,199,106,0.62)]" />
    <span className="absolute bottom-3 left-14 h-8 w-5 rounded-full bg-[#a86a78]" />
  </div>
);

const Rug = () => (
  <div className="absolute left-[24%] right-[18%] bottom-[9%] h-20 rounded-[50%] bg-[radial-gradient(circle,#a86a7870,#4b223450_62%,transparent_70%)] shadow-[0_18px_28px_rgba(0,0,0,0.22)]" />
);

const PetBed = () => (
  <div className="absolute right-[7%] bottom-[11%] h-10 w-20 rounded-full bg-[linear-gradient(180deg,#6e4151,#3a2330)] shadow-xl ring-1 ring-[#d6a84f]/16" />
);

const NeonSign = () => (
  <div className="absolute right-[9%] top-[27%] rounded-full border border-[#d6a84f]/40 px-4 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#f6d98d] shadow-[0_0_22px_rgba(214,168,79,0.46)]">
    Stay Cozy
  </div>
);

const Pet: React.FC<{ kind: string }> = ({ kind }) => (
  <div className="ts-pet-idle absolute bottom-[11%] right-[22%] h-20 w-24">
    <PetPreview kind={kind} />
  </div>
);

const DecorCard: React.FC<{
  equipped: boolean;
  item: ShopItem;
  owned: boolean;
  stars: number;
  onClick: () => void;
}> = ({ equipped, item, owned, stars, onClick }) => {
  const lockedForStars = !!item.starsRequired && stars < item.starsRequired;
  const price = shopItemPriceLabel(item);
  const status = owned
    ? equipped
      ? 'Equipped'
      : 'Owned'
    : item.premium
    ? 'Premium preview'
    : lockedForStars
    ? `${item.starsRequired} stars`
    : `${item.cost ?? 0} coins`;

  return (
    <button
      onClick={onClick}
      className={`min-h-[136px] rounded-[24px] border p-3 text-left shadow-[0_16px_28px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 active:scale-[0.98] ${
        equipped
          ? 'border-[#d6a84f]/60 bg-[#d6a84f]/16'
          : owned
          ? 'border-white/12 bg-white/8'
          : 'border-white/8 bg-[#040816]/58 opacity-85'
      }`}
      type="button"
    >
      <div className="mb-3 h-12 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,#151d2e,#31213c)] shadow-inner">
        <ItemThumbnail item={item} />
      </div>
      <p className="font-display text-sm font-black leading-tight text-[#fff5d8]">
        {item.label}
      </p>
      <p className="mt-1 line-clamp-2 text-[11px] font-semibold leading-snug text-[#a9a0b5]">
        {item.description}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="inline-flex rounded-full bg-black/30 px-2 py-1 text-[10px] font-black text-[#f6d98d]">
          {price}
        </span>
        <span className="inline-flex rounded-full border border-white/10 bg-white/8 px-2 py-1 text-[10px] font-black text-[#d9cda9]">
          {status}
        </span>
      </div>
    </button>
  );
};

const HomeUpgradeCard: React.FC<{
  active: boolean;
  canAfford: boolean;
  home: HomeUpgrade;
  lockedStars: boolean;
  owned: boolean;
  onClick: () => boolean;
}> = ({ active, canAfford, home, lockedStars, owned, onClick }) => {
  const status = active
    ? 'Current'
    : owned
      ? 'Move in'
      : lockedStars
        ? 'Locked'
        : !canAfford
          ? 'Need coins'
          : 'Buy';
  const statusClass = active
    ? 'bg-[#d6a84f] text-[#15101f]'
    : owned
      ? 'bg-[#b7d6c8] text-[#102018]'
      : lockedStars || !canAfford
        ? 'border border-white/10 bg-white/8 text-[#a9a0b5]'
        : 'bg-[#f6d98d] text-[#15101f]';

  return (
    <button
      onClick={onClick}
      className={`w-full overflow-hidden rounded-[24px] border p-3 text-left shadow-[0_16px_30px_rgba(0,0,0,0.32)] transition hover:-translate-y-0.5 active:scale-[0.99] ${
        active
          ? 'border-[#d6a84f]/70 bg-[#d6a84f]/18 shadow-[0_18px_36px_rgba(214,168,79,0.16)]'
          : owned
            ? 'border-[#b7d6c8]/36 bg-[#b7d6c8]/10'
            : 'border-white/10 bg-white/8'
      }`}
      type="button"
    >
      <div className="flex gap-3">
        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#050816]">
          <MiniRoom homeId={home.id} />
          {owned && !active && (
            <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-[#b7d6c8] text-[#102018] shadow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <span className="font-display text-sm font-black text-[#fff5d8]">
              {home.label}
            </span>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${statusClass}`}>
              {status}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-xs font-semibold text-[#a9a0b5]">
            {home.description}
          </p>
          <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-[#d6a84f]">
            {owned ? 'Owned' : homePriceLabel(home)}
            {lockedStars && !owned ? ' / locked' : ''}
          </p>
          {home.premium && !owned && (
            <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-[#a9a0b5]">
              Premium home
            </p>
          )}
        </div>
      </div>
    </button>
  );
};

const ItemThumbnail: React.FC<{ item: ShopItem }> = ({ item }) => (
  <ShopItemPreview item={item} />
);

const MiniRoom: React.FC<{ homeId: string }> = ({ homeId }) => {
  const mood = roomMood(homeId, new Set());
  const floor = (
    <div
      className="absolute inset-x-0 bottom-0 h-7"
      style={{ background: mood.floor }}
    />
  );

  if (homeId === 'small-trailer') {
    return (
      <div className="relative h-full w-full" style={{ background: mood.wall }}>
        {floor}
        <span className="absolute left-2 right-2 top-2 h-3 rounded-full bg-[#d6a84f]/24" />
        <span className="absolute left-2 top-5 h-6 w-8 rounded-xl bg-[#9fb6d9]/48 ring-1 ring-white/20" />
        <span className="absolute right-2 bottom-3 h-5 w-8 rounded-t-2xl bg-[#25303a]" />
        <span className="absolute left-4 bottom-1 h-2 w-2 rounded-full bg-black/45" />
      </div>
    );
  }

  if (homeId === 'starter-apartment') {
    return (
      <div className="relative h-full w-full" style={{ background: mood.wall }}>
        {floor}
        <span className="absolute left-2 top-2 h-9 w-9 rounded-t-[18px] bg-[#9fb6d9]/42 ring-2 ring-[#805d38]/60" />
        <span className="absolute right-2 top-5 h-2 w-9 rounded bg-[#9b7045]" />
        <span className="absolute bottom-3 left-3 h-4 w-10 rounded-lg bg-[#6a4a75]" />
      </div>
    );
  }

  if (homeId === 'city-apartment') {
    return (
      <div className="relative h-full w-full" style={{ background: mood.wall }}>
        {floor}
        <span className="absolute left-2 top-2 h-10 w-5 rounded-md bg-[#13223a] ring-1 ring-[#9fb6d9]/35" />
        <span className="absolute left-8 top-2 h-10 w-5 rounded-md bg-[#13223a] ring-1 ring-[#9fb6d9]/35" />
        <span className="absolute bottom-3 right-2 h-5 w-9 rounded-lg bg-[#34445d]" />
      </div>
    );
  }

  if (homeId === 'cozy-cabin') {
    return (
      <div className="relative h-full w-full" style={{ background: mood.wall }}>
        {floor}
        <span className="absolute left-0 right-0 top-4 h-2 bg-[#6b4426]" />
        <span className="absolute left-2 top-2 h-11 w-2 rounded-full bg-[#6b4426]" />
        <span className="absolute right-3 bottom-3 h-6 w-8 rounded-t-2xl bg-[#2b1c22]" />
        <span className="absolute right-5 bottom-4 h-4 w-2 rounded-full bg-[#f0c76a]" />
      </div>
    );
  }

  if (homeId === 'beach-cottage') {
    return (
      <div className="relative h-full w-full" style={{ background: mood.wall }}>
        {floor}
        <span className="absolute left-2 top-3 h-9 w-10 rounded-t-[22px] bg-[#8db8c7]/48 ring-2 ring-[#eadfcb]/40" />
        <span className="absolute right-2 top-4 h-7 w-7 rounded-full bg-[#f0c76a]/45" />
        <span className="absolute bottom-3 left-3 h-4 w-11 rounded-full bg-[#d6a84f]/38" />
      </div>
    );
  }

  if (homeId === 'city-loft') {
    return (
      <div className="relative h-full w-full" style={{ background: mood.wall }}>
        {floor}
        <span className="absolute left-2 top-2 h-11 w-6 rounded-md bg-[#08111f] ring-1 ring-[#9fb6d9]/30" />
        <span className="absolute left-10 top-2 h-11 w-6 rounded-md bg-[#08111f] ring-1 ring-[#9fb6d9]/30" />
        <span className="absolute left-2 right-2 top-6 h-px bg-white/20" />
        <span className="absolute bottom-3 right-3 h-5 w-9 rounded bg-[#8a5a2b]" />
      </div>
    );
  }

  if (homeId === 'lake-house') {
    return (
      <div className="relative h-full w-full" style={{ background: mood.wall }}>
        {floor}
        <span className="absolute left-2 top-3 h-8 w-12 rounded-xl bg-[#7aa5c7]/38 ring-2 ring-[#6a4a2e]/60" />
        <span className="absolute left-1 right-1 bottom-7 h-1.5 rounded-full bg-[#6a4a2e]" />
        <span className="absolute bottom-3 left-4 h-4 w-11 rounded-t-xl bg-[#24382f]" />
      </div>
    );
  }

  if (homeId === 'luxury-penthouse') {
    return (
      <div className="relative h-full w-full" style={{ background: mood.wall }}>
        {floor}
        <span className="absolute left-2 top-2 h-11 w-6 rounded-lg bg-[#071022] ring-1 ring-[#d6a84f]/30" />
        <span className="absolute left-9 top-2 h-11 w-6 rounded-lg bg-[#071022] ring-1 ring-[#d6a84f]/30" />
        <span className="absolute right-2 bottom-3 h-7 w-5 rounded-t-xl bg-[#d6a84f]/30" />
        <span className="absolute left-2 right-2 top-1 h-px bg-[#d6a84f]/45" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full" style={{ background: mood.wall }}>
      {floor}
      <span className="absolute right-2 top-2 h-7 w-7 rounded-lg bg-[#9fb6d9]/50 ring-1 ring-white/20" />
      <span className="absolute bottom-3 left-2 h-4 w-10 rounded-lg bg-[#54415d]" />
      <span className="absolute bottom-4 right-3 h-2 w-8 rounded bg-[#8a5a2b]" />
    </div>
  );
};

function homeCategoryFor(item: ShopItem): HomeTrayCategory {
  if (item.kind === 'pet') return 'pets';
  if (item.kind === 'view' || item.kind === 'wallpaper' || item.kind === 'floor') return 'views';
  if (['cozy-bed', 'pet-bed'].includes(item.id)) return 'bedroom';
  if (['coffee-maker'].includes(item.id)) return 'kitchen';
  if (['fireplace', 'neon-sign'].includes(item.id)) return 'lighting';
  if (['starter-plant', 'bookshelf', 'wall-art', 'aquarium', 'cozy-rug'].includes(item.id)) return 'decor';
  return 'living';
}

function viewFor(equipped: Set<string>, homeId: string): string {
  if (equipped.has('ocean-view')) return 'ocean';
  if (equipped.has('mountain-view')) return 'mountain';
  if (homeId === 'city-apartment' || homeId === 'city-loft' || homeId === 'luxury-penthouse') return 'skyline';
  if (homeId === 'beach-cottage' || homeId === 'cruise') return 'ocean';
  if (homeId === 'lake-house') return 'lake';
  if (homeId === 'cozy-cabin') return 'mountain';
  if (homeId === 'small-trailer') return 'neighborhood';
  return 'rain';
}

const Skyline: React.FC<{ mini?: boolean }> = ({ mini = false }) => (
  <div className="absolute inset-x-2 bottom-2 flex items-end gap-1 opacity-70">
    {[18, 28, 22, 34, 25, 16].map((height, i) => (
      <span
        key={i}
        className="w-3 rounded-t-sm bg-[#050816]/80"
        style={{ height: mini ? height * 0.6 : height }}
      />
    ))}
  </div>
);

const RainLines = () => (
  <div className="absolute inset-0 opacity-45">
    {Array.from({ length: 10 }).map((_, i) => (
      <span
        key={i}
        className="absolute top-0 h-full w-px rotate-12 bg-white/45"
        style={{ left: `${8 + i * 9}%` }}
      />
    ))}
  </div>
);

const Neighborhood = () => (
  <div className="absolute inset-x-3 bottom-3 flex items-end gap-2 opacity-60">
    <span className="h-8 w-10 rounded-t-lg bg-[#2f2630]" />
    <span className="h-11 w-8 rounded-t-lg bg-[#3b332c]" />
    <span className="h-7 w-12 rounded-t-lg bg-[#243141]" />
  </div>
);

const WaterLines = () => (
  <div className="absolute inset-x-0 bottom-6 space-y-2 opacity-55">
    <span className="block h-px bg-white/60" />
    <span className="block h-px bg-white/40" />
    <span className="block h-px bg-white/30" />
  </div>
);

const MountainLines = () => (
  <div className="absolute inset-x-2 bottom-4 flex items-end opacity-70">
    <span className="h-14 w-20 bg-[#17251f]" style={{ clipPath: 'polygon(0 100%,45% 0,100% 100%)' }} />
    <span className="-ml-8 h-11 w-[72px] bg-[#20342b]" style={{ clipPath: 'polygon(0 100%,55% 0,100% 100%)' }} />
  </div>
);

export default HomeScreen;
