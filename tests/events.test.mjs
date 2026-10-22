import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { getEventDate, getEventSchedule, getNextEventDayDelay } from '../src/lib/events.js';

const readData = (name) =>
  JSON.parse(readFileSync(new URL(`../src/data/${name}.json`, import.meta.url), 'utf8'));
const events = readData('events');
const weeklyEvents = readData('weekly-events');
const rotation = readData('preacher-rotation');
const schedule = (instant, config = rotation, dated = events) =>
  getEventSchedule(dated, new Date(instant), weeklyEvents, config);
const sundays = (result) => result.upcoming.filter(({ type }) => type === 'sermon');

test('exactly four Sundays for every weekday, including the whole of Sunday', () => {
  for (let day = 19; day <= 25; day += 1) {
    const entries = sundays(schedule(`2026-10-${day}T12:00:00Z`));
    assert.equal(entries.length, 4);
    assert.deepEqual(
      entries.map(({ date }) => date),
      ['2026-10-25', '2026-11-01', '2026-11-08', '2026-11-15']
    );
  }
});

for (const [name, before, after, removed, added] of [
  ['summer Monday', '2026-10-18T21:59:59.999Z', '2026-10-18T22:00:00Z', '2026-10-18', '2026-11-15'],
  [
    'winter Monday after DST ends',
    '2026-10-25T22:59:59.999Z',
    '2026-10-25T23:00:00Z',
    '2026-10-25',
    '2026-11-22'
  ],
  [
    'summer Monday after DST starts',
    '2026-03-29T21:59:59.999Z',
    '2026-03-29T22:00:00Z',
    '2026-03-29',
    '2026-04-26'
  ]
]) {
  test(`rolls only at Amsterdam midnight: ${name}`, () => {
    const oldEntries = sundays(schedule(before));
    const newEntries = sundays(schedule(after));
    assert.equal(oldEntries.length, 4);
    assert.equal(newEntries.length, 4);
    assert.equal(oldEntries[0].date, removed);
    assert.equal(newEntries.at(-1).date, added);
    assert.deepEqual(newEntries.slice(0, 3), oldEntries.slice(1));
  });
}

test('midnight timer accounts for 23-hour and 25-hour Amsterdam days', () => {
  for (const [start, hours, end] of [
    ['2026-03-28T23:00:00Z', 23, '2026-03-29T22:00:00Z'],
    ['2026-10-24T22:00:00Z', 25, '2026-10-25T23:00:00Z'],
    ['2026-07-10T22:00:00Z', 24, '2026-07-11T22:00:00Z'],
    ['2026-12-31T23:00:00Z', 24, '2027-01-01T23:00:00Z']
  ]) {
    const now = new Date(start);
    const delay = getNextEventDayDelay(now);
    assert.equal(delay, hours * 60 * 60 * 1000);
    assert.equal(new Date(+now + delay).toISOString(), new Date(end).toISOString());
    assert.notEqual(getEventDate(new Date(+now + delay)), getEventDate(now));
    assert.equal(getEventDate(new Date(+now + delay - 1)), getEventDate(now));
  }
  assert.equal(getNextEventDayDelay(new Date('2026-10-25T22:59:59.999Z')), 1);
});

test('rotation starts Hamid, Kazem, Shahram and repeats from its fixed anchor', () => {
  assert.deepEqual(
    sundays(schedule('2026-10-18T12:00:00Z')).map(({ preacher }) => preacher.id),
    ['hamid', 'kazem', 'shahram', 'hamid']
  );
  assert.deepEqual(
    sundays(schedule('2026-10-26T12:00:00Z')).map(({ preacher }) => preacher.id),
    ['shahram', 'hamid', 'kazem', 'shahram']
  );
  const anchor = Date.parse(`${rotation.startDate}T12:00:00Z`);
  for (let week = -80; week <= 80; week += 1) {
    const entry = sundays(schedule(new Date(anchor + week * 7 * 86400000)))[0];
    assert.equal(entry.preacher.id, rotation.preachers[((week % 3) + 3) % 3].id);
  }
});

test('override affects only its date, survives JSON reload, and deletion restores the previous speaker', () => {
  const original = sundays(schedule('2026-10-18T12:00:00Z'));
  const config = structuredClone(rotation);
  config.overrides['2026-10-25'] = 'shahram';
  const reloaded = JSON.parse(JSON.stringify(config));
  const overridden = sundays(schedule('2026-10-18T12:00:00Z', reloaded));
  assert.equal(overridden[1].speaker.fa, 'برادر شهرام');
  assert.deepEqual(overridden[0], original[0]);
  assert.deepEqual(overridden.slice(2), original.slice(2));
  delete reloaded.overrides['2026-10-25'];
  assert.deepEqual(sundays(schedule('2026-10-18T12:00:00Z', reloaded)), original);
});

