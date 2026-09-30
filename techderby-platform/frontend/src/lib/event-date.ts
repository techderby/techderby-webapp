export const EVENT_TIME_ZONE = 'Europe/London';

const EVENT_LOCALE = 'en-GB';

function parseEventDate(value: string | Date): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function eventDateTimestamp(value: string | Date): number {
  return parseEventDate(value)?.getTime() ?? Number.NaN;
}

export function formatEventDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' },
): string {
  const date = parseEventDate(value);
  if (!date) return 'Date unavailable';

  return new Intl.DateTimeFormat(EVENT_LOCALE, {
    ...options,
    timeZone: EVENT_TIME_ZONE,
  }).format(date);
}

export function formatEventTime(value: string | Date): string {
  const date = parseEventDate(value);
  if (!date) return 'Time unavailable';

  return new Intl.DateTimeFormat(EVENT_LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: EVENT_TIME_ZONE,
  }).format(date);
}

export function formatEventDateTime(value: string | Date): string {
  const date = parseEventDate(value);
  if (!date) return 'Date and time unavailable';

  return `${formatEventDate(date, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}, ${formatEventTime(date)}`;
}

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function zonedParts(date: Date): ZonedParts {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: EVENT_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
}

function timeZoneOffsetMilliseconds(date: Date): number {
  const parts = zonedParts(date);
  const representedAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  return representedAsUtc - date.getTime();
}

/** Converts a CMS timestamp into the value expected by a datetime-local input. */
export function eventDateToInputValue(value: string | Date): string {
  const date = parseEventDate(value);
  if (!date) return '';
  const parts = zonedParts(date);
  const pad = (number: number) => String(number).padStart(2, '0');
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`;
}

/** Returns midnight for the event's calendar day in Europe/London. */
export function eventDayStartTimestamp(value: string | Date = new Date()): number {
  const inputValue = eventDateToInputValue(value);
  if (!inputValue) return Number.NaN;
  return new Date(eventInputValueToIso(`${inputValue.slice(0, 10)}T00:00`)).getTime();
}

/**
 * Treats a datetime-local value as a Tech Derby event time in Europe/London,
 * regardless of the administrator's computer timezone.
 */
export function eventInputValueToIso(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) throw new Error('Enter a valid event date and time.');

  const [, year, month, day, hour, minute] = match.map(Number);
  const desiredWallClock = Date.UTC(year, month - 1, day, hour, minute, 0);
  let utcTimestamp = desiredWallClock;

  // Re-evaluate the offset because Europe/London changes between GMT and BST.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const candidate = new Date(utcTimestamp);
    const adjusted = desiredWallClock - timeZoneOffsetMilliseconds(candidate);
    if (adjusted === utcTimestamp) break;
    utcTimestamp = adjusted;
  }

  const result = new Date(utcTimestamp);
  const roundTrip = eventDateToInputValue(result);
  if (roundTrip !== value) {
    throw new Error('This local time does not exist in Europe/London because of a daylight-saving change.');
  }

  return result.toISOString();
}
