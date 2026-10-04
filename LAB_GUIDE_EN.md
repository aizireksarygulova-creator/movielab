# Week 04 — Vue and the TMDB API

Build a Vue movie page with real TMDB data, then publish the built page on GitHub Pages.
Each visitor supplies their own API Key (v3). No personal credential is included in the source,
static build or lecture. Keys remain in tab memory until reload or Clear / change key.

## 1. Create your TMDB account

Open https://www.themoviedb.org/signup in a desktop browser and create your own account.
Follow the email verification instructions, then sign in. Check spam or the resend
option if needed. Never share your password or verification link.
Account registration and API registration are separate steps. Download and run the
project next; you do not need an issued API key to start.

## 2. Download and run the starter

Click **Download starter project** on slide 5, or choose Starter project in Files (M).
The ZIP is stored inside this lecture HTML.

1. Save Movie_Lab_Starter.zip and extract it: Extract All on Windows, double-click on macOS.
2. Open the extracted **movie-lab** folder in your editor, such as VS Code.
3. Confirm that package.json and package-lock.json are directly inside the opened folder.
   Some extraction tools add an outer folder; open the inner movie-lab folder if necessary.
4. Open Terminal → New Terminal in the editor. Run all commands in this project folder.

Install Node.js 24 LTS, 24.12 or newer within 24.x, from https://nodejs.org/en/download
if it is not already available. The pinned lab also supports Node 22.18+ within 22.x.
npm is included. Reopen the terminal after installation and check:

```sh
node --version
npm --version
```

On Windows, if npm.ps1 is blocked, use Command Prompt or npm.cmd. Then run:

```sh
npm ci
npm run dev
```

npm ci installs the dependencies declared in the included lock file. The project is
already configured; no Vue project generator or separate assets download is required.
Open the Local URL printed by Vite and keep the terminal running while editing.
Expected result: Movie Lab and an API key input. The starter does not request movies yet.
Keep this same extracted project for every later checkpoint. Ctrl+C stops the server.

## 3. Request your API Key (v3)

Return to the signed-in TMDB account in your desktop browser.

1. Open account **Settings → API**, or https://www.themoviedb.org/settings/api.
2. Follow the API key request/registration option. Choose the Developer route if offered
   for your non-commercial classroom use. Read the terms and proceed if you agree.
3. Complete the actual application form. Field names and options can vary by account.
   The following entries are examples for this project:

| Field / topic | Example or instruction |
| --- | --- |
| Application name | Movie Lab — Web Service Design |
| Application type | Website / web application, if offered |
| Application URL | Your actual local or deployed app URL |
| Summary | A non-commercial Vue classroom project that displays popular movies and lets students search movie titles. |
| Contact details | Complete the requested fields accurately and privately |

If a local URL is accepted, use the actual address printed by Vite. If a public URL is
required, publish the supplied connection screen using section 6 below, then return to
TMDB with your real Pages URL. Do not invent a website or another person’s details.

4. Submit the application and follow any review/activation instructions shown by TMDB.
   Issuance timing is controlled by TMDB; the lesson does not guarantee immediate approval.
5. Return to API settings when credentials are available. Copy **API Key (v3)**.
6. The separate **API Read Access Token** uses Bearer authentication. This workshop’s input
   expects the v3 API key because api.js sends the `api_key` query parameter.

Official starting point: https://developer.themoviedb.org/docs/getting-started
Authentication: https://developer.themoviedb.org/docs/authentication-application

The starter already contains src/api.js, MovieCard.vue, the TMDB logo, styles,
public/.nojekyll and all three checkpoints. Keep package.json and package-lock.json.
The Completed project ZIP is a reference with all features enabled. Workshop assets
are optional for a separately created project and are not needed for this workshop path.

## 4. Build the API page in checkpoints

### Checkpoint 01 — key form

The downloaded starter already uses checkpoints/01-key-form/App.vue. No copy is needed.
To revisit this stage later, copy that whole file over src/App.vue.
Inspect ref, v-model, type=password and @submit.prevent. The form clears the visible input
after accepting the key into memory. This stage does **not** contact TMDB.
Do not paste the actual key into any .vue or .js file.

### Checkpoint 02 — popular movies

Copy checkpoints/02-popular/App.vue over src/App.vue.
Paste your issued API Key (v3) into the page and choose Connect.
Expected result with a valid key and internet: real movie cards and posters.
Names, ratings, ordering and result counts change over time.

Read the request path in src/api.js:

```js
const params = new URLSearchParams({
  api_key: apiKey.trim(),
  language: 'en-US',
  page: String(page),
})
```

The request uses `https://api.themoviedb.org/3/movie/popular`. fetchMovies checks
response.ok, parses JSON and returns a response whose results field is the movie array.
App.vue puts that array into movies.value. The template renders MovieCard with v-for and movie.id.

MovieCard uses title, release_date, overview, vote_average, vote_count and poster_path.
The poster URL combines `https://image.tmdb.org/t/p/w500` with poster_path. Missing or failed
images show a fallback; missing dates and descriptions also have fallbacks.

