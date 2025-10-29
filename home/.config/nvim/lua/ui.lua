-- ui.lua

-- Catppuccin theme is now set in plugins.lua

-- Neo-tree (VS Code-like file explorer)
require("neo-tree").setup({
  close_if_last_window = false,
  popup_border_style = "rounded",
  enable_git_status = true,
  enable_diagnostics = true,
  window = {
    position = "left",
    width = 30,
    mapping_options = {
      noremap = true,
      nowait = true,
    },
  },
  filesystem = {
    visible = true,
    hide_dotfiles = false,
    hide_gitignored = false,
    hide_hidden = false,
    follow_current_file = {
      enabled = true,
    },
    use_libuv_file_watcher = true,
  },
  buffers = {
    follow_current_file = {
      enabled = true,
    },
  },
  git_status = {
    symbols = {
      added     = "✚",
      modified  = "",
      deleted   = "✖",
      renamed   = "",
      untracked = "",
      ignored   = "",
      unstaged  = "",
      staged    = "",
      conflict  = "",
    }
  },
})

-- Enhanced Lualine (status line) with Catppuccin theme
require("lualine").setup({
  options = {
    theme = 'catppuccin',
    component_separators = { left = '', right = ''},
    section_separators = { left = '', right = ''},
    icons_enabled = true,
    globalstatus = true,
    disabled_filetypes = {
      statusline = {'neo-tree', 'alpha'},
      winbar = {},
    },
    refresh = {
      statusline = 1000,
      tabline = 1000,
      winbar = 1000,
    }
  },
  sections = {
    lualine_a = {
      {
        'mode',
        fmt = function(str)
          return str:sub(1,1)
        end
      }
    },
    lualine_b = {
      'branch',
      {
        'diff',
        symbols = {added = ' ', modified = ' ', removed = ' '},
        diff_color = {
          added = { fg = '#a6e3a1' },
          modified = { fg = '#f9e2af' },
          removed = { fg = '#f38ba8' }
        },
      },
      {
        'diagnostics',
        sources = { 'nvim_diagnostic', 'nvim_lsp' },
        symbols = {error = ' ', warn = ' ', info = ' ', hint = ' '},
        diagnostics_color = {
          error = { fg = '#f38ba8' },
          warn  = { fg = '#f9e2af' },
          info  = { fg = '#89b4fa' },
          hint  = { fg = '#a6e3a1' },
        },
      }
    },
    lualine_c = {
      {
        'filename',
        file_status = true,
        newfile_status = true,
        path = 1,
        shorting_target = 40,
        symbols = {
          modified = '●',
          readonly = '',
          unnamed = '[No Name]',
          newfile = '[New]',
        }
      }
    },
    lualine_x = {
      {
        'encoding',
        fmt = string.upper,
      },
      {
        'fileformat',
        symbols = {
          unix = 'LF',
          dos = 'CRLF',
          mac = 'CR',
        }
      },
      'filetype'
    },
    lualine_y = {
      'progress',
      {
        'location',
        padding = { left = 0, right = 1 }
      }
    },
    lualine_z = {
      function()
        local lines = vim.api.nvim_buf_line_count(0)
        return string.format('☰ %d', lines)
      end
    }
  },
  inactive_sections = {
    lualine_a = {},
    lualine_b = {},
    lualine_c = {
      {
        'filename',
        file_status = true,
        path = 1
      }
    },
    lualine_x = {'location'},
    lualine_y = {},
    lualine_z = {}
  },
  tabline = {},
  winbar = {},
  inactive_winbar = {},
  extensions = {'neo-tree', 'toggleterm', 'mason', 'lazy'}
})

-- Enhanced Bufferline (VS Code-like tabs)
require("bufferline").setup({
  options = {
    mode = "buffers",
    style_preset = require("bufferline").style_preset.default,
    themable = true,
    numbers = "none",
    close_command = "bdelete! %d",
    right_mouse_command = "bdelete! %d",
    left_mouse_command = "buffer %d",
    middle_mouse_command = nil,
    indicator = {
      icon = '▎',
      style = 'icon',
    },
    buffer_close_icon = '󰅖',
    modified_icon = '●',
    close_icon = '',
    left_trunc_marker = '',
    right_trunc_marker = '',
    max_name_length = 18,
    max_prefix_length = 15,
    truncate_names = true,
    tab_size = 21,
    diagnostics = "nvim_lsp",
    diagnostics_update_in_insert = false,
    diagnostics_indicator = function(count, level, diagnostics_dict, context)
      local icon = level:match("error") and " " or " "
      return " " .. icon .. count
    end,
    color_icons = true,
    show_buffer_icons = true,
    show_buffer_close_icons = true,
    show_close_icon = true,
    show_tab_indicators = true,
    show_duplicate_prefix = true,
    persist_buffer_sort = true,
    separator_style = "thin",
    enforce_regular_tabs = false,
    always_show_bufferline = true,
    hover = {
      enabled = true,
      delay = 200,
      reveal = {'close'}
    },
    sort_by = 'insert_after_current',
    offsets = {
      {
        filetype = "neo-tree",
        text = " File Explorer",
        text_align = "left",
        separator = true,
        highlight = "Directory"
      }
    },
    custom_filter = function(buf_number, buf_numbers)
      -- Filter out certain filetypes
      local filetype = vim.bo[buf_number].filetype
      if filetype == "qf" or filetype == "help" then
        return false
      end
      return true
    end,
  },
  highlights = {}
})

