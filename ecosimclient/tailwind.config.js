/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
	  './pages/**/*.{ts,tsx}',
	  './components/**/*.{ts,tsx}',
	  './app/**/*.{ts,tsx}',
	  './src/**/*.{ts,tsx}',
	],
	prefix: "",
	theme: {
	  container: {
		center: true,
		padding: "2rem",
		screens: {
		  "2xl": "1400px",
		},
	  },
	  extend: {
		colors: {
		  border: "hsl(var(--border))",
		  input: "hsl(var(--input))",
		  ring: "hsl(var(--ring))",
		  background: "hsl(var(--background))",
		  foreground: "hsl(var(--foreground))",
		  primary: {
			DEFAULT: "hsl(var(--primary))",
			foreground: "hsl(var(--primary-foreground))",
		  },
		  secondary: {
			DEFAULT: "hsl(var(--secondary))",
			foreground: "hsl(var(--secondary-foreground))",
		  },
		  destructive: {
			DEFAULT: "hsl(var(--destructive))",
			foreground: "hsl(var(--destructive-foreground))",
		  },
		  muted: {
			DEFAULT: "hsl(var(--muted))",
			foreground: "hsl(var(--muted-foreground))",
		  },
		  accent: {
			DEFAULT: "hsl(var(--accent))",
			foreground: "hsl(var(--accent-foreground))",
		  },
		  popover: {
			DEFAULT: "hsl(var(--popover))",
			foreground: "hsl(var(--popover-foreground))",
		  },
		  card: {
			DEFAULT: "hsl(var(--card))",
			foreground: "hsl(var(--card-foreground))",
		  },
		  // Custom grays to match lmarena.com's subtle dark and light modes
		  gray: {
			50: '#F9FAFB',    // Very light gray (light mode background)
			100: '#F3F4F6',
			200: '#E5E7EB',
			300: '#D1D5DB',
			400: '#9CA3AF',
			500: '#6B7280',
			600: '#4B5563',
			700: '#374151',
			800: '#1F2937',
			// Secondary dark color
			'850': '#292A2E',
			900: '#111827',
			// Main dark mode background
			'950': '#1D1D20',
		  },
		  // Specific blue accent color - a vibrant, clear blue
		  blue: {
			50: '#E0F7FA',    // Very light blue
			100: '#B2EBF2',
			200: '#80DEEA',
			300: '#4DD0E1',
			400: '#26C6DA',
			500: '#00BCD4',   // A good, clean accent blue
			600: '#00ACC1',
			700: '#00838F',
			800: '#006064',
			900: '#004D40',
		  },
		  // Kept for potential gradients or secondary accents, as in previous examples
		  indigo: {
			50: '#EEF2FF',
			100: '#E0E7FF',
			200: '#C7D2FE',
			300: '#A5B4FC',
			400: '#818CF8',
			500: '#6366F1',
			600: '#4F46E5',
			700: '#4338CA',
			800: '#3730A3',
			900: '#312E81',
			950: '#1E1B4B',
		  }
		},
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		},
		keyframes: {
		  "accordion-down": {
			from: { height: "0" },
			to: { height: "var(--radix-accordion-content-height)" },
		  },
		  "accordion-up": {
			from: { height: "var(--radix-accordion-content-height)" },
			to: { height: "0" },
		  },
		},
		animation: {
		  "accordion-down": "accordion-down 0.2s ease-out",
		  "accordion-up": "accordion-up 0.2s ease-out",
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  };
  