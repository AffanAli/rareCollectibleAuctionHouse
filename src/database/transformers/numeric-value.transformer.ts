import { ValueTransformer } from 'typeorm';

/**
 * Maps PostgreSQL numeric/decimal to number in the application layer.
 */
export const numericValueTransformer: ValueTransformer = {
  to: (value?: number | null): string | null => {
    if (value === null || value === undefined) {
      return null;
    }

    return value.toFixed(2);
  },

  from: (value?: string | null): number | null => {
    if (value === null || value === undefined) {
      return null;
    }

    return parseFloat(value);
  },
};
