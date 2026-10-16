export const eventTimeZone = 'Europe/Amsterdam';

export function getEventSchedule(events, now = new Date(), weeklyEvents = []) {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: eventTimeZone,
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(now);
  const todayDate = new Date(`${today}T12:00:00Z`);
  const scheduled = [...events];

  for (const weekly of weeklyEvents) {
    if (!weekly.id || !Number.isInteger(weekly.weekday) || weekly.weekday < 0 || weekly.weekday > 6) {
      throw new Error('Weekly events must have an ID and a weekday from 0 to 6.');
    }
    const firstOffset = (weekly.weekday - todayDate.getUTCDay() + 7) % 7;
    for (let week = 0; week < 6; week += 1) {
      const occurrence = new Date(todayDate);
      occurrence.setUTCDate(occurrence.getUTCDate() + firstOffset + week * 7);
      const date = occurrence.toISOString().slice(0, 10);
      // A dated entry replaces the regular meeting for the same category and day.
      if (events.some((event) => event.type === weekly.type && event.date === date)) continue;
      scheduled.push({ ...weekly, id: `${weekly.id}-${date}`, date });
    }
  }
  const ids = new Set();

  for (const event of scheduled) {
    const date = new Date(`${event.date}T12:00:00Z`);
    if (!event.id || ids.has(event.id)) throw new Error('Events must have unique IDs.');
    ids.add(event.id);
    if (!['sermon', 'friday-class'].includes(event.type)) {
      throw new Error(`Unknown event type: ${event.id}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(event.date) || !Number.isFinite(date.getTime())
      || date.toISOString().slice(0, 10) !== event.date) {
      throw new Error(`Invalid event date: ${event.id}`);
    }
    if (event.type === 'friday-class' && date.getUTCDay() !== 5) {
      throw new Error(`Online Friday classes must fall on a Friday: ${event.id}`);
    }
    if (event.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(event.time)) {
      throw new Error(`Invalid event time: ${event.id}`);
    }
    if (event.url && !/^https?:\/\//i.test(event.url)) {
      throw new Error(`Event links must use HTTP or HTTPS: ${event.id}`);
    }
  }

  const sorted = scheduled.sort((a, b) =>
    `${a.date}T${a.time || '00:00'}`.localeCompare(`${b.date}T${b.time || '00:00'}`)
  );
  return {
    upcoming: sorted.filter((event) => event.date >= today),
    past: sorted.filter((event) => event.date < today).reverse()
  };
}
