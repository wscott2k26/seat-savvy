import { Capacitor } from '@capacitor/core';
import type {
  IError,
  Product,
  Receipt,
  Transaction,
  VerifiedReceipt,
} from 'capacitor-plugin-cdv-purchase';

type PurchaseModule = typeof import('capacitor-plugin-cdv-purchase');

export const FULL_ADVENTURE_PRODUCT_ID =
  import.meta.env.VITE_FULL_ADVENTURE_PRODUCT_ID?.trim() ||
  'com.wscott2k26.seatsavvy.full_adventure';

const PURCHASE_VALIDATOR_URL =
  import.meta.env.VITE_PURCHASE_VALIDATOR_URL?.trim() || '';

const nativePurchasePlatforms = new Set(['ios', 'android']);
const ownedListeners = new Set<() => void>();

let purchaseModule: PurchaseModule | null = null;
let initPromise: Promise<NativeStoreState> | null = null;

export interface PremiumPurchaseInfo {
  productId: string;
  platform: 'ios' | 'android' | 'web';
  nativeAvailable: boolean;
  storeReady: boolean;
  canPurchase: boolean;
  title: string;
  description: string;
  priceLabel: string;
}

export type PremiumPurchaseStatus =
  | 'purchased'
  | 'restored'
  | 'already-owned'
  | 'pending'
  | 'cancelled'
  | 'unavailable'
  | 'failed';

export interface PremiumPurchaseResult {
  status: PremiumPurchaseStatus;
  message: string;
  source: 'app-store' | 'play-store' | 'local';
  productId: string;
}

interface NativeStoreState {
  module: PurchaseModule;
  platform:
    | PurchaseModule['Platform']['APPLE_APPSTORE']
    | PurchaseModule['Platform']['GOOGLE_PLAY'];
}

export function onPremiumOwned(listener: () => void): () => void {
  ownedListeners.add(listener);
  return () => ownedListeners.delete(listener);
}

export function isNativePurchasePlatform(): boolean {
  return nativePurchasePlatforms.has(Capacitor.getPlatform());
}

export async function getPremiumProductInfo(): Promise<PremiumPurchaseInfo> {
  if (!isNativePurchasePlatform()) {
    return localProductInfo();
  }

  try {
    const { module, platform } = await ensureNativeStore();
    const product = await waitForProduct(module.store, platform);
    return productInfoFromNativeProduct(module, platform, product);
  } catch (error) {
    return {
      ...localProductInfo(),
      nativeAvailable: true,
      storeReady: false,
      canPurchase: false,
      platform: nativePlatformName(),
      priceLabel: 'App Store purchase',
      description: errorMessage(error),
    };
  }
}

export async function purchaseFullAdventure(): Promise<PremiumPurchaseResult> {
  if (!isNativePurchasePlatform()) {
    notifyPremiumOwned();
    return {
      status: 'purchased',
      source: 'local',
      productId: FULL_ADVENTURE_PRODUCT_ID,
      message: 'Full Adventure unlocked on this device.',
    };
  }

  const source = Capacitor.getPlatform() === 'android' ? 'play-store' : 'app-store';

  try {
    const { module, platform } = await ensureNativeStore();
    const { store } = module;
    if (storeOwnsProduct(store, platform)) {
      notifyPremiumOwned();
      return {
        status: 'already-owned',
        source,
        productId: FULL_ADVENTURE_PRODUCT_ID,
        message: 'Full Adventure is already unlocked on this store account.',
      };
    }

    const product = await waitForProduct(store, platform);
    const offer = product?.getOffer();
    if (!product || !offer) {
      return {
        status: 'unavailable',
        source,
        productId: FULL_ADVENTURE_PRODUCT_ID,
        message:
          'The Full Adventure product was not found. Check the App Store Connect product ID before submitting.',
      };
    }

    const ownershipPromise = waitForOwned(store, platform, 15000);
    const error = await offer.order();
    if (error) return resultFromStoreError(module, error, source);

    const owned = await ownershipPromise;
    if (owned || storeOwnsProduct(store, platform)) {
      notifyPremiumOwned();
      return {
        status: 'purchased',
        source,
        productId: FULL_ADVENTURE_PRODUCT_ID,
        message: 'Full Adventure unlocked.',
      };
    }

    return {
      status: 'pending',
      source,
      productId: FULL_ADVENTURE_PRODUCT_ID,
      message:
        'Purchase is pending approval. Full Adventure will unlock as soon as the store confirms it.',
    };
  } catch (error) {
    return {
      status: 'failed',
      source,
      productId: FULL_ADVENTURE_PRODUCT_ID,
      message: errorMessage(error),
    };
  }
}

