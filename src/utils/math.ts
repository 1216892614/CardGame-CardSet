export const standardization = (val: number, max: number, min: number) => {
  if (val > Math.max(max, min)) return 1;

  if (val < Math.min(max, min)) return 0;

  return (val - Math.min(max, min)) / (Math.max(max, min) - Math.min(max, min));
};

export const rangeMap = (std: number, max: number, min: number) =>
  (max - min) * std + min;
