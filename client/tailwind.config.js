/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        sphere: {
          ink: "#06111f",
          panel: "#0b1f35",
          card: "#10283f",
          line: "#1f4769",
          sky: "#35b7ff",
          mint: "#4ee6b6",
          rose: "#ff5f8f"
        }
      },
      boxShadow: {
        glow: "0 18px 60px rgba(53, 183, 255, 0.16)"
      }
    }
  },
  plugins: []
};
