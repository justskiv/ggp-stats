# GoGetPodcast — Analytics Dashboard

Interactive dashboard for visualizing episode statistics of the
[GoGetPodcast](https://gogetpodcast.ru) — a Russian-language podcast
about software engineering. Who talked the most, which books were
recommended, what topics sparked debate — all in charts and numbers.

**[→ Live Demo](https://justskiv.github.io/ggp-stats/)**

## Features

- **Overview** — airtime distribution across speakers (by words,
  time, utterances)
- **Speakers** — activity radar, detailed per-speaker stats
- **Topics** — discussion timeline, top topics by duration
- **Resources** — mentioned books, courses, platforms, and
  technologies
- **Fun Facts** — memorable moments, mentioned people, quick stats

## Tech Stack

- **React 18** + **Recharts** via CDN — zero build step
- **SPA** with hash routing — episode list + per-episode dashboard
- Dark theme, responsive layout

## Project Structure

```
index.html              SPA: routing, episode list, dashboard
episodes/
  index.js              Episode registry (metadata for the list)
  ep21/
    data.js             Episode #21 data
```

## Adding a New Episode

1. Create `episodes/epNN/data.js` following `episodes/ep21/data.js`
   format
2. Add an entry to `episodes/index.js`

## Local Development

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## License

MIT
