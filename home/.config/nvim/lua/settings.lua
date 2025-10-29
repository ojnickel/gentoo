-- settings.lua (matching .vimrc configuration)
-- Mouse settings (from .vimrc)
vim.opt.mouse = "a"

-- Show mode settings (from .vimrc)
vim.opt.showmode = false  -- noshowmode

-- Tab settings (from .vimrc)
vim.opt.tabstop = 4
vim.opt.shiftwidth = 4
vim.opt.softtabstop = 4
vim.opt.expandtab = true

-- Cursor settings (from .vimrc)
vim.opt.cursorline = true
vim.opt.cursorcolumn = true

-- Line numbers (from .vimrc)
vim.opt.number = true

-- Indentation (from .vimrc)
vim.opt.autoindent = true
vim.opt.smartindent = true

-- Text width (from .vimrc)
vim.opt.textwidth = 80

-- Encoding (from .vimrc)
vim.opt.encoding = "utf-8"

-- Timeout settings (from .vimrc)
vim.opt.timeout = false
vim.opt.ttimeout = false

-- Buffer settings (from .vimrc)
vim.opt.hidden = true

-- Clipboard (from .vimrc)
if vim.fn.has('unnamedplus') == 1 then
  vim.opt.clipboard = "unnamedplus"
else
  vim.opt.clipboard = "unnamed"
end

-- Additional useful settings
vim.opt.termguicolors = true
vim.opt.splitright = true
vim.opt.splitbelow = true
vim.opt.ignorecase = true
vim.opt.smartcase = true
