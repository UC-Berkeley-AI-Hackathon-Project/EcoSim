# EcoSim

A React-based ecological simulation project built with Vite.

## 🚀 Quick Start

Follow these steps to get the project running on your local machine:

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)

To check if you have Node.js installed, run:
```bash
node --version
npm --version
```

If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EcoSim
   ```

2. **Navigate to the project directory**
   ```bash
   cd EcoSim
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   The application will be available at `http://localhost:5173` (or the URL shown in your terminal)

## 📝 Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **ESLint** - Code linting

## 📁 Project Structure

```
EcoSim/
├── src/           # Source code
├── public/        # Static assets
├── index.html     # Entry point
├── package.json   # Dependencies and scripts
└── vite.config.js # Vite configuration
```

## 🐛 Troubleshooting

**If you get an "ENOENT" error about package.json:**
- Make sure you're in the correct directory (`EcoSim/EcoSim/`)
- The project structure should have the `package.json` file in the `EcoSim/EcoSim/` subdirectory

**If npm install fails:**
- Try clearing npm cache: `npm cache clean --force`
- Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

**If the dev server won't start:**
- Check if port 5173 is already in use
- Try running `npm run dev -- --port 3000` to use a different port

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test with `npm run dev`
4. Submit a pull request

## 📞 Need Help?

If you encounter any issues during setup, please:
1. Check this README first
2. Ask your teammates
3. Create an issue in the repository