### Checkpoint 03 — search and pagination

Copy checkpoints/03-search/App.vue over src/App.vue.
Search sends a request when Enter or Search is pressed, not on every keystroke.
A non-empty query selects `/search/movie`; an empty query returns to `/movie/popular`.
The helper sends query and include_adult=false for search.

A new search resets to page 1. Next/Previous reuse the **submitted** query, even if you
have edited the input without submitting. The interface caps navigation at page 500.
Loading, error and successful empty results have different displays.

The complete loader cancels previous requests, ignores stale responses, and times out
after 15 seconds. Clear / change key aborts the request and removes the key and results.
No key is stored in localStorage, sessionStorage, cookies, environment files or URLs belonging
to the hosted Movie Lab page. TMDB API requests themselves contain api_key, as required
by the chosen authentication method.

## 5. Check behavior

1. Connect using your issued API Key (v3). Real popular movies should appear.
2. Submit a movie title. Inspect the returned cards and page controls.
3. Submit an unlikely title. A successful response may show No movies found.
4. Return to Popular movies and use Next / Previous.
5. Clear / change key. Results should clear and the key form should return.
6. Reload the page. The key must be absent, requiring entry again.
7. Try at 390px width. The key input, search form and cards should fit without horizontal scrolling.
8. Inspect the Network panel for status and response.results, but hide/redact api_key before
   sharing a screenshot. Do not copy real authenticated request URLs into a class chat.

## 6. Build and publish

This app is a static frontend that requests live data from TMDB. GitHub Pages hosts the
built files; it does not execute an application server. Every visitor supplies their own key.

Set the repository base inside your existing vite.config.js:

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/movie-lab/',
})
```

The supplied projects already use this configuration. A different repository name needs
a matching base and a fresh build. A user site/custom domain uses `/`.

```sh
npm run build
npm run preview
```

Use the URL printed by preview. Preview reads dist and does not rebuild your changes.
Test the connection screen, then connect with your own key. No key is baked into dist.
Do not test an ES-module build by double-clicking dist/index.html.

To publish without a build workflow:

1. Create a new **public** GitHub repository named movie-lab in your own account.
   Add README so main exists. Do not overwrite an existing project.
2. Choose Add file → Upload files. Upload **index.html**, **assets/** and **.nojekyll**
   from INSIDE dist. index.html must be at the repository root, not inside an extra dist folder.
3. If .nojekyll is hidden, create an empty file of that name with GitHub’s Create new file action.
4. Settings → Pages → Deploy from a branch → main → / (root) → Save.
5. Wait for successful deployment and open the actual URL shown by Pages.
   Example shape: https://YOUR-USERNAME.github.io/movie-lab/.
6. Each visitor enters their own key after opening the site. Keep editable source separately.

The included Movie_Lab_Static_Build.zip is a completed **key-free** build. Extract it
before upload. It can be deployed before key issuance to provide an actual application URL.
A local source edit requires a new build and upload before the public page changes.

## 7. Understand frontend credentials

The runtime input keeps personal keys out of shared source and build artifacts. A user
can still inspect their own browser requests and see the key they entered.
Do not replace this input with a class-wide key in code or a VITE_* variable: Vite exposes
those values in the browser bundle. gitignore protects repository tracking, not deployed JavaScript.
For a public application that uses one shared credential, put it behind a backend/serverless proxy.
That is a separate architecture from this personal-key classroom frontend.

## 8. Troubleshooting

| Symptom | Check |
| --- | --- |
| No key issued yet | Follow TMDB account/API registration and any review instructions |
| 401 | Confirm v3 API Key rather than Read Access Token, activation and copied characters |
| 403 | Check account/API permissions |
| 429 | Wait and retry; avoid repeated requests |
| Timed out / failed to reach TMDB | Check internet or network restrictions, then retry |
| No movies found | A successful response can be empty; try a different query |
| Missing poster | The fallback is expected for null paths or failed image loads |
| Public 404 | Verify main/root, root index.html and successful Pages deployment |
| Blank page / missing CSS | Match Vite base to repo and upload a single complete build |
| Old preview/public page | Build again, upload matching files, wait and refresh |

## 9. Credits and official references

Keep the TMDB logo and the required notice in About & Credits:
“This product uses the TMDB API but is not endorsed or certified by TMDB.”

- Vue: https://vuejs.org/guide/quick-start.html
- Key registration: https://developer.themoviedb.org/docs/getting-started
- Authentication: https://developer.themoviedb.org/docs/authentication-application
- Popular: https://developer.themoviedb.org/reference/movie-popular-list
- Search: https://developer.themoviedb.org/reference/search-movie
- Images: https://developer.themoviedb.org/docs/image-basics
- Attribution: https://developer.themoviedb.org/docs/faq
- Vite deployment: https://vite.dev/guide/static-deploy.html
- Vite environment variables: https://vite.dev/guide/env-and-mode
- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

This HTML lecture opens offline with its notes and downloads. Live movie data, account
registration, initial npm installation and publishing require internet. The API application
form is account-dependent; the lecture gives labeled examples and links to the actual site.
