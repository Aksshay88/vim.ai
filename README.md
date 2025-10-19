# Vim.ai 🚀

A beautiful, intuitive web application for generating Vim/Neovim configurations with ease.

## Features ✨

- **Dynamic Form Generation**: Create keymaps, plugins, options, and autocmds through an intuitive interface
- **Multi-Language Support**: Generate both Lua (Neovim) and Vimscript configurations
- **Plugin Manager Support**: Compatible with lazy.nvim, Packer, vim-plug, and dein.vim
- **Clean UI**: Dark-themed, responsive design optimized for developers
- **Copy to Clipboard**: One-click copying of generated configurations
- **Validation**: Smart form validation to ensure correct configuration syntax

## Configuration Types Supported

1. **Keymaps**: Create custom key bindings with options for mode, noremap, buffer-local, silent, and expression mappings
2. **Plugins**: Configure plugins for various plugin managers with setup functions and dependencies
3. **Options**: Set Vim/Neovim options with proper scoping (vim.opt, vim.o, vim.bo, vim.wo, vim.g)
4. **Autocmds**: Create autocommands with events, patterns, and commands, organized in augroups

## Getting Started 🏁

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage 📖

1. Select a configuration type (Keymap, Plugin, Option, or Autocmd)
2. Choose your target language (Lua or Vimscript)
3. Fill in the required fields based on the configuration type
4. Click "Generate Config" to see your configuration
5. Copy and paste the generated code into your Vim/Neovim config

## Project Structure 📁

```
vimai/
├── src/
│   ├── components/
│   │   ├── ConfigOptionForm.jsx      # Main form component
│   │   └── ConfigOptionForm.css      # Form styles
│   ├── utils/
│   │   └── generateVimConfig.js      # Config generation logic
│   ├── App.jsx                       # Main app component
│   ├── App.css                       # App styles
│   ├── main.jsx                      # React entry point
│   └── index.css                     # Global styles
├── index.html                        # HTML template
├── vite.config.js                    # Vite configuration
├── package.json                      # Dependencies
└── README.md                         # Documentation
```

## Technologies Used 🛠️

- **React 18**: Modern React with functional components and hooks
- **Vite**: Fast build tool and dev server
- **CSS3**: Custom properties, Grid, Flexbox for responsive design
- **JavaScript ES6+**: Modern JavaScript features

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

MIT License - feel free to use this project for your own purposes.

## Acknowledgments 💙

Made with ♥ for the Vim and Neovim community.

---

**Happy Vimming!** 🎉
