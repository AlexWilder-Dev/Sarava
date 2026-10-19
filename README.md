# Sarava · demo site

A speculative website for **Sarava Creperie Bar & Cafe**, Unit 41–42, Second Avenue, Brixton Village, London SW9 8PS. Made as a pitch for the owners.

Live demo: https://alexwilder-dev.github.io/Sarava/

## What's in it

- **Café ⇄ bar.** The site follows London time. From 16:00, when happy hour starts, it switches from the white-washed café look to the black-glass bar look. The sun in Sarava's logo sinks into its ripples as it changes. Tap the sun to flip it by hand.
- **Crêpe ⇄ galette.** On the menu, a pancake flips between white flour and buckwheat. Filters use only Sarava's own (v)/(vg) marks, and picking vegan with the crêpe selected nudges you onto buckwheat.
- **Find us in the Village.** An animated route from Coldharbour Lane through the Courtyard and up Second Avenue to 41–42, drawn from the official Brixton Village map.
- **Live status.** Open/closed and happy hour are worked out in the London time zone.
- **Booking.** A table form mirrors the fields on their Zideli booking page (max 6, booking types, 15-minute hold), with a party and private-hire enquiry for bigger groups. Forms are front end only and show a confirmation state.

## Data

Menu, hours, contact details, happy hour, booking options and links are all in `src/data/sarava.ts`. The research trail is in `research/notes.md`.

- Menu prices are from Sarava's Deliveroo menu; no dine-in menu was published.
- Hours are from the Google listing (October 2026).

## Develop

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check and build to dist/
npm run images    # one-off: resize research/photos into public/photos
npm run og        # one-off: build public/og.jpg and the favicons with sharp
```

Stack: Vite, React, TypeScript, Framer Motion, React Router (HashRouter). Deployed to GitHub Pages by `.github/workflows/deploy.yml` under `/Sarava/`; assets use relative paths (`base: './'`).

## Credits

The Sarava name, logo and photos belong to Sarava. Room and food photography is by Loic Salan for Brixton Village. The shopfront and salmon galette photos come from Sarava's own booking and delivery pages.

Site by AlexWilder-Dev.
