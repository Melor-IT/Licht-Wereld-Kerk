'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import { FaPlay, FaSearch, FaYoutube } from 'react-icons/fa';
import BackgroundImage from './BackgroundImage';
import { sermonPlaylistId, sermonPlaylistUrl } from '../lib/sermon-source';
import '../components-CSS/SermonsPage.css';

const pageSize = 6;

function normalize(value) {
  return value.normalize('NFKC').toLocaleLowerCase().replace(/ي/g, 'ی').replace(/ك/g, 'ک')
    .replace(/[\u064B-\u065F\u0670]/g, '').replace(/\u200c/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function SermonsPage({ sermons, unavailable }) {
  const { formatMessage, formatDate, formatNumber, locale } = useIntl();
  const t = (id, values) => formatMessage({ id }, values);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(sermons[0]?.id);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);
  const resultsRef = useRef(null);
  const selected = sermons.find((sermon) => sermon.id === selectedId) || sermons[0];
  const filtered = sermons.filter((sermon) => normalize(`${sermon.title} ${sermon.speaker || ''}`).includes(normalize(query)));
  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentPage = Math.min(page, Math.max(1, totalPages));
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const publishedDate = (date) => formatDate(date, {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Europe/Amsterdam'
  });

  function selectSermon(sermon) {
    setSelectedId(sermon.id);
    setPlaying(true);
    playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    playerRef.current?.focus({ preventScroll: true });
  }

  function changePage(nextPage) {
    setPage(nextPage);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    resultsRef.current?.focus({ preventScroll: true });
  }

  return (
    <div className="page sermons-page">
      <section className="sermons-hero" aria-labelledby="sermons-title">
        <BackgroundImage url="/images/home-banner.jpeg" />
        <div className="page-content">
          <p className="sermons-eyebrow">{t('sermonsEyebrow')}</p>
          <h1 id="sermons-title">{t('sermons')}</h1>
          <p className="sermons-intro">{t('sermonsIntro')}</p>
          <a className="sermons-hero-link" href="#sermon-library">{t('sermonsBrowse')}</a>
        </div>
      </section>

      <section className="sermons-library" id="sermon-library" aria-labelledby="sermons-library-title">
        <div className="page-content">
          <div className="sermons-section-heading">
            <div>
              <p className="sermons-eyebrow">{t('sermonsChurch')}</p>
              <h2 id="sermons-library-title">{t('sermonsLibrary')}</h2>
            </div>
            <a className="sermons-channel-link" href={sermonPlaylistUrl} target="_blank" rel="noopener noreferrer">
              <FaYoutube aria-hidden="true" /> {t('sermonsAllVideos')}
            </a>
          </div>

          {unavailable && <p className="sermons-notice" role="status">{t('sermonsFeedUnavailable')}</p>}

          {selected && (
            <div className="sermons-featured" ref={playerRef} tabIndex={-1} aria-label={t('sermonsPlayer')}>
              <div className="sermons-player">
                {playing ? (
                  <iframe
                    key={selected.id}
                    src={`https://www.youtube-nocookie.com/embed/${selected.id}?autoplay=1&rel=0&hl=${locale}`}
                    title={selected.title}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <button type="button" className="sermons-player-cover" onClick={() => setPlaying(true)} aria-label={t('sermonsPlayTitle', { title: selected.title })}>
                    <Image src={`https://i.ytimg.com/vi/${selected.id}/hqdefault.jpg`} alt="" fill unoptimized sizes="(max-width: 800px) 100vw, 700px" />
                    <span className="sermons-play-icon"><FaPlay aria-hidden="true" /></span>
                    <span className="sermons-player-caption">{t('sermonsPlay')}</span>
                  </button>
                )}
              </div>
              <div className="sermons-featured-info">
                <span className="sermons-tag">{t(selected.id === sermons[0]?.id ? 'sermonsLatest' : 'sermonsNowPlaying')}</span>
                <h3 dir="auto">{selected.title}</h3>
                <p className="sermons-date"><time dateTime={selected.published}>{publishedDate(selected.published)}</time></p>
                <p>{t('sermonsWatchIntro')}</p>
                <a className="sermons-text-link" href={`https://www.youtube.com/watch?v=${selected.id}&list=${sermonPlaylistId}`} target="_blank" rel="noopener noreferrer">
                  <FaYoutube aria-hidden="true" /> {t('sermonsWatchOnYoutube')}
                </a>
              </div>
            </div>
          )}

          <div className="sermons-results" ref={resultsRef} tabIndex={-1}>
            <form className="sermons-search" role="search" onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="sermon-search">{t('sermonsSearchLabel')}</label>
              <div className="sermons-search-field">
                <FaSearch aria-hidden="true" />
                <input id="sermon-search" type="search" placeholder={t('sermonsSearchPlaceholder')} value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} />
              </div>
            </form>
            <p className="sermons-result-count" role="status" aria-live="polite">{t('sermonsResultCount', { count: filtered.length })}</p>

            {visible.length ? (
              <div className="sermons-grid">
                {visible.map((sermon) => (
                  <article className={`sermon-card${sermon.id === selected.id ? ' is-selected' : ''}`} key={sermon.id}>
                    <button type="button" className="sermon-card-button" onClick={() => selectSermon(sermon)} aria-label={t('sermonsPlayTitle', { title: sermon.title })} aria-pressed={sermon.id === selected.id}>
                      <span className="sermon-card-image">
                        <Image src={`https://i.ytimg.com/vi/${sermon.id}/hqdefault.jpg`} alt="" fill unoptimized sizes="(max-width: 600px) 100vw, (max-width: 950px) 50vw, 350px" />
                        <span className="sermons-play-icon"><FaPlay aria-hidden="true" /></span>
                      </span>
                      <span className="sermon-card-content">
                        <time dateTime={sermon.published}>{publishedDate(sermon.published)}</time>
                        <span className="sermon-card-title" dir="auto">{sermon.title}</span>
                        <span className="sermon-card-action">{t('sermonsPlay')} <FaPlay aria-hidden="true" /></span>
                      </span>
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="sermons-empty">
                <h3>{t('sermonsNoResults')}</h3>
                <p>{t('sermonsNoResultsHint')}</p>
                {query && <button type="button" onClick={() => { setQuery(''); setPage(1); }}>{t('sermonsClearSearch')}</button>}
              </div>
            )}

            {totalPages > 1 && (
              <nav className="sermons-pagination" aria-label={t('sermonsPagination')}>
                <button type="button" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>{t('sermonsPrevious')}</button>
                <span aria-live="polite">{t('sermonsPageNumber', { current: formatNumber(currentPage), total: formatNumber(totalPages) })}</span>
                <button type="button" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>{t('sermonsNext')}</button>
              </nav>
            )}
          </div>

          <div className="sermons-archive-note">
            <FaYoutube aria-hidden="true" />
            <p>{t('sermonsArchiveNote')} <a href={sermonPlaylistUrl} target="_blank" rel="noopener noreferrer">{t('sermonsAllVideos')}</a></p>
          </div>
        </div>
      </section>
    </div>
  );
}
