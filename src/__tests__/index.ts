import { multiply } from '../index';

test('Тестирование функции multiply', () => {
  expect(multiply(0, 10)).toBe(0);
  expect(multiply(1, 13)).toBe(13);
  expect(multiply(4, 7)).toBe(28);
});
