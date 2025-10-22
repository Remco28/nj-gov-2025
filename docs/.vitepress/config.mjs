import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "NJ Politics",
  description: "A Voter Decision Aid Website",
  spa: true, // Enable SPA mode for client-side navigation
  cleanUrls: true, // Generate clean URLs without .html
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Candidates', link: '/candidates/' }
    ],

    sidebar: [
      {
        text: 'Candidates',
        items: [
          // Items will be added here later
        ]
      }
    ],

    socialLinks: [
      // Optional: { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
