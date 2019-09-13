if (process.env.NODE_ENV === "production") {
  console.log("loading service worker")
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js')

  if (workbox) {
    workbox.routing.registerRoute(
      /\.(js|css|png|html)$/,
      new workbox.strategies.CacheFirst()
    )
    workbox.routing.registerRoute(
      /flashcards\/$/,
      new workbox.strategies.StaleWhileRevalidate()
    )
  }

} else {
  console.log("skipping service worker")
}