test('preacher names and metadata have a single editable source', () => {
  const config = structuredClone(rotation);
  config.preachers[0].name.fa = 'نام ویرایش‌شده';
  config.preachers[0].bio = { fa: 'اطلاعات واعظ' };
  const entries = sundays(schedule('2026-10-18T12:00:00Z', config));
  assert.equal(entries[0].speaker.fa, 'نام ویرایش‌شده');
  assert.equal(entries[3].speaker.fa, 'نام ویرایش‌شده');
  assert.deepEqual(entries[0].preacher.bio, { fa: 'اطلاعات واعظ' });
});

test('Sister Sima is a one-date guest and removing her override restores Kazem', () => {
  const entries = sundays(schedule('2026-10-19T12:00:00Z'));
  assert.equal(entries[0].date, '2026-10-25');
  assert.deepEqual(entries[0].speaker, { fa: 'خواهر سیما', nl: 'Zuster Sima', en: 'Sister Sima' });
  assert.equal(entries[0].title.nl, 'Kerkdienst met zuster Sima');
  assert.deepEqual(
    entries.slice(1).map(({ speaker }) => speaker.en),
    ['Brother Shahram', 'Brother Hamid', 'Brother Kazem']
  );
  const dated = structuredClone(events);
  delete dated.find(({ date }) => date === '2026-10-25').speaker;
  const restored = sundays(schedule('2026-10-19T12:00:00Z', rotation, dated));
  assert.equal(restored[0].speaker.en, 'Brother Kazem');
  assert.deepEqual(restored.slice(1), entries.slice(1));
});

test('preserves all dated content, archived poster and Friday programme', () => {
  const current = schedule('2026-10-18T12:00:00Z');
  for (const event of events) {
    const actual = current.upcoming.find(({ id }) => id === event.id);
    for (const [key, value] of Object.entries(event)) assert.deepEqual(actual[key], value);
  }
  assert.equal(sundays(current)[0].speaker.en, 'Brother Hamid');
  assert.equal(sundays(current)[1].speaker.en, 'Sister Sima');
  assert.equal(schedule('2026-10-19T12:00:00Z').past[0].poster, '/images/Kerkbijeenkomst.png');
  const fridays = current.upcoming.filter(({ type }) => type === 'friday-class');
  assert.equal(fridays.length, 6);
  assert.ok(
    fridays.every(
      ({ date, time, speaker }) =>
        new Date(`${date}T12:00:00Z`).getUTCDay() === 5 && time === '20:00' && !speaker
    )
  );
});

test('dated Sundays outside the window cannot add a fifth card and reappear when due', () => {
  const extra = { ...events[0], id: 'future-service', date: '2026-12-06' };
  const dated = [...events, extra];
  assert.equal(sundays(schedule('2026-10-18T12:00:00Z', rotation, dated)).length, 4);
  assert.ok(
    !sundays(schedule('2026-10-18T12:00:00Z', rotation, dated)).some(({ id }) => id === extra.id)
  );
  assert.ok(
    sundays(schedule('2026-11-09T12:00:00Z', rotation, dated)).some(({ id }) => id === extra.id)
  );
});

test('year and leap-day boundaries still contain exactly four Sundays', () => {
  for (const instant of ['2026-12-31T23:00:00Z', '2028-02-28T23:00:00Z']) {
    const entries = sundays(schedule(instant));
    assert.equal(entries.length, 4);
    assert.equal(new Set(entries.map(({ date }) => date)).size, 4);
    assert.ok(entries.every(({ date }) => new Date(`${date}T12:00:00Z`).getUTCDay() === 0));
  }
});

test('rejects invalid anchor, roster, override, dates and duplicate Sundays', () => {
  for (const alter of [
    (config) => {
      config.startDate = '2026-10-19';
    },
    (config) => {
      config.preachers.pop();
    },
    (config) => {
      config.preachers[1].id = config.preachers[0].id;
    },
    (config) => {
      config.overrides['2026-10-25'] = 'unknown';
    },
    (config) => {
      config.overrides['2026-10-26'] = 'hamid';
    },
    (config) => {
      config.overrides['2026-02-30'] = 'hamid';
    }
  ]) {
    const config = structuredClone(rotation);
    alter(config);
    assert.throws(() => schedule('2026-10-18T12:00:00Z', config));
  }
  for (const event of [
    { ...events[0], id: 'duplicate' },
    { ...events[0], id: 'wrong-weekday', date: '2026-10-19' },
    { ...events[0], id: 'invalid-date', date: '2026-02-30' }
  ]) {
    assert.throws(() => schedule('2026-10-18T12:00:00Z', rotation, [...events, event]));
  }
});

test('schedule generation never changes the persisted configuration or event data', () => {
  const before = JSON.stringify({ events, weeklyEvents, rotation });
  schedule('2026-10-18T12:00:00Z');
  schedule('2030-01-01T12:00:00Z');
  assert.equal(JSON.stringify({ events, weeklyEvents, rotation }), before);
});
