import {
  eventDateToInputValue,
  eventDayStartTimestamp,
  eventInputValueToIso,
  formatEventDate,
  formatEventDateTime,
  formatEventTime,
} from '../lib/event-date';

describe('event date formatting', () => {
  it('uses the Tech Derby Europe/London timezone during British Summer Time', () => {
    const storedDate = '2026-06-15T17:00:00.000Z';

    expect(formatEventDate(storedDate)).toBe('15 June 2026');
    expect(formatEventTime(storedDate)).toBe('18:00');
    expect(formatEventDateTime(storedDate)).toBe('Monday, 15 June 2026, 18:00');
    expect(eventDateToInputValue(storedDate)).toBe('2026-06-15T18:00');
    expect(eventInputValueToIso('2026-06-15T18:00')).toBe(storedDate);
  });

  it('uses GMT for winter event dates', () => {
    const storedDate = '2026-12-15T18:00:00.000Z';

    expect(formatEventDate(storedDate)).toBe('15 December 2026');
    expect(formatEventTime(storedDate)).toBe('18:00');
    expect(eventDateToInputValue(storedDate)).toBe('2026-12-15T18:00');
    expect(eventInputValueToIso('2026-12-15T18:00')).toBe(storedDate);
  });

  it('rejects a local time skipped by the spring daylight-saving transition', () => {
    expect(() => eventInputValueToIso('2026-03-29T01:30')).toThrow(/daylight-saving/i);
  });

  it('calculates the start of the current event day in Europe/London', () => {
    expect(eventDayStartTimestamp('2026-06-15T23:30:00.000Z')).toBe(
      new Date('2026-06-15T23:00:00.000Z').getTime(),
    );
  });

  it('returns a safe label for an invalid CMS value', () => {
    expect(formatEventDate('not-a-date')).toBe('Date unavailable');
  });
});
