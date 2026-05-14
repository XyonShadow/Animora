# Animora -- Anime Explorer

A simple React-based anime discovery app powered by the Jikan API.  
Users can browse top anime, view details, and explore anime by different categories.

---

## Features

- Fetch top-rated anime
- Browse seasonal anime
- Search for anime titles
- View anime details (via MyAnimeList ID)
- Genre-based filtering (in progress)
- Responsive UI with loading and error states
- Reusable components for scalability

---

## Tech Stack

- React (Vite)
- JavaScript (ES6+)
- Tailwind CSS
- Lucide React Icons
- Jikan API (MyAnimeList unofficial API)

---

## API Used

- Jikan API  
https://docs.api.jikan.moe/

---

## Project Structure
src/
api/ # API layer (Jikan wrapper)
components/ # Reusable UI components
pages/ # App pages (Home, etc.)

---

## Installation

```bash
# clone repo
git clone <your-repo-url>

# install dependencies
npm install

# run project
npm run dev