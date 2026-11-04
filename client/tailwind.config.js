export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#142D3A",
        teal: {
          DEFAULT: "#247C78",
          hover: "#1B625F",
          light: "#DCECE8",
        },
        sage: "#DCECE8",
        cc: {
          bg: "#F7F8F6",
          card: "#FFFFFF",
          text: "#1C2932",
          muted: "#687780",
          border: "#E5EAE8",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(20,45,58,0.06), 0 4px 12px rgba(20,45,58,0.04)",
        btn: "0 1px 2px rgba(20,45,58,0.12)",
      },
    },
  },
  plugins: [],
};
