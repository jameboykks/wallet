module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
      extend: {
        colors: {
          'glass-primary': '#7F5FFF',
          'glass-secondary': '#48C6EF',
          'glass-pink': '#E0C3FC',
          'glass-green': '#43E97B'
        },
        backdropBlur: {
          glass: '18px'
        }
      },
    },
    plugins: [],
  }
  