export async function restoreFullAdventure(): Promise<PremiumPurchaseResult> {
  if (!isNativePurchasePlatform()) {
    notifyPremiumOwned();
    return {
      status: 'restored',
      source: 'local',
      productId: FULL_ADVENTURE_PRODUCT_ID,
      message: 'Full Adventure restored on this device.',
    };
  }

  const source = Capacitor.getPlatform() === 'android' ? 'play-store' : 'app-store';

  try {
    const { module, platform } = await ensureNativeStore();
    const error = await module.store.restorePurchases();
    if (error) return resultFromStoreError(module, error, source);

    const owned = await waitForOwned(module.store, platform, 7000);
    if (owned || storeOwnsProduct(module.store, platform)) {
      notifyPremiumOwned();
      return {
        status: 'restored',
        source,
        productId: FULL_ADVENTURE_PRODUCT_ID,
        message: 'Full Adventure purchase restored.',
      };
    }

    return {
      status: 'unavailable',
      source,
      productId: FULL_ADVENTURE_PRODUCT_ID,
      message: 'No Full Adventure purchase was found for this store account.',
    };
  } catch (error) {
    return {
      status: 'failed',
      source,
      productId: FULL_ADVENTURE_PRODUCT_ID,
      message: errorMessage(error),
    };
  }
}

async function ensureNativeStore(): Promise<NativeStoreState> {
  if (initPromise) return initPromise;
  initPromise = initializeNativeStore();
  return initPromise;
}

async function initializeNativeStore(): Promise<NativeStoreState> {
  const module = await loadPurchaseModule();
  const platform =
    Capacitor.getPlatform() === 'android'
      ? module.Platform.GOOGLE_PLAY
      : module.Platform.APPLE_APPSTORE;
  const { store } = module;

  store.verbosity = import.meta.env.DEV
    ? module.LogLevel.WARNING
    : module.LogLevel.ERROR;
  if (PURCHASE_VALIDATOR_URL) {
    store.validator = PURCHASE_VALIDATOR_URL;
  }

  store.register({
    id: FULL_ADVENTURE_PRODUCT_ID,
    type: module.ProductType.NON_CONSUMABLE,
    platform,
  });

  store.when()
    .approved((transaction) => {
      if (!transactionContainsProduct(transaction)) return;
      if (PURCHASE_VALIDATOR_URL) {
        void transaction.verify().catch(() => transaction.finish());
      } else {
        notifyPremiumOwned();
        void transaction.finish();
      }
    }, 'seatsavvy_full_adventure_approved')
    .finished((transaction) => {
      if (transactionContainsProduct(transaction)) notifyPremiumOwned();
    }, 'seatsavvy_full_adventure_finished')
    .verified((receipt) => {
      if (verifiedReceiptContainsProduct(receipt) || storeOwnsProduct(store, platform)) {
        notifyPremiumOwned();
      }
      void receipt.finish();
    }, 'seatsavvy_full_adventure_verified')
    .receiptUpdated((receipt) => {
      if (receiptContainsProduct(receipt) || storeOwnsProduct(store, platform)) {
        notifyPremiumOwned();
      }
    }, 'seatsavvy_full_adventure_receipt')
    .receiptsReady(() => {
      if (storeOwnsProduct(store, platform)) notifyPremiumOwned();
    }, 'seatsavvy_full_adventure_ready');

  const errors = await store.initialize([
    platform === module.Platform.APPLE_APPSTORE
      ? { platform, options: { needAppReceipt: true } }
      : platform,
  ]);

  const blockingError = errors.find(
    (error) => error.productId === FULL_ADVENTURE_PRODUCT_ID || !error.productId,
  );
  if (blockingError) {
    throw new Error(blockingError.message);
  }

  return { module, platform };
}

