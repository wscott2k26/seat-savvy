import React, { useState } from 'react';
import { useGame } from './GameProvider';
import { ShopItemPreview } from './ItemPreview';
import {
  ACHIEVEMENTS,
  DAILY_MISSIONS,
  SHOP_CATEGORY_LABELS,
  SHOP_ITEMS,
  canOwnItem,
  dailyRewardForDate,
  nextLevelRewardLabel,
  playerLevelForXp,
  shopItemPriceLabel,
  totalStars,
  xpIntoLevel,
  type ShopCategory,
  type ShopItem,
} from './lifeData';

const categories: ShopCategory[] = [
  'furniture',
  'decor',
  'pets',
  'outfits',
  'hats',
  'accessories',
  'views',
  'wallpapers',
  'floors',
  'music',
  'victory',
  'trails',
];

const panelClass =
  'rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,16,33,0.9),rgba(5,10,23,0.78))] p-4 shadow-[0_24px_48px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-[#d6a84f]/10 backdrop-blur';

const ScreenHeader: React.FC<{
  title: string;
  kicker: string;
  text: string;
  action?: React.ReactNode;
}> = ({ title, kicker, text, action }) => {
  const { openMenu } = useGame();
  return (
    <header className="relative overflow-hidden rounded-b-[34px] border-b border-[#d6a84f]/22 bg-[linear-gradient(145deg,rgba(4,9,20,0.98),rgba(29,23,48,0.96)_55%,rgba(8,26,44,0.98))] px-5 pb-5 pt-5 shadow-[0_24px_58px_rgba(0,0,0,0.52),0_0_32px_rgba(214,168,79,0.1)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_8%,rgba(214,168,79,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.07),transparent_48%,rgba(0,0,0,0.24))]" />
      <div className="relative flex items-center justify-between gap-3">
        <button
          onClick={openMenu}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/10 text-[#fff5d8] shadow active:scale-95"
          type="button"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        {action}
      </div>
      <p className="relative mt-4 text-xs font-black uppercase tracking-[0.18em] text-[#d6a84f]">
        {kicker}
      </p>
      <h1 className="relative font-display text-3xl font-black text-[#fff5d8]">{title}</h1>
      <p className="relative mt-1 text-sm font-semibold leading-relaxed text-[#d9cda9]">{text}</p>
    </header>
  );
};

export const ShopScreen: React.FC = () => {
  const { buyShopItem, openMysteryBox, progress } = useGame();
  const [category, setCategory] = useState<ShopCategory>('furniture');
  const stars = totalStars(progress.stars);
  const items = SHOP_ITEMS.filter((item) => item.category === category);

  return (
    <div className="relative h-full w-full overflow-y-auto bg-[linear-gradient(180deg,#050816_0%,#11172b_48%,#271733_100%)] pb-8 text-[#f8edd2]">
      <ScreenHeader
        kicker="Design Store"
        title="Shop"
        text="Spend puzzle coins on mature home pieces, polished cosmetics, companions, and future local music packs."
        action={
          <div className="rounded-full bg-[#d6a84f]/16 px-4 py-2 text-sm font-black text-[#f6d98d] ring-1 ring-[#d6a84f]/24">
            {progress.coins} coins
          </div>
        }
      />
      <main className="space-y-5 px-4 pt-5">
        <section className={panelClass}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-black text-[#fff5d8]">Mystery Box</h2>
              <p className="text-xs font-semibold text-[#a9a0b5]">
                In-game coins only. Random decor or cosmetic rewards, no real-money gambling.
              </p>
            </div>
            <button
              onClick={openMysteryBox}
              className="rounded-2xl bg-gradient-to-r from-[#d6a84f] to-[#f0c76a] px-4 py-3 text-sm font-black text-[#15101f] shadow-[0_12px_24px_rgba(214,168,79,0.24)] active:scale-95"
              type="button"
            >
              140 coins
            </button>
          </div>
        </section>

        <section className={panelClass}>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 rounded-full px-3 py-2 text-xs font-black shadow transition active:scale-95 ${
                  category === cat
                    ? 'bg-[#d6a84f] text-[#15101f]'
                    : 'border border-white/10 bg-white/8 text-[#d9cda9]'
                }`}
                type="button"
              >
                {SHOP_CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {items.map((item) => (
              <ShopCard
                key={item.id}
                item={item}
                owned={progress.life.ownedItems.includes(item.id)}
                canBuy={canOwnItem(item, progress)}
                coins={progress.coins}
                stars={stars}
                onBuy={() => buyShopItem(item.id)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const ShopCard: React.FC<{
  item: ShopItem;
  owned: boolean;
  canBuy: boolean;
  coins: number;
  stars: number;
  onBuy: () => boolean;
}> = ({ item, owned, canBuy, coins, stars, onBuy }) => {
  const lockedForStars = !!item.starsRequired && stars < item.starsRequired;
  const lockedForCoins = !!item.cost && coins < item.cost;
  const price = shopItemPriceLabel(item);
  const lockReason = item.premium
    ? 'Future premium'
    : lockedForStars
    ? `Needs ${item.starsRequired} stars`
    : lockedForCoins
    ? `Needs ${item.cost} coins`
    : '';

  return (
    <button
      onClick={owned ? undefined : onBuy}
      className={`min-h-[180px] overflow-hidden rounded-[26px] border text-left shadow-[0_18px_34px_rgba(0,0,0,0.36)] transition hover:-translate-y-0.5 active:scale-[0.98] ${
        owned
          ? 'border-[#d6a84f]/50 bg-[#d6a84f]/14'
          : canBuy
          ? 'border-white/10 bg-[#071022]/80 hover:border-[#d6a84f]/34'
          : 'border-white/8 bg-[#040816]/68 opacity-85'
      }`}
      type="button"
    >
      <div className="h-20 overflow-hidden border-b border-white/10 bg-[linear-gradient(135deg,#101827,#2b2038)]">
        <ShopThumbnail item={item} />
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-sm font-black leading-tight text-[#fff5d8]">{item.label}</p>
          {owned && (
            <span className="rounded-full bg-[#d6a84f] px-2 py-0.5 text-[9px] font-black text-[#15101f]">
              Owned
            </span>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-[11px] font-semibold leading-snug text-[#a9a0b5]">
          {item.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-black/30 px-2 py-1 text-[10px] font-black text-[#f6d98d]">
            {price}
          </span>
          {owned && (
            <span className="rounded-full border border-[#d6a84f]/28 bg-[#d6a84f]/10 px-2 py-1 text-[10px] font-black text-[#f6d98d]">
              Equip from Home
            </span>
          )}
          {!owned && lockReason && (
            <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-black text-[#a9a0b5]">
              {lockReason}
            </span>
          )}
          {!owned && canBuy && !lockReason && (
            <span className="rounded-full border border-[#d6a84f]/30 bg-[#d6a84f]/12 px-2 py-1 text-[10px] font-black text-[#f6d98d]">
              Buy
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export const MissionsScreen: React.FC = () => {
  const { claimDailyReward, claimMission, progress } = useGame();
  const reward = dailyRewardForDate(progress.life.daily.date);
  const claimedDaily =
    progress.life.daily.claimedDailyDate === progress.life.daily.date;
  const level = playerLevelForXp(progress.xp);
  const xp = xpIntoLevel(progress.xp);

  return (
    <div className="relative h-full w-full overflow-y-auto bg-[linear-gradient(180deg,#050816_0%,#13172d_50%,#281735_100%)] pb-8 text-[#f8edd2]">
      <ScreenHeader
        kicker="Daily Cozy List"
        title="Missions"
        text="Small goals give extra coins, XP, hints, and reasons to visit your tiny life between puzzles."
        action={
          <div className="rounded-full bg-[#d6a84f]/16 px-4 py-2 text-sm font-black text-[#f6d98d] ring-1 ring-[#d6a84f]/24">
            Lv {level}
          </div>
        }
      />
      <main className="space-y-5 px-4 pt-5">
        {!claimedDaily && (
          <section className={panelClass}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-black text-[#fff5d8]">Daily Reward</h2>
                <p className="text-xs font-semibold text-[#a9a0b5]">
                  Today&apos;s gift: <span className="text-[#f6d98d]">{reward.label}</span>
                </p>
              </div>
              <button
                onClick={claimDailyReward}
                className="rounded-2xl bg-gradient-to-r from-[#d6a84f] to-[#f0c76a] px-4 py-3 text-sm font-black text-[#15101f] shadow active:scale-95"
                type="button"
              >
                Claim
              </button>
            </div>
          </section>
        )}

        <section className={panelClass}>
          <div className="flex items-center justify-between text-xs font-bold text-[#d9cda9]">
            <span>Player Level {level}</span>
            <span>Next: {nextLevelRewardLabel(level)}</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-black/36">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#d6a84f] to-[#f4d98b] shadow-[0_0_14px_rgba(214,168,79,0.35)]"
              style={{ width: `${(xp / 300) * 100}%` }}
            />
          </div>
        </section>

        <section className="space-y-3">
          {DAILY_MISSIONS.map((mission) => {
            const value = Math.min(mission.target, mission.progress(progress.life.daily));
            const done = value >= mission.target;
            const claimed = progress.life.daily.claimedMissions.includes(mission.id);
            return (
              <div key={mission.id} className={panelClass}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-lg font-black text-[#fff5d8]">
                      {mission.label}
                    </h2>
                    <p className="text-xs font-semibold text-[#a9a0b5]">{mission.description}</p>
                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-black/36">
                      <div
                        className="h-full rounded-full bg-[#d6a84f]"
                        style={{ width: `${(value / mission.target) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-[#d9cda9]">
                      {value}/{mission.target} - {mission.rewardCoins} coins - {mission.rewardXp} XP
                    </p>
                  </div>
                  <button
                    onClick={() => claimMission(mission.id)}
                    disabled={!done || claimed}
                    className={`rounded-2xl px-3 py-2 text-xs font-black shadow active:scale-95 ${
                      claimed
                        ? 'border border-white/10 bg-white/8 text-[#a9a0b5]'
                        : done
                        ? 'bg-[#d6a84f] text-[#15101f]'
                        : 'border border-white/10 bg-white/8 text-[#7f7890]'
                    }`}
                    type="button"
                  >
                    {claimed ? 'Done' : done ? 'Claim' : 'Soon'}
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export const AchievementsScreen: React.FC = () => {
  const { progress } = useGame();
  const claimed = new Set(progress.life.claimedAchievements);
  const solved = progress.completed.length;
  const stars = totalStars(progress.stars);

  return (
    <div className="relative h-full w-full overflow-y-auto bg-[linear-gradient(180deg,#050816_0%,#10172c_48%,#271733_100%)] pb-8 text-[#f8edd2]">
      <ScreenHeader
        kicker="Reward Shelf"
        title="Achievements"
        text="A cozy record of puzzle skill, collecting, pets, and home progress."
        action={
          <div className="rounded-full bg-[#d6a84f]/16 px-4 py-2 text-sm font-black text-[#f6d98d] ring-1 ring-[#d6a84f]/24">
            {claimed.size}/{ACHIEVEMENTS.length}
          </div>
        }
      />
      <main className="space-y-5 px-4 pt-5">
        <section className={panelClass}>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-black text-[#d9cda9]">
            <span className="rounded-2xl bg-white/8 px-2 py-3">{solved} solved</span>
            <span className="rounded-2xl bg-white/8 px-2 py-3">{stars} stars</span>
            <span className="rounded-2xl bg-white/8 px-2 py-3">{progress.life.ownedItems.length} items</span>
          </div>
        </section>
        <section className="grid grid-cols-1 gap-3">
          {ACHIEVEMENTS.map((achievement) => {
            const earned = claimed.has(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`rounded-[24px] border p-4 shadow-[0_14px_28px_rgba(0,0,0,0.28)] ${
                  earned
                    ? 'border-[#d6a84f]/42 bg-[#d6a84f]/14'
                    : 'border-white/10 bg-[#071022]/72'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
                    earned ? 'bg-[#d6a84f] text-[#15101f]' : 'bg-white/8 text-[#7f7890]'
                  }`}>
                    <svg width="19" height="19" viewBox="0 0 24 24" fill={earned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9z" /></svg>
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-black text-[#fff5d8]">
                      {achievement.label}
                    </h2>
                    <p className="text-xs font-semibold text-[#a9a0b5]">{achievement.description}</p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-[#d6a84f]">
                      {earned ? 'Unlocked' : 'Keep playing'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export const DailyRewardModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { claimDailyReward, progress } = useGame();
  const reward = dailyRewardForDate(progress.life.daily.date);
  const claimed =
    progress.life.daily.claimedDailyDate === progress.life.daily.date;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-[#030712]/72 p-4 backdrop-blur-md">
      <div className="ts-pop w-full max-w-sm overflow-hidden rounded-[32px] border border-[#d6a84f]/30 bg-[linear-gradient(160deg,#081124,#21162f_58%,#0c2238)] text-center text-[#f8edd2] shadow-[0_32px_80px_rgba(0,0,0,0.62),0_0_34px_rgba(214,168,79,0.13)]">
        <div className="h-20 bg-[radial-gradient(circle_at_50%_0%,rgba(214,168,79,0.42),transparent_58%),linear-gradient(90deg,rgba(214,168,79,0.18),rgba(255,255,255,0.04),rgba(168,106,120,0.18))]" />
        <div className="-mt-9 px-5 pb-5">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-[24px] bg-[#d6a84f]/18 text-[#f6d98d] shadow-[0_0_24px_rgba(214,168,79,0.24)] ring-1 ring-[#d6a84f]/30 backdrop-blur">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v8H4v-8" /><path d="M2 7h20v5H2z" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 1 1 2.1-3.8C10.5 4.6 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 1 0-2.1-3.8C13.5 4.6 12 7 12 7z" /></svg>
        </div>
        <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-[#d6a84f]">
          Daily Reward
        </p>
        <h2 className="font-display text-2xl font-black text-[#fff5d8]">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm font-semibold text-[#d9cda9]">
          Today&apos;s cozy gift is <span className="text-[#f6d98d]">{reward.label}</span>.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/10 py-3 text-sm font-black text-[#eadfcb] active:scale-95"
            type="button"
          >
            Later
          </button>
          <button
            onClick={() => {
              if (!claimed) claimDailyReward();
              onClose();
            }}
            className="rounded-2xl bg-gradient-to-r from-[#d6a84f] to-[#f0c76a] py-3 text-sm font-black text-[#15101f] shadow-[0_12px_24px_rgba(214,168,79,0.24)] active:scale-95"
            type="button"
          >
            {claimed ? 'Claimed' : 'Claim'}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export const LifeNoticeModal: React.FC = () => {
  const { dismissNotice, notice } = useGame();
  if (!notice) return null;
  return (
    <button
      onClick={dismissNotice}
      className="fixed left-4 right-4 top-4 z-[140] mx-auto max-w-sm rounded-[26px] border border-[#d6a84f]/34 bg-[linear-gradient(145deg,rgba(6,13,28,0.97),rgba(35,24,48,0.97))] p-4 text-left text-[#f8edd2] shadow-[0_22px_52px_rgba(0,0,0,0.5),0_0_26px_rgba(214,168,79,0.12)] ring-1 ring-white/10 backdrop-blur-md active:scale-[0.99]"
      type="button"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#d6a84f]/18 text-[#f6d98d] shadow-[0_0_18px_rgba(214,168,79,0.2)] ring-1 ring-[#d6a84f]/26">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9z" /></svg>
        </span>
        <span>
          <p className="font-display text-lg font-black text-[#fff5d8]">{notice.title}</p>
          <p className="mt-1 text-sm font-semibold text-[#d9cda9]">{notice.text}</p>
        </span>
      </div>
    </button>
  );
};

const ShopThumbnail: React.FC<{ item: ShopItem }> = ({ item }) => (
  <ShopItemPreview item={item} />
);
