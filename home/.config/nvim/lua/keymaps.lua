-- keymaps.lua (matching .vimrc configuration)
vim.g.mapleader = "-"  -- Same as .vimrc

local map = vim.keymap.set

-- Cursor line/column toggle (from .vimrc)
map("n", "<leader>c", ":set cursorline! cursorcolumn!<CR>", { desc = "Toggle cursor line/column" })

-- File operations (from .vimrc)
map("n", "<leader>q", ":q!<CR>", { desc = "Quit without saving" })
map("n", "<leader>w", ":w<CR>", { desc = "Save file" })
map("n", "<leader>x", ":x<CR>", { desc = "Save and quit" })

-- File explorer (F2 from .vimrc)
map("n", "<F2>", ":Neotree toggle<CR>", { desc = "Toggle file explorer" })

-- Scrollview toggle (F5 from .vimrc - scrollbar)
map("n", "<F5>", function()
  if vim.g.scrollview_enabled ~= false then
    vim.cmd('ScrollViewDisable')
    vim.g.scrollview_enabled = false
    print("Scrollview disabled")
  else
    vim.cmd('ScrollViewEnable')
    vim.g.scrollview_enabled = true
    print("Scrollview enabled")
  end
end, { desc = "Toggle scrollview" })

-- Paste toggle (F3 from .vimrc) - Using modern Neovim approach
map("n", "<F3>", function()
  vim.opt.paste = not vim.opt.paste:get()
  print("Paste mode: " .. (vim.opt.paste:get() and "ON" or "OFF"))
end, { desc = "Toggle paste mode" })

-- WSL clipboard (from .vimrc)
map("v", "<leader>y", ":w !clip.exe<CR>", { desc = "Copy to Windows clipboard" })

-- Buffer navigation (from .vimrc)
map("n", "t", ":enew<CR>", { desc = "New buffer" })
map("n", "<leader>l", ":bnext<CR>", { desc = "Next buffer" })
map("n", "<leader>h", ":bprevious<CR>", { desc = "Previous buffer" })
map("n", "<leader>d", ":bdelete<CR>", { desc = "Delete buffer" })
map("n", "<leader>bq", ":bp <BAR> bd #<CR>", { desc = "Close buffer and move to previous" })
map("n", "<leader>bl", ":ls<CR>", { desc = "List all buffers" })

-- Git bindings (from .vimrc fugitive section)
map("n", "<leader>ga", ":Git add %:p<CR><CR>", { desc = "Git add current file" })
map("n", "<leader>gs", ":Git status<CR>", { desc = "Git status" })
map("n", "<leader>gc", ":Git commit -v -q<CR>", { desc = "Git commit" })
map("n", "<leader>gt", ":Git commit -v -q %:p<CR>", { desc = "Git commit current file" })
map("n", "<leader>gd", ":Gdiff<CR>", { desc = "Git diff" })
map("n", "<leader>ge", ":Gedit<CR>", { desc = "Git edit" })
map("n", "<leader>gr", ":Gread<CR>", { desc = "Git read" })
map("n", "<leader>gw", ":Gwrite<CR><CR>", { desc = "Git write" })
map("n", "<leader>gl", ":silent! Glog<CR>:bot copen<CR>", { desc = "Git log" })
map("n", "<leader>gpr", ":Ggrep ", { desc = "Git grep" })
map("n", "<leader>gm", ":Gmove ", { desc = "Git move" })
map("n", "<leader>gb", ":Git branch ", { desc = "Git branch" })
map("n", "<leader>go", ":Git checkout ", { desc = "Git checkout" })
map("n", "<leader>gps", ":Git push<CR>", { desc = "Git push" })
map("n", "<leader>gpl", ":Git pull<CR>", { desc = "Git pull" })
map("n", "<leader>gp", ":Git push<CR>", { desc = "Git push" })

-- Windows-like clipboard (from .vimrc)
map("v", "<C-x>", '"+x', { desc = "Cut to clipboard" })
map("v", "<C-c>", '"+y', { desc = "Copy to clipboard" })
map("c", "<C-v>", '<C-r>+', { desc = "Paste from clipboard" })

-- LSP keybindings (keeping useful ones)
map("n", "gd", ":lua vim.lsp.buf.definition()<CR>", { desc = "Go to definition" })
map("n", "gD", ":lua vim.lsp.buf.declaration()<CR>", { desc = "Go to declaration" })
map("n", "gi", ":lua vim.lsp.buf.implementation()<CR>", { desc = "Go to implementation" })
map("n", "gr", ":lua vim.lsp.buf.references()<CR>", { desc = "Show references" })
map("n", "K", ":lua vim.lsp.buf.hover()<CR>", { desc = "Show hover information" })
map("n", "<C-k>", ":lua vim.lsp.buf.signature_help()<CR>", { desc = "Show signature help" })

-- Code actions and formatting
map("n", "<leader>ca", ":lua vim.lsp.buf.code_action()<CR>", { desc = "Code actions" })
map("n", "<leader>rn", ":lua vim.lsp.buf.rename()<CR>", { desc = "Rename symbol" })
map("n", "<leader>f", ":lua vim.lsp.buf.format()<CR>", { desc = "Format document" })

-- Diagnostics
map("n", "[d", ":lua vim.diagnostic.goto_prev()<CR>", { desc = "Previous diagnostic" })
map("n", "]d", ":lua vim.diagnostic.goto_next()<CR>", { desc = "Next diagnostic" })
map("n", "<leader>e", ":lua vim.diagnostic.open_float()<CR>", { desc = "Show diagnostics" })

-- Telescope (replacing some functionality)
map("n", "<leader>ff", ":Telescope find_files<CR>", { desc = "Find files" })
map("n", "<leader>fg", ":Telescope live_grep<CR>", { desc = "Live grep" })
map("n", "<leader>fb", ":Telescope buffers<CR>", { desc = "Buffers" })
map("n", "<leader>fh", ":Telescope help_tags<CR>", { desc = "Help tags" })

-- Terminal toggle
map("n", "<leader>t", ":ToggleTerm<CR>", { desc = "Toggle terminal" })
map("t", "<leader>t", "<C-\\><C-n>:ToggleTerm<CR>", { desc = "Toggle terminal" })

-- Database UI
map("n", "<leader>db", ":DBUIToggle<CR>", { desc = "Toggle database UI" })

-- Mason LSP management
map("n", "<leader>m", ":Mason<CR>", { desc = "Open Mason" })

-- WordPress specific shortcuts
map("n", "<leader>wp", ":e wp-config.php<CR>", { desc = "Edit wp-config" })
map("n", "<leader>wf", ":e functions.php<CR>", { desc = "Edit functions.php" })

-- Markdown preview
map("n", "<leader>mp", ":MarkdownPreview<CR>", { desc = "Markdown preview" })
map("n", "<leader>ms", ":MarkdownPreviewStop<CR>", { desc = "Stop markdown preview" })