async function loadPurchaseModule(): Promise<PurchaseModule> {
  purchaseModule ??= await import('capacitor-plugin-cdv-purchase');
  return purchaseModule;
}

async function waitForProduct(
  store: PurchaseModule['store'],
  platform: NativeStoreState['platform'],
): Promise<Product | undefined> {
  const existing = store.get(FULL_ADVENTURE_PRODUCT_ID, platform);
  if (existing) return existing;

  await Promise.race([
    new Promise<void>((resolve) => store.ready(resolve)),
    delay(4500),
  ]);

  const readyProduct = store.get(FULL_ADVENTURE_PRODUCT_ID, platform);
  if (readyProduct) return readyProduct;

  try {
    await store.update();
  } catch {
    // StoreKit can be unavailable in browser/simulator-like contexts; the caller handles no product.
  }

  return store.get(FULL_ADVENTURE_PRODUCT_ID, platform);
}

function waitForOwned(
  store: PurchaseModule['store'],
  platform: NativeStoreState['platform'],
  timeoutMs: number,
): Promise<boolean> {
  if (storeOwnsProduct(store, platform)) return Promise.resolve(true);

  return new Promise((resolve) => {
    const off = onPremiumOwned(() => {
      window.clearTimeout(timer);
      off();
      resolve(true);
    });
    const timer = window.setTimeout(() => {
      off();
      resolve(storeOwnsProduct(store, platform));
    }, timeoutMs);
  });
}

function storeOwnsProduct(
  store: PurchaseModule['store'],
  platform: NativeStoreState['platform'],
): boolean {
  return (
    store.owned({ id: FULL_ADVENTURE_PRODUCT_ID, platform }) ||
    store.owned(FULL_ADVENTURE_PRODUCT_ID)
  );
}

function transactionContainsProduct(transaction: Transaction): boolean {
  return transaction.products.some(
    (product) => product.id === FULL_ADVENTURE_PRODUCT_ID,
  );
}

function receiptContainsProduct(receipt: Receipt): boolean {
  return receipt.transactions.some(transactionContainsProduct);
}

function verifiedReceiptContainsProduct(receipt: VerifiedReceipt): boolean {
  return receipt.collection.some(
    (purchase) => purchase.id === FULL_ADVENTURE_PRODUCT_ID,
  );
}

function productInfoFromNativeProduct(
  module: PurchaseModule,
  platform: NativeStoreState['platform'],
  product?: Product,
): PremiumPurchaseInfo {
  return {
    productId: FULL_ADVENTURE_PRODUCT_ID,
    platform: platform === module.Platform.GOOGLE_PLAY ? 'android' : 'ios',
    nativeAvailable: true,
    storeReady: !!product,
    canPurchase: !!product?.canPurchase,
    title: product?.title || 'Full Adventure',
    description:
      product?.description ||
      'Unlock every premium chapter, unlimited hints, and exclusive rewards.',
    priceLabel: product?.pricing?.price || 'App Store purchase',
  };
}

function localProductInfo(): PremiumPurchaseInfo {
  return {
    productId: FULL_ADVENTURE_PRODUCT_ID,
    platform: 'web',
    nativeAvailable: false,
    storeReady: true,
    canPurchase: true,
    title: 'Full Adventure',
    description:
      'Unlock every premium chapter, unlimited hints, and exclusive rewards.',
    priceLabel: 'Unlock now',
  };
}

function resultFromStoreError(
  module: PurchaseModule,
  error: IError,
  source: PremiumPurchaseResult['source'],
): PremiumPurchaseResult {
  if (error.code === module.ErrorCode.PAYMENT_CANCELLED) {
    return {
      status: 'cancelled',
      source,
      productId: FULL_ADVENTURE_PRODUCT_ID,
      message: 'Purchase cancelled.',
    };
  }

  return {
    status: 'failed',
    source,
    productId: FULL_ADVENTURE_PRODUCT_ID,
    message: error.message || 'Purchase failed. Please try again.',
  };
}

function nativePlatformName(): PremiumPurchaseInfo['platform'] {
  return Capacitor.getPlatform() === 'android' ? 'android' : 'ios';
}

function notifyPremiumOwned() {
  for (const listener of ownedListeners) listener();
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string') return error;
  return 'Purchase is unavailable right now. Please try again.';
}
