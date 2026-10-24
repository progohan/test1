export const formatProjectValue = (valueMillions: number | null | undefined) => {
  if (!valueMillions) return 'N/A';
  if (valueMillions >= 1000) return `$${(valueMillions / 1000).toFixed(1).replace(/\.0$/, '')}B`;
  return `$${Math.round(valueMillions)}M`;
};
