import { isUuid } from '@/utils/uuid';

describe('isUuid', () => {
  it.each(['fa3b71ab-6b6b-5067-a9df-2f9d4a25cf98', 'FA3B71AB-6B6B-5067-A9DF-2F9D4A25CF98'])(
    'aceita o identificador %p',
    (value) => {
      expect(isUuid(value)).toBe(true);
    },
  );

  it.each([
    '',
    '1',
    '.',
    '..',
    '../count',
    'fa3b71ab6b6b5067a9df2f9d4a25cf98',
    'fa3b71ab-6b6b-5067-a9df-2f9d4a25cf9',
    'fa3b71ab-6b6b-5067-a9df-2f9d4a25cf98a',
    'ga3b71ab-6b6b-5067-a9df-2f9d4a25cf98',
    ' fa3b71ab-6b6b-5067-a9df-2f9d4a25cf98',
    'fa3b71ab-6b6b-5067-a9df-2f9d4a25cf98/delete',
    'fa3b71ab-6b6b-5067-a9df-2f9d4a25cf98\n',
  ])('rejeita %p', (value) => {
    expect(isUuid(value)).toBe(false);
  });
});
