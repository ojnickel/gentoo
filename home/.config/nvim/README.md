# 🚀 Modern Neovim Configuration for WordPress & Web Development

A powerful, fully-featured Neovim configuration optimized for WordPress and modern web development. This setup transforms Neovim into a VS Code-like IDE while maintaining the efficiency and speed of Vim, with support for HTML, CSS/SCSS, JavaScript/TypeScript, PHP, Python, Docker, and SQL.

![Neovim](https://img.shields.io/badge/NeoVim-%2357A143.svg?&style=for-the-badge&logo=neovim&logoColor=white)
![Lua](https://img.shields.io/badge/lua-%232C2D72.svg?style=for-the-badge&logo=lua&logoColor=white)
![WordPress](https://img.shields.io/badge/WordPress-%23117AC9.svg?style=for-the-badge&logo=WordPress&logoColor=white)

**Neovim 0.9+** compatible with modular plugin architecture

---

## 📑 Table of Contents

- [Features](#-features)
- [Plugin Ecosystem](#-plugin-ecosystem)
- [Installation](#-installation)
- [Configuration Structure](#-configuration-structure)
- [LSP Servers](#-lsp-servers)
- [Complete Keybindings Reference](#-complete-keybindings-reference)
- [WordPress Development](#-wordpress-development-features)
- [Customization Guide](#-customization-guide)
- [Troubleshooting](#-troubleshooting)
- [Learning Resources](#-learning-resources)

---

## ✨ Features

### 🎨 Modern IDE Experience
- **Catppuccin Mocha Theme** - Beautiful, modern color scheme with excellent syntax highlighting
- **Neo-tree File Explorer** - VS Code-like sidebar with Git integration and file icons
- **Bufferline Tabs** - Visual buffer tabs with close buttons and file type icons
- **Lualine Status Line** - Informative status line with Git status, LSP diagnostics, and file info
- **Alpha Start Screen** - Customizable dashboard with quick actions
- **Scrollbar** - Visual scrollbar with diagnostics indicators

### ⚡ Developer Productivity
- **Telescope Fuzzy Finder** - Find files, text, buffers, and help tags instantly
- **Git Integration** - Fugitive and Gitsigns for comprehensive Git workflow
- **Database UI** - Built-in database management for WordPress development
- **Integrated Terminal** - ToggleTerm for seamless terminal access
- **Auto-pairs & Comments** - Smart bracket pairing and commenting

### 🔧 Language & Framework Support
- **12 LSP Servers** - Automatic installation and configuration via Mason
- **Treesitter** - Advanced syntax highlighting and code understanding
- **Auto-completion** - Intelligent suggestions from LSP, snippets, buffer, and path
- **Emmet Support** - Fast HTML/CSS expansion
- **WordPress Stubs** - Full WordPress function definitions and hook suggestions via Intelephense
- **Auto-tags** - Automatic HTML tag closing with Treesitter

### 🎯 UX & Navigation
- **Comment.nvim** - Smart commenting with treesitter integration
- **Which-key** - Interactive keybinding hints
- **Indent Guides** - Visual indent lines for better code structure
- **Colorizer** - Live CSS color preview in files

---

## 📦 Plugin Ecosystem

### Core Functionality
| Plugin | Purpose |
|--------|---------|
| `lazy.nvim` | Fast and modern plugin manager with lazy loading |
| `plenary.nvim` | Lua utility functions (dependency for many plugins) |
| `nvim-web-devicons` | File type icons throughout the UI |
| `nui.nvim` | UI component library |

### Theme & UI
| Plugin | Purpose | Config File |
|--------|---------|-------------|
| `catppuccin/nvim` | Catppuccin Mocha color scheme (active theme) | `lua/plugins/colorscheme.lua` |
| `folke/tokyonight.nvim` | Alternative Tokyo Night theme | `lua/plugins/colorscheme.lua` |
| `Mofiqul/vscode.nvim` | Alternative VS Code theme | `lua/plugins/colorscheme.lua` |
| `nvim-lualine/lualine.nvim` | Customizable status line | `lua/plugins/ui.lua` |
| `akinsho/bufferline.nvim` | Buffer tabs in the top bar | `lua/plugins/ui.lua` |
| `goolord/alpha-nvim` | Customizable start screen | `lua/plugins/ui.lua` |
| `dstein64/nvim-scrollview` | Scrollbar with diagnostics | `lua/plugins/ui.lua` |
| `lukas-reineke/indent-blankline.nvim` | Indent guides | `lua/plugins/ui.lua` |

### Navigation & File Management
| Plugin | Purpose | Config File |
|--------|---------|-------------|
| `nvim-neo-tree/neo-tree.nvim` | Modern file explorer sidebar | `lua/plugins/ui.lua` |
| `nvim-telescope/telescope.nvim` | Fuzzy finder for everything | `lua/plugins/editor.lua` |
| `nvim-telescope/telescope-file-browser.nvim` | File browser extension | `lua/plugins/editor.lua` |

### LSP & Completion
| Plugin | Purpose | Config File |
|--------|---------|-------------|
| `neovim/nvim-lspconfig` | LSP configuration framework | `lua/plugins/lsp.lua` |
| `williamboman/mason.nvim` | LSP/DAP/linter installer | `lua/plugins/lsp.lua` |
| `williamboman/mason-lspconfig.nvim` | Mason integration with lspconfig | `lua/plugins/lsp.lua` |
| `hrsh7th/nvim-cmp` | Completion engine | `lua/plugins/lsp.lua` |
| `hrsh7th/cmp-nvim-lsp` | LSP completion source | `lua/plugins/lsp.lua` |
| `hrsh7th/cmp-buffer` | Buffer completion source | `lua/plugins/lsp.lua` |
| `hrsh7th/cmp-path` | File path completion source | `lua/plugins/lsp.lua` |
| `hrsh7th/cmp-cmdline` | Command line completion | `lua/plugins/lsp.lua` |

### Snippets
| Plugin | Purpose | Config File |
|--------|---------|-------------|
| `L3MON4D3/LuaSnip` | Snippet engine | `lua/plugins/lsp.lua` |
| `saadparwaiz1/cmp_luasnip` | LuaSnip completion source | `lua/plugins/lsp.lua` |
| `rafamadriz/friendly-snippets` | Collection of common snippets | `lua/plugins/lsp.lua` |
| Custom WordPress snippets | WordPress development snippets | `lua/snippets/wordpress.lua` |

### Syntax & Formatting
| Plugin | Purpose | Config File |
|--------|---------|-------------|
| `nvim-treesitter/nvim-treesitter` | Advanced syntax highlighting | `lua/plugins/treesitter.lua` |
| `windwp/nvim-autopairs` | Auto-close brackets and quotes | `lua/plugins/editor.lua` |
| `windwp/nvim-ts-autotag` | Auto-close HTML tags | `lua/plugins/formatting.lua` |
| `jose-elias-alvarez/null-ls.nvim` | Formatting and diagnostics | `lua/plugins/formatting.lua` |
| `MunifTanjim/prettier.nvim` | Prettier integration | `lua/plugins/formatting.lua` |
| `norcalli/nvim-colorizer.lua` | CSS color preview | `lua/plugins/editor.lua` |

### Git Integration
| Plugin | Purpose | Config File |
|--------|---------|-------------|
| `tpope/vim-fugitive` | Comprehensive Git commands | `lua/plugins/git.lua` |
| `lewis6991/gitsigns.nvim` | Git signs in the gutter | `lua/plugins/git.lua` |

### Utilities
| Plugin | Purpose | Config File |
|--------|---------|-------------|
| `numToStr/Comment.nvim` | Smart commenting | `lua/plugins/editor.lua` |
| `folke/which-key.nvim` | Keybinding hints | `lua/plugins/editor.lua` |
| `akinsho/toggleterm.nvim` | Terminal integration | `lua/plugins/terminal.lua` |

### Web Development
| Plugin | Purpose | Config File |
|--------|---------|-------------|
| `mattn/emmet-vim` | Emmet abbreviation expansion | `lua/plugins/formatting.lua` |

### WordPress & Database
| Plugin | Purpose | Config File |
|--------|---------|-------------|
| `dsawardekar/wordpress.vim` | WordPress-specific features | `lua/plugins/lang.lua` |
| `tpope/vim-dadbod` | Database interface | `lua/plugins/lang.lua` |
| `kristijanhusak/vim-dadbod-ui` | Database UI | `lua/plugins/lang.lua` |
| `kristijanhusak/vim-dadbod-completion` | Database completion | `lua/plugins/lang.lua` |

### Markdown
| Plugin | Purpose | Config File |
|--------|---------|-------------|
| `preservim/vim-markdown` | Markdown syntax | `lua/plugins/lang.lua` |
| `iamcco/markdown-preview.nvim` | Live markdown preview in browser | `lua/plugins/lang.lua` |

### Docker
| Plugin | Purpose | Config File |
|--------|---------|-------------|
| `ekalinin/Dockerfile.vim` | Dockerfile syntax | `lua/plugins/lang.lua` |

---

## 🛠 LSP Servers

All LSP servers are automatically installed via Mason on first launch:

| Language | Server | Features |
|----------|--------|----------|
| **HTML** | `html` | Formatting, validation, auto-completion |
| **CSS** | `cssls` | Linting, color preview, completion |
| **JavaScript/TypeScript** | `ts_ls` | Full IntelliSense, refactoring |
| **JSON** | `jsonls` | Schema validation and completion |
| **Bash** | `bashls` | Shell script support |
| **PHP** | `intelephense` | WordPress stubs, full PHP IntelliSense |
| **Python** | `pyright` | Type checking, auto-imports |
| **Docker** | `dockerls` | Dockerfile validation |
| **SQL** | `sqlls` | SQL syntax and completion |
| **Lua** | `lua_ls` | Neovim Lua API support |
| **Emmet** | `emmet_ls` | HTML/CSS expansion |

### LSP Features
- **Go to Definition** (`gd`) - Jump to symbol definition
- **Go to Declaration** (`gD`) - Jump to symbol declaration
- **Find References** (`gr`) - Show all references
- **Hover Documentation** (`K`) - Show symbol information
- **Code Actions** (`<leader>ca`) - Quick fixes and refactorings
- **Rename Symbol** (`<leader>rn`) - Rename across files
- **Format Document** (`<leader>f`) - Auto-format code
- **Diagnostics** (`[d`, `]d`) - Navigate errors and warnings

---

## 📁 Configuration Structure

```
~/.config/nvim/
├── init.lua                      # Main entry point - loads all modules
├── CLAUDE.md                     # AI assistant instructions
├── lazy-lock.json                # Plugin version lock file
└── lua/
    ├── settings.lua              # Core Vim options (tabs, encoding, UI)
    ├── keymaps.lua               # All keybindings (leader: -)
    ├── lsp.lua                   # LSP configuration and completion
    ├── ui.lua                    # UI component configurations
    ├── wordpress.lua             # WordPress-specific utilities
    ├── plugins.lua               # Lazy.nvim bootstrap script
    ├── plugins/                  # Modular plugin definitions
    │   ├── colorscheme.lua       # Theme configurations
    │   ├── ui.lua                # UI plugins (neo-tree, lualine, etc.)
    │   ├── editor.lua            # Editor enhancements (telescope, etc.)
    │   ├── lsp.lua               # LSP and completion plugins
    │   ├── treesitter.lua        # Treesitter configuration
    │   ├── git.lua               # Git integration plugins
    │   ├── terminal.lua          # Terminal plugins
    │   ├── lang.lua              # Language-specific plugins
    │   └── formatting.lua        # Code formatting plugins
    └── snippets/
        └── wordpress.lua         # WordPress code snippets
```

### Module Loading Order (init.lua)
1. `settings.lua` - Core Vim options
2. `keymaps.lua` - Keybindings (before plugins for leader key)
3. `plugins.lua` - Plugin manager bootstrap
4. `lsp.lua` - LSP servers and completion
5. `ui.lua` - UI components (statusline, bufferline, etc.)
6. `snippets/wordpress.lua` - Custom snippets

**Important:** Module order matters! Settings and keymaps load before plugins to ensure proper initialization.

### Modular Plugin Architecture

Plugins are organized by category in `lua/plugins/`:
- **colorscheme.lua** - All color schemes and theme configuration
- **ui.lua** - UI elements (file tree, status line, buffers, scrollbar)
- **editor.lua** - Editor enhancements (telescope, autopairs, comments, colorizer)
- **lsp.lua** - LSP and completion plugin definitions
- **treesitter.lua** - Treesitter parser configuration
- **git.lua** - Git-related plugins
- **terminal.lua** - Terminal integration
- **lang.lua** - Language/framework-specific plugins
- **formatting.lua** - Code formatting and generation tools

Each file returns a Lua table that Lazy.nvim loads automatically.

---

## 📦 Installation

### Prerequisites
- **Neovim 0.9+**
- **Git** - For plugin management
- **Node.js & npm** - For LSP servers (ts_ls, eslint, etc.)
- **Ripgrep (rg)** - For Telescope live grep
- **A Nerd Font** - For icons (recommended: [FiraCode Nerd Font](https://www.nerdfonts.com/))
- **curl** or **wget** - For downloading plugins
- **Python 3** - For Python LSP support (optional)
- **PHP** - For PHP/WordPress development (optional)

### Ubuntu/Debian Installation
```bash
# Install prerequisites
sudo apt update
sudo apt install git nodejs npm ripgrep curl python3 python3-pip php

# Install a Nerd Font (example: FiraCode)
mkdir -p ~/.local/share/fonts
cd ~/.local/share/fonts
curl -fLo "Fira Code Regular Nerd Font Complete.ttf" \
  https://github.com/ryanoasis/nerd-fonts/raw/master/patched-fonts/FiraCode/Regular/FiraCodeNerdFont-Regular.ttf
fc-cache -fv
```

### Install Neovim Configuration

1. **Backup existing configuration** (if any):
   ```bash
   mv ~/.config/nvim ~/.config/nvim.backup
   mv ~/.local/share/nvim ~/.local/share/nvim.backup
   ```

2. **Clone this repository**:
   ```bash
   git clone <your-repo-url> ~/.config/nvim
   ```

3. **Start Neovim**:
   ```bash
   nvim
   ```

   On first launch, the configuration will automatically:
   - Install lazy.nvim plugin manager
   - Download and install all plugins from `lua/plugins/`
   - Install LSP servers via Mason
   - Compile treesitter parsers

4. **Wait for installations to complete** (1-3 minutes)
   - Watch the bottom of the screen for progress
   - Lazy.nvim will show plugin installation status
   - Mason will install LSP servers in the background

5. **Restart Neovim** after initial setup:
   ```bash
   nvim
   ```

6. **Verify installation**:
   ```vim
   :checkhealth
   :Mason  " Check LSP server status
   :Lazy   " Check plugin status
   ```

### Post-Installation

**Check LSP servers:**
```vim
:Mason
```
All servers should show a ✓ (installed). If not, select a server and press `i` to install.

**Update plugins:**
```vim
:Lazy sync
```

**Update LSP servers:**
```vim
:Mason
```
Then press `U` to update all.

---

## ⌨️ Complete Keybindings Reference

**Leader Key:** `-` (dash)

### File Operations
| Key | Mode | Action |
|-----|------|--------|
| `<leader>w` | Normal | Save file |
| `<leader>q` | Normal | Quit without saving |
| `<leader>x` | Normal | Save and quit |
| `<leader>c` | Normal | Toggle cursor line/column |
| `F2` | Normal | Toggle Neo-tree file explorer |
| `F3` | Normal | Toggle paste mode |
| `F5` | Normal | Toggle scrollbar |

### Buffer Navigation
| Key | Mode | Action |
|-----|------|--------|
| `t` | Normal | New buffer |
| `<leader>l` | Normal | Next buffer |
| `<leader>h` | Normal | Previous buffer |
| `<leader>d` | Normal | Delete buffer |
| `<leader>bq` | Normal | Close buffer and move to previous |
| `<leader>bl` | Normal | List all buffers |

### Telescope (Fuzzy Finder)
| Key | Mode | Action |
|-----|------|--------|
| `<leader>ff` | Normal | Find files |
| `<leader>fg` | Normal | Live grep (search in files) |
| `<leader>fb` | Normal | Find buffers |
| `<leader>fh` | Normal | Search help tags |

### LSP Navigation
| Key | Mode | Action |
|-----|------|--------|
| `gd` | Normal | Go to definition |
| `gD` | Normal | Go to declaration |
| `gi` | Normal | Go to implementation |
| `gr` | Normal | Show references |
| `K` | Normal | Show hover information |
| `Ctrl-k` | Normal | Show signature help |
| `<leader>D` | Normal | Go to type definition |

### LSP Actions
| Key | Mode | Action |
|-----|------|--------|
| `<leader>ca` | Normal | Code actions |
| `<leader>rn` | Normal | Rename symbol |
| `<leader>f` | Normal | Format document |
| `<leader>wa` | Normal | Add workspace folder |
| `<leader>wr` | Normal | Remove workspace folder |

### Diagnostics
| Key | Mode | Action |
|-----|------|--------|
| `[d` | Normal | Previous diagnostic |
| `]d` | Normal | Next diagnostic |
| `<leader>e` | Normal | Show diagnostic float |

### Git Operations
| Key | Mode | Action |
|-----|------|--------|
| `<leader>gs` | Normal | Git status |
| `<leader>gc` | Normal | Git commit |
| `<leader>ga` | Normal | Git add current file |
| `<leader>gt` | Normal | Git commit current file |
| `<leader>gd` | Normal | Git diff |
| `<leader>ge` | Normal | Git edit |
| `<leader>gr` | Normal | Git read |
| `<leader>gw` | Normal | Git write |
| `<leader>gl` | Normal | Git log |
| `<leader>gpr` | Normal | Git grep |
| `<leader>gm` | Normal | Git move |
| `<leader>gb` | Normal | Git branch |
| `<leader>go` | Normal | Git checkout |
| `<leader>gp` | Normal | Git push |
| `<leader>gps` | Normal | Git push |
| `<leader>gpl` | Normal | Git pull |

### Clipboard Operations (WSL)
| Key | Mode | Action |
|-----|------|--------|
| `<leader>y` | Visual | Copy to Windows clipboard |

### Development Tools
| Key | Mode | Action |
|-----|------|--------|
| `<leader>t` | Normal/Terminal | Toggle terminal |
| `<leader>m` | Normal | Open Mason (LSP manager) |
| `<leader>db` | Normal | Toggle database UI |

### WordPress Shortcuts
| Key | Mode | Action |
|-----|------|--------|
| `<leader>wp` | Normal | Edit wp-config.php |
| `<leader>wf` | Normal | Edit functions.php |

### Markdown
| Key | Mode | Action |
|-----|------|--------|
| `<leader>mp` | Normal | Markdown preview |
| `<leader>ms` | Normal | Stop markdown preview |

---

## 🎯 WordPress Development Features

### WordPress-Specific LSP Configuration
The Intelephense LSP server is configured with comprehensive WordPress stubs (see `lua/lsp.lua`):
- Full WordPress function definitions
- Hook and filter suggestions
- WordPress coding standards
- Global variables and constants
- Custom post types and taxonomies support

### WordPress Snippets
Quick access to common WordPress patterns via LuaSnip (defined in `lua/snippets/wordpress.lua`):

| Trigger | Expands To |
|---------|-----------|
| `wpq` | WP_Query with meta query template |
| `wpl` | Standard WordPress loop |
| `wpcpt` | Custom post type registration |
| `wpenq` | wp_enqueue_scripts function |
| `wpmeta` | Meta box creation |
| `wptheme` | WordPress theme template |
| `wphook` | add_action hook |
| `wpfilter` | add_filter hook |
| `wpajax` | AJAX handler template |
| `wpshortcode` | Shortcode registration |
| `wpwidget` | Widget class template |
| `wprest` | REST API endpoint |
| `wpcron` | WP Cron job |
| `wpsettings` | Settings page template |

### Database Integration
- **vim-dadbod** - Direct database queries
- **vim-dadbod-ui** - Visual database browser
- **Database completion** - Table and column suggestions
- Toggle with `<leader>db`

---

## 🎨 Customization Guide

### Changing the Theme

Edit `lua/plugins/colorscheme.lua` line 59:
```lua
vim.cmd.colorscheme("catppuccin")  -- Change to "tokyonight" or "vscode"
```

Available themes:
- `catppuccin` (default - Mocha variant)
- `tokyonight`
- `vscode`

Update Lualine theme in `lua/ui.lua` to match your colorscheme.

### Adding New Plugins

Create or edit files in `lua/plugins/` directory. For example:

```lua
-- lua/plugins/your-category.lua
return {
  {
    "author/plugin-name",
    dependencies = { "required/plugin" },  -- Optional
    ft = { "filetype" },                    -- Lazy load on filetype (optional)
    config = function()
      require("plugin-name").setup({
        -- Configuration options
      })
    end,
  },
}
```

Then restart Neovim or run `:Lazy sync`.

### Adding LSP Servers

1. Add server name to `lua/lsp.lua` in the servers list
2. (Optional) Add custom configuration for the server
3. Restart Neovim - Mason will auto-install the server

### Adding Treesitter Parsers

Edit `lua/plugins/treesitter.lua` to add languages to `ensure_installed`.

### Custom Key Mappings

Add to `lua/keymaps.lua`:
```lua
map("n", "<leader>your_key", ":YourCommand<CR>", { desc = "Description" })
```

Pattern:
- `"n"` = normal mode (`"i"` insert, `"v"` visual, `"t"` terminal)
- `"<leader>key"` = keybinding (leader is `-`)
- `":Command<CR>"` = vim command or Lua function
- `{ desc = "..." }` = description (shown in which-key)

### Creating Custom Snippets

Create a new file in `lua/snippets/`:
```lua
-- lua/snippets/my_snippets.lua
local ls = require("luasnip")
local s = ls.snippet
local t = ls.text_node
local i = ls.insert_node

ls.add_snippets("filetype", {
  s("trigger", {
    t("text "),
    i(1, "placeholder"),
    t(" more text"),
  }),
})
```

Load in `init.lua`:
```lua
require("snippets.my_snippets")
```

### Customizing UI Components

- **File explorer width** - `lua/ui.lua` Neo-tree configuration
- **Status line sections** - `lua/ui.lua` Lualine configuration
- **Buffer tabs style** - `lua/ui.lua` Bufferline configuration
- **Terminal size** - `lua/ui.lua` ToggleTerm configuration
- **Start screen** - `lua/ui.lua` Alpha configuration

---

## 🔧 Troubleshooting

### Plugin Installation Issues

**Symptom:** Plugins not loading or errors on startup

**Solution:**
```bash
# Remove plugin cache
rm -rf ~/.local/share/nvim/lazy

# Restart Neovim - plugins will reinstall
nvim

# Or manually sync plugins
:Lazy sync
```

### LSP Server Not Working

**Symptom:** No auto-completion or "LSP not attached"

**Solution:**
```vim
" Check LSP status
:LspInfo

" Open Mason and check server status
:Mason

" Reinstall server (select server, press 'X' to uninstall, then 'i' to install)

" Check server logs
:lua vim.lsp.set_log_level("debug")
:edit ~/.local/state/nvim/lsp.log
```

**Common issues:**
- **Node.js not installed:** Many LSP servers require Node.js
- **Server not in PATH:** Mason installs to `~/.local/share/nvim/mason/bin`
- **PHP LSP:** Requires PHP binary in PATH

### Treesitter Errors

**Symptom:** Syntax highlighting broken or parser errors

**Solution:**
```vim
" Update treesitter parsers
:TSUpdate

" Reinstall all parsers
:TSInstall all

" Check parser status
:TSInstallInfo
```

### Clipboard Not Working (WSL)

**Symptom:** Copy/paste between Neovim and Windows doesn't work

**Solution:**
Ensure `clip.exe` is in PATH:
```bash
which clip.exe
# Should return: /mnt/c/Windows/System32/clip.exe
```

If not found, add to `~/.bashrc` or `~/.zshrc`:
```bash
export PATH="$PATH:/mnt/c/Windows/System32"
```

### Slow Startup

**Symptom:** Neovim takes several seconds to start

**Solution:**
```vim
" Profile startup time
:Lazy profile

" Check for slow plugins
" Consider lazy-loading heavy plugins with 'ft' or 'cmd' options
```

Optimize in plugin files:
```lua
{
  "heavy/plugin",
  ft = { "filetype" },     -- Load only for specific filetypes
  cmd = { "Command" },     -- Load only when command is used
  event = "VeryLazy",      -- Load after startup
}
```

### Database UI Not Connecting

**Symptom:** vim-dadbod can't connect to database

**Solution:**
1. Configure database connection in `~/.local/share/db_ui/`
2. Or use `:DBUI` and add connection interactively

### Icons Not Showing

**Symptom:** Squares or broken characters instead of icons

**Solution:**
1. Install a Nerd Font (see [Prerequisites](#prerequisites))
2. Set terminal font to the Nerd Font
3. Restart terminal

---

Add to `lua/keymaps.lua`:
```lua
map("n", "<leader>key", ":Command<CR>", { desc = "Description" })
```

### Neovim
- [Neovim Documentation](https://neovim.io/doc/)
- [Lua Guide for Neovim](https://github.com/nanotee/nvim-lua-guide)
- [Vim Cheat Sheet](https://vim.rtorr.com/)
- [Learn Vim Progressively](http://yannesposito.com/Scratch/en/blog/Learn-Vim-Progressively/)

### Plugin Documentation
- [Lazy.nvim](https://github.com/folke/lazy.nvim)
- [LSP Config](https://github.com/neovim/nvim-lspconfig)
- [Telescope](https://github.com/nvim-telescope/telescope.nvim)
- [Treesitter](https://github.com/nvim-treesitter/nvim-treesitter)
- [LuaSnip](https://github.com/L3MON4D3/LuaSnip)

### WordPress
- [WordPress Codex](https://codex.wordpress.org/)
- [WordPress Developer Resources](https://developer.wordpress.org/)
- [Intelephense](https://intelephense.com/)

### Web Development
- [MDN Web Docs](https://developer.mozilla.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📝 Updates

### Update Plugins
```vim
:Lazy update
```

### Update LSP Servers
```vim
:Mason
```
Press `U` to update all.

### Sync Configuration

To sync changes from `~/.config/nvim` to this repository:
```bash
# Manual sync
rsync -av --exclude='.claude' --exclude='.git' ~/.config/nvim/ ~/git/nvim/
cd ~/git/nvim
git add .
git commit -m "Update configuration"
git push
```

---

## 📄 License

MIT License - Feel free to use and modify for your own setup.

---

---

## 🙏 Acknowledgments

### Projects
- [Neovim](https://neovim.io/) - The hyperextensible Vim-based text editor
- [Lazy.nvim](https://github.com/folke/lazy.nvim) - Modern plugin manager
- [Mason.nvim](https://github.com/williamboman/mason.nvim) - LSP installer
- [Catppuccin](https://github.com/catppuccin/nvim) - Beautiful color scheme

### Community
- VS Code - UI/UX inspiration
- WordPress Community - For the amazing development ecosystem
- Neovim Community - For the incredible plugin ecosystem

---

## 📊 Quick Stats

- **30+ Plugins** - Carefully curated for web development
- **12 LSP Servers** - Full language support
- **9 Treesitter Parsers** - Advanced syntax highlighting
- **80+ Keybindings** - Organized and documented
- **15+ WordPress Snippets** - Speed up development
- **Modular Architecture** - Easy to customize and extend

---

**Made with ❤️ for WordPress developers who love Vim**

*Transform your development workflow with the power of Neovim!*

**Leader Key: `-` (dash)** | **Maintained by**: nickel | **Last Updated**: October 2024
