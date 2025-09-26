const config = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  hashSecret: process.env.NEXT_PUBLIC_HASH_SECRET,
  url: process.env.NEXT_PUBLIC_APP_URL,
  name: process.env.NEXT_PUBLIC_APP_NAME,
  nodeENV: process.env.NEXT_PUBLIC_NODE_ENV,
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  mapId: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  links: {
    twitter: process.env.NEXT_PUBLIC_APP_TWITTER,
    github: process.env.NEXT_PUBLIC_APP_GITHUB,
  },
  youtube: {
    apiKey: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
    channelId: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID,
    apiUrl: process.env.NEXT_PUBLIC_YOUTUBE_API_URL,
  },

  radioJar: {
    streamKey: process.env.NEXT_PUBLIC_RADIO_JAR_STREAM_KEY,
  },
  calculation: {
    GST: 0.18,
  },
  wordpress: {
    url: process.env.NEXT_PUBLIC_WP_URL,
  },

  // server
  server: {
    baseUrl: process.env.API_URL,
  },
};

export default config;
