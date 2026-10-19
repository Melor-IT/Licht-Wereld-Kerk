export const eventTimeZone = 'Europe/Amsterdam';

const dayInMilliseconds = 24 * 60 * 60 * 1000;
const sundayCount = 4;
const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: eventTimeZone,
  calendar: 'gregory', numberingSystem: 'latn',
  year: 'numeric', month: '2-digit', day: '2-digit'
});

export function getEventDate(now = new Date()) {
  const parts = Object.fromEntries(dateFormatter.formatToParts(now).map(({ type, value }) => [type, value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function calendarDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(date.getTime())
    || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`Invalid event date: ${value}`);
  }
  return date;
}

function addDays(value, days) {
  const date = calendarDate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

// Convert the next Amsterdam midnight to an instant, including 23/25-hour days.
export function getNextEventDayDelay(now = new Date()) {
  const target = calendarDate(addDays(getEventDate(now), 1)).getTime();
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: eventTimeZone, calendar: 'gregory', numberingSystem: 'latn',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  });
  let midnight = target;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const parts = Object.fromEntries(formatter.formatToParts(midnight).map(({ type, value }) => [type, value]));
    const local = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
    const corrected = target - (local - midnight);
    if (corrected === midnight) break;
    midnight = corrected;
  }
  return midnight - now.getTime();
}

function validateRotation(rotation) {
  if (calendarDate(rotation.startDate).getUTCDay() !== 0) {
    throw new Error('The preacher rotation must start on a Sunday.');
  }
  const preachers = rotation.preachers;
  if (!Array.isArray(preachers) || preachers.length !== 3
    || new Set(preachers.map((preacher) => preacher.id)).size !== 3
    || preachers.some((preacher) => !preacher.id || !preacher.name
      || !(typeof preacher.name === 'string' ? preacher.name.trim()
        : Object.values(preacher.name).some((name) => typeof name === 'string' && name.trim())))) {
    throw new Error('Configure exactly three preachers with unique IDs and names.');
  }
  for (const [date, id] of Object.entries(rotation.overrides || {})) {
    if (calendarDate(date).getUTCDay() !== 0 || !preachers.some((preacher) => preacher.id === id)) {
      throw new Error(`Invalid preacher override: ${date}`);
    }
  }
}

function applyPreacher(event, rotation) {
  if (!rotation || event.type !== 'sermon') return event;
  // Calendar weeks, rather than elapsed Amsterdam hours, keep DST out of the rotation.
  const weeks = (calendarDate(event.date) - calendarDate(rotation.startDate)) / (7 * dayInMilliseconds);
  const index = ((weeks % 3) + 3) % 3;
  const override = rotation.overrides?.[event.date];
  const preacher = override
    ? rotation.preachers.find(({ id }) => id === override)
    : rotation.preachers[index];
  return { ...event, preacher, speaker: override ? preacher.name : event.speaker || preacher.name };
}

export function getEventSchedule(events, now = new Date(), weeklyEvents = [], rotation = null) {
  const today = getEventDate(now);
  const firstSunday = addDays(today, (7 - calendarDate(today).getUTCDay()) % 7);
  const lastSunday = addDays(firstSunday, (sundayCount - 1) * 7);
  if (rotation) validateRotation(rotation);
  const scheduled = [...events];
  const weeklyTypes = new Set();

  for (const weekly of weeklyEvents) {
    if (!weekly.id || !Number.isInteger(weekly.weekday) || weekly.weekday < 0 || weekly.weekday > 6
      || weeklyTypes.has(weekly.type) || (weekly.type === 'sermon' && weekly.weekday !== 0)) {
      throw new Error('Weekly events must have unique categories, an ID and a valid weekday; sermons must be on Sunday.');
    }
    weeklyTypes.add(weekly.type);
    const firstOffset = (weekly.weekday - calendarDate(today).getUTCDay() + 7) % 7;
    const count = weekly.type === 'sermon' ? sundayCount : 6;
    for (let week = 0; week < count; week += 1) {
      const date = addDays(today, firstOffset + week * 7);
      // A dated entry replaces the regular meeting for the same category and day.
      if (events.some((event) => event.type === weekly.type && event.date === date)) continue;
      scheduled.push({ ...weekly, id: `${weekly.id}-${date}`, date });
    }
  }
  const ids = new Set();
  const dates = new Set();

  for (const event of scheduled) {
    const date = calendarDate(event.date);
    if (!event.id || ids.has(event.id)) throw new Error('Events must have unique IDs.');
    ids.add(event.id);
    if (!['sermon', 'friday-class'].includes(event.type)) {
      throw new Error(`Unknown event type: ${event.id}`);
    }
    const key = `${event.type}-${event.date}`;
    if (dates.has(key)) throw new Error(`Duplicate event category and date: ${event.id}`);
    dates.add(key);
    if ((event.type === 'friday-class' && date.getUTCDay() !== 5)
      || (event.type === 'sermon' && date.getUTCDay() !== 0)) {
      throw new Error(`Event must fall on its category's weekday: ${event.id}`);
    }
    if (event.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(event.time)) {
      throw new Error(`Invalid event time: ${event.id}`);
    }
    if (event.url && !/^https?:\/\//i.test(event.url)) {
      throw new Error(`Event links must use HTTP or HTTPS: ${event.id}`);
    }
  }

  const sorted = scheduled.map((event) => applyPreacher(event, rotation)).sort((a, b) =>
    `${a.date}T${a.time || '00:00'}`.localeCompare(`${b.date}T${b.time || '00:00'}`)
  );
  return {
    upcoming: sorted.filter((event) => event.date >= today
      && (event.type !== 'sermon' || event.date <= lastSunday)),
    past: sorted.filter((event) => event.date < today).reverse()
  };
}
