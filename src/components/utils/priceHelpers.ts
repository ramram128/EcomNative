// src/utils/priceHelpers.ts
import { Product } from '../../types/product';

const toNumber = (v: any) => {
  if (v === undefined || v === null) return NaN;
  const n = Number(String(v).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : NaN;
};

const formatINR = (value: any) => {
  const n = toNumber(value);
  if (!Number.isFinite(n)) return String(value ?? '');
  try {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);
  } catch {
    return String(Math.round(n));
  }
};

export const getPriceDetails = (product: Product) => {
  const hasVariation = !!product.attributes?.some((attr: any) => attr.variation);
  const firstVar = (product.type === 'variable' && hasVariation) ? product.variations?.[0] : undefined;

  const sale = firstVar?.sale_price || product.price;
  const reg = firstVar?.regular_price || product.regular_price;

  const saleNum = toNumber(sale);
  const regNum = toNumber(reg);

  const isDiscounted = !!reg && !!sale && regNum > saleNum;
  const percent = isDiscounted ? Math.round(((regNum - saleNum) / regNum) * 100) : 0;

  return {
    showBoth: isDiscounted,
    discountPercent: percent,
    inrRegular: formatINR(reg),
    inrSale: formatINR(sale),
    finalPrice: formatINR(sale || reg)
  };
};