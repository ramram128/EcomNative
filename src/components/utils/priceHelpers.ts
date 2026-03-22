// src/utils/priceHelpers.ts
import { Product, Variation } from '../../types/product';

const toNumber = (v: any): number => {
  if (v === undefined || v === null || v === '') return NaN;
  const n = Number(String(v).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : NaN;
};

const formatINR = (value: any): string => {
  const n = toNumber(value);
  if (!Number.isFinite(n)) return String(value ?? '');
  try {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);
  } catch {
    return String(Math.round(n));
  }
};

export const getPriceDetails = (product: Product) => {
  let reg = product.regular_price;
  let sale = product.sale_price || product.price;

  // LOGIC FOR VARIABLE PRODUCTS: Find the cheapest variation
  if (product.type === 'variable' && product.variations && product.variations.length > 0) {

    // Find the variation with the lowest numeric price
    const cheapestVar = product.variations.reduce((prev, curr) => {
      const prevPrice = toNumber(prev.sale_price || prev.price);
      const currPrice = toNumber(curr.sale_price || curr.price);
      return currPrice < prevPrice ? curr : prev;
    });

    reg = cheapestVar.regular_price || cheapestVar.price;
    sale = cheapestVar.sale_price || cheapestVar.price;
  }

  const regNum = toNumber(reg);
  const saleNum = toNumber(sale);

  const isDiscounted = !isNaN(regNum) && !isNaN(saleNum) && regNum > saleNum;

  const percent = isDiscounted
    ? Math.round(((regNum - saleNum) / regNum) * 100)
    : 0;

  return {
    showBoth: isDiscounted,
    discountPercent: percent,
    inrRegular: formatINR(reg),
    inrSale: formatINR(sale),
    finalPrice: formatINR(sale || reg),
    isVariable: product.type === 'variable' // Added this flag for UI use
  };
};