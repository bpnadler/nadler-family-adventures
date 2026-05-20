# Custom Images

The site currently pulls landmark photos from **Wikimedia Commons** (stable, free-to-use public URLs).
Some of those guessed filenames may not exist — those images simply won't load, and the cinematic CSS gradient stays as the fallback. The page still looks great.

## To swap any image with your own:

1. Drop your image into one of these folders:
   - `images/scotland/`
   - `images/alps-italy/`
   - `images/general/`

2. Open the HTML file for that trip (`trips/scotland.html` or `trips/alps-italy.html`)

3. Find the `<img>` tag for the image you want to replace. Each has a `src=` attribute pointing to a Wikimedia URL — change it to point at your local file. Example:

   **Before:**
   ```html
   <img class="chapter-image" data-fade
     src="https://commons.wikimedia.org/wiki/Special:FilePath/Belfast..." alt="Belfast">
   ```

   **After:**
   ```html
   <img class="chapter-image" data-fade
     src="../images/scotland/my-belfast-photo.jpg" alt="Belfast">
   ```

## To swap a YouTube video:

In `trips/scotland.html` or `trips/alps-italy.html`, find the `<iframe>` and change the `VIDEO_ID` in the URL:
```html
<iframe src="https://www.youtube.com/embed/VIDEO_ID?rel=0&modestbranding=1" ...>
```

Just paste the YouTube video ID (the part after `v=` in any YouTube URL).

## Good places to grab free photos:

- **Wikimedia Commons** — https://commons.wikimedia.org (free, public domain)
- **Unsplash** — https://unsplash.com (free, high-quality)
- **Hotel websites** — most hotels are happy for you to use their official press photos
