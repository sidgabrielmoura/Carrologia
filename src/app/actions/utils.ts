export function formatMoney(value: number | string) {
  if (value === null || value === undefined) return "R$ 0,00";

  let cleaned = String(value).replace(/[R$\s]/g, "").replace(/\./g, "").replace(",", ".");

  const numberValue = Number(cleaned);

  if (isNaN(numberValue)) return "R$ 0,00";

  return numberValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
