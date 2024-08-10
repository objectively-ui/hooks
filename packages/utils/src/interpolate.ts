export const interpolate = (
  template: string,
  values: Record<string, string | boolean | number> = {},
): string => {
  const substitutionsRegex = /{{([^{}]*?)}}/g;

  return template.replaceAll(substitutionsRegex, (match, group1) => {
    const key = (group1 as string).trim();
    const value = values[key];

    if (!value) {
      return match;
    }

    return value.toString();
  });
};