-- Terminal integration
require("toggleterm").setup({
  size = 20,
  open_mapping = [[<c-\>]],
  hide_numbers = true,
  shade_terminals = true,
  start_in_insert = true,
  insert_mappings = true,
  persist_size = true,
  direction = "horizontal",
  close_on_exit = true,
  shell = vim.o.shell,
})

-- Autopairs
require("nvim-autopairs").setup({
  check_ts = true,
  ts_config = {
    lua = {'string'},
    javascript = {'template_string'},
  }
})

-- Auto-tag for HTML/JSX
require("nvim-ts-autotag").setup({
  filetypes = { "html", "xml", "javascript", "typescript", "javascriptreact", "typescriptreact", "php" },
})

-- Git signs
require("gitsigns").setup({
  signs = {
    add = { text = '+' },
    change = { text = '~' },
    delete = { text = '_' },
    topdelete = { text = '‾' },
    changedelete = { text = '~' },
  },
})

-- Indent guides
require("ibl").setup({
  indent = {
    char = "│",
    tab_char = "│",
  },
  scope = { enabled = false },
  exclude = {
    filetypes = {
      "help",
      "alpha",
      "dashboard",
      "neo-tree",
      "Trouble",
      "trouble",
      "lazy",
      "mason",
      "notify",
      "toggleterm",
      "lazyterm",
    },
  },
})

-- Comments
require("Comment").setup()

-- Color highlighter
require("colorizer").setup()

-- Which-key
require("which-key").setup({
  plugins = {
    marks = true,
    registers = true,
    spelling = {
      enabled = true,
      suggestions = 20,
    },
  },
})

-- Alpha (start screen)
local alpha = require("alpha")
local dashboard = require("alpha.themes.dashboard")

dashboard.section.header.val = {
  "                                                     ",
  "  ███╗   ██╗███████╗ ██████╗ ██╗   ██╗██╗███╗   ███╗ ",
  "  ████╗  ██║██╔════╝██╔═══██╗██║   ██║██║████╗ ████║ ",
  "  ██╔██╗ ██║█████╗  ██║   ██║██║   ██║██║██╔████╔██║ ",
  "  ██║╚██╗██║██╔══╝  ██║   ██║╚██╗ ██╔╝██║██║╚██╔╝██║ ",
  "  ██║ ╚████║███████╗╚██████╔╝ ╚████╔╝ ██║██║ ╚═╝ ██║ ",
  "  ╚═╝  ╚═══╝╚══════╝ ╚═════╝   ╚═══╝  ╚═╝╚═╝     ╚═╝ ",
  "                                                     ",
  "    🚀 Ready for WordPress & Web Development! 🚀    ",
}

dashboard.section.buttons.val = {
  dashboard.button("f", "  Find file", ":Telescope find_files <CR>"),
  dashboard.button("e", "  New file", ":ene <BAR> startinsert <CR>"),
  dashboard.button("p", "  Find project", ":Telescope projects <CR>"),
  dashboard.button("r", "  Recently used files", ":Telescope oldfiles <CR>"),
  dashboard.button("t", "  Find text", ":Telescope live_grep <CR>"),
  dashboard.button("c", "  Configuration", ":e ~/.config/nvim/init.lua <CR>"),
  dashboard.button("q", "  Quit Neovim", ":qa<CR>"),
}

alpha.setup(dashboard.opts)

-- Satellite (minimap alternative) - Disabled in favor of nvim-scrollview
-- require("satellite").setup({
--   current_only = false,
--   winblend = 50,
--   zindex = 40,
--   excluded_filetypes = {
--     "prompt",
--     "TelescopePrompt",
--     "noice",
--     "notify",
--     "neo-tree",
--   },
--   width = 2,
--   handlers = {
--     cursor = {
--       symbols = { '⎺', '⎻', '⎼', '⎽' }
--     },
--     search = {
--       enable = true,
--     },
--     diagnostic = {
--       enable = true,
--       signs = {'-', '=', '≡'},
--     },
--     gitsigns = {
--       enable = true,
--       signs = {
--         add = "│",
--         change = "│",
--         delete = "-",
--       },
--     },
--     marks = {
--       enable = true,
--       show_builtins = false,
--     },
--   },
-- })
