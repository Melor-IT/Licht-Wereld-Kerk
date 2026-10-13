import archivedSermons from '../data/sermons.json';
import { sermonPlaylistId } from './sermon-source';

// Keep this recording hidden even when it remains in the YouTube playlist.
const excludedVideoIds = new Set(['UpaxJ4YOg-M']);

function decodeXml(value) {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(
    /&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi,
    (entity, code) => {
      const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
      if (!code.startsWith('#')) return named[code.toLowerCase()] || entity;
      const number = code[1].toLowerCase() === 'x'
        ? parseInt(code.slice(2), 16)
        : parseInt(code.slice(1), 10);
      return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : entity;
    }
  ).trim();
}

// YouTube's playlist Atom feed supplies up to 15 public videos without an API key.
export function parseSermonFeed(xml) {
  return [...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/g)].flatMap(([, entry]) => {
    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title = decodeXml(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '');
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1];
    if (!/^[\w-]{11}$/.test(id || '') || !title || !published || Number.isNaN(Date.parse(published))) {
      return [];
    }
    return [{ id, title, published }];
  });
}

export async function getSermons() {
  try {
    const response = await fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=${sermonPlaylistId}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) throw new Error('YouTube feed unavailable');
    const recent = parseSermonFeed(await response.text());
    if (!recent.length) throw new Error('YouTube feed empty');
    const unique = new Map(recent
      .filter((sermon) => !excludedVideoIds.has(sermon.id))
      .map((sermon) => [sermon.id, sermon]));
    return {
      sermons: [...unique.values()].sort((a, b) => Date.parse(b.published) - Date.parse(a.published)),
      unavailable: false
    };
  } catch {
    return {
      sermons: archivedSermons.filter((sermon) => !excludedVideoIds.has(sermon.id)),
      unavailable: true
    };
  }
}
