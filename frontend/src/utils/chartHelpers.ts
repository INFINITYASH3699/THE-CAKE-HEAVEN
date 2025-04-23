// utils/chartHelpers.ts
export const createSafeTooltip = (
  renderFn: (payload: any) => React.ReactNode
) => {
  return ({ active, payload, label }: any) => {
    if (active && payload && payload.length && payload[0]) {
      return renderFn(payload);
    }
    return null;
  };
};
