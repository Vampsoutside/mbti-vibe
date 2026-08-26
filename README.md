# MBTI Vibe

Personalized **movie** and **song** recommendations based on your MBTI personality type.

**Live demo:** https://vampsoutside.github.io/mbti-vibe/

## Features

- 16-question personality quiz
- One-tap picker for all 16 MBTI types
- Type profile summary + deep dive (strengths, careers, relationships)
- Movie recommendations via [OMDb API](https://www.omdbapi.com/) with like/dislike personalization
- Soundtrack suggestions with Spotify links, refresh/shuffle, and volume control
- Dark premium UI, fully responsive, single-file vanilla HTML/JS + Tailwind CDN

## How to use

1. Open the live site (or open `index.html` locally).
2. Take the quiz **or** choose your type from the 16 cards.
3. Browse movies and tracks tuned to your type.
4. Like / hide movies to refine future picks (saved in your browser).

## Local run

No build step required:

```bash
# optional static server
python3 -m http.server 8080
# open http://localhost:8080
```

## Tech

- Vanilla JavaScript (single `index.html`)
- Tailwind CSS (CDN)
- OMDb for movie metadata
- Spotify open/search links for tracks
- localStorage for preferences

## Disclaimer

For entertainment only. Not affiliated with Myers-Briggs / MBTI or Spotify. Movie data provided by OMDb API.

## License

MIT
