-- lsp.lua
local mason = require("mason")
local mason_lspconfig = require("mason-lspconfig")
local cmp = require("cmp")

-- Mason setup for automatic LSP server installation
mason.setup({
  ui = {
    icons = {
      package_installed = "✓",
      package_pending = "➜",
      package_uninstalled = "✗"
    }
  }
})

-- LSP servers to install and configure
local servers = {
  "html",           -- HTML
  "cssls",          -- CSS
  "somesass_ls",    -- Sass/SCSS (fixed name)
  "ts_ls",          -- TypeScript/JavaScript (updated from deprecated tsserver)
  "eslint",         -- ESLint
  "jsonls",         -- JSON
  "bashls",         -- Bash
  "intelephense",   -- PHP
  "pyright",        -- Python (more reliable than pylsp)
  "dockerls",       -- Docker
  "sqlls",          -- SQL
  "emmet_ls",       -- Emmet
}

mason_lspconfig.setup({
  ensure_installed = servers,
  automatic_installation = true,
})

-- Enhanced autocompletion setup
local luasnip = require("luasnip")
require("luasnip.loaders.from_vscode").lazy_load()

-- Setup cmp-path with specific options
local cmp_path = require("cmp_path")

cmp.setup({
  completion = {
    completeopt = 'menu,menuone,noinsert',
  },
  experimental = {
    ghost_text = true,
  },
  snippet = {
    expand = function(args)
      luasnip.lsp_expand(args.body)
    end,
  },
  window = {
    completion = cmp.config.window.bordered(),
    documentation = cmp.config.window.bordered(),
  },
  mapping = cmp.mapping.preset.insert({
    ["<C-b>"] = cmp.mapping.scroll_docs(-4),
    ["<C-f>"] = cmp.mapping.scroll_docs(4),
    ["<C-Space>"] = cmp.mapping.complete(),
    ["<C-e>"] = cmp.mapping.abort(),
    ["<CR>"] = cmp.mapping.confirm({ select = true }),
    ["<Tab>"] = cmp.mapping(function(fallback)
      if cmp.visible() then
        cmp.select_next_item()
      elseif luasnip.expand_or_jumpable() then
        luasnip.expand_or_jump()
      else
        fallback()
      end
    end, { "i", "s" }),
    ["<S-Tab>"] = cmp.mapping(function(fallback)
      if cmp.visible() then
        cmp.select_prev_item()
      elseif luasnip.jumpable(-1) then
        luasnip.jump(-1)
      else
        fallback()
      end
    end, { "i", "s" }),
  }),
  sources = cmp.config.sources({
    { name = "nvim_lsp", priority = 1000 },
    { name = "luasnip", priority = 750 },
    {
      name = "path",
      priority = 500,
      option = {
        trailing_slash = true,
        label_trailing_slash = true,
        get_cwd = function(params)
          return vim.fn.expand(('#%d:p:h'):format(params.context.bufnr))
        end,
      }
    },
    { name = "buffer", priority = 250 },
    { name = "vim-dadbod-completion", priority = 100 },
  }),
  formatting = {
    format = function(entry, vim_item)
      vim_item.menu = ({
        nvim_lsp = "[LSP]",
        luasnip = "[Snippet]",
        buffer = "[Buffer]",
        path = "[Path]",
      })[entry.source.name]
      return vim_item
    end
  },
})

-- Command line completion
cmp.setup.cmdline('/', {
  mapping = cmp.mapping.preset.cmdline(),
  sources = {
    { name = 'buffer' }
  }
})

cmp.setup.cmdline(':', {
  mapping = cmp.mapping.preset.cmdline(),
  sources = cmp.config.sources({
    { name = 'path' }
  }, {
    { name = 'cmdline' }
  })
})

local capabilities = require("cmp_nvim_lsp").default_capabilities()

-- LSP server configurations
local on_attach = function(client, bufnr)
  local bufopts = { noremap=true, silent=true, buffer=bufnr }
  vim.keymap.set('n', 'gD', vim.lsp.buf.declaration, bufopts)
  vim.keymap.set('n', 'gd', vim.lsp.buf.definition, bufopts)
  vim.keymap.set('n', 'K', vim.lsp.buf.hover, bufopts)
  vim.keymap.set('n', 'gi', vim.lsp.buf.implementation, bufopts)
  vim.keymap.set('n', '<C-k>', vim.lsp.buf.signature_help, bufopts)
  vim.keymap.set('n', '<leader>wa', vim.lsp.buf.add_workspace_folder, bufopts)
  vim.keymap.set('n', '<leader>wr', vim.lsp.buf.remove_workspace_folder, bufopts)
  vim.keymap.set('n', '<leader>D', vim.lsp.buf.type_definition, bufopts)
  vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, bufopts)
  vim.keymap.set('n', '<leader>ca', vim.lsp.buf.code_action, bufopts)
  vim.keymap.set('n', 'gr', vim.lsp.buf.references, bufopts)
  vim.keymap.set('n', '<leader>f', function() vim.lsp.buf.format { async = true } end, bufopts)
end

-- Configure each LSP server (using vim.lsp.config API for nvim-lspconfig v3.0+)
local function setup_lsp_server(server_name, config)
  local default_config = {
    capabilities = capabilities,
    on_attach = on_attach,
  }

  if config then
    default_config = vim.tbl_deep_extend("force", default_config, config)
  end

  -- Use the new vim.lsp.config API
  vim.lsp.config(server_name, default_config)
end

-- Setup all servers with default configuration
for _, server in ipairs(servers) do
  if server == "emmet_ls" then
    setup_lsp_server("emmet_ls", {
      filetypes = { "html", "css", "scss", "javascript", "javascriptreact", "typescript", "typescriptreact", "php" },
    })
  elseif server == "pyright" then
    setup_lsp_server("pyright", {
      settings = {
        python = {
          analysis = {
            autoSearchPaths = true,
            useLibraryCodeForTypes = true,
            diagnosticMode = "workspace",
          },
        },
      },
    })
  elseif server == "intelephense" then
    setup_lsp_server("intelephense", {
      settings = {
        intelephense = {
          stubs = {
            "bcmath", "bz2", "calendar", "Core", "curl", "date", "dba", "dom", "enchant",
            "fileinfo", "filter", "ftp", "gd", "gettext", "hash", "iconv", "imap", "intl",
            "json", "ldap", "libxml", "mbstring", "mcrypt", "mysql", "mysqli", "password",
            "pcntl", "pcre", "PDO", "pdo_mysql", "Phar", "readline", "recode", "Reflection",
            "regex", "session", "SimpleXML", "soap", "sockets", "sodium", "SPL", "standard",
            "superglobals", "sysvsem", "sysvshm", "tokenizer", "xml", "xdebug", "xmlreader",
            "xmlwriter", "yaml", "zip", "zlib", "wordpress"
          },
        },
      },
    })
  elseif server == "ts_ls" then
    setup_lsp_server("ts_ls", {
      settings = {
        typescript = {
          inlayHints = {
            includeInlayParameterNameHints = 'all',
            includeInlayParameterNameHintsWhenArgumentMatchesName = false,
            includeInlayFunctionParameterTypeHints = true,
            includeInlayVariableTypeHints = true,
            includeInlayPropertyDeclarationTypeHints = true,
            includeInlayFunctionLikeReturnTypeHints = true,
            includeInlayEnumMemberValueHints = true,
          }
        },
        javascript = {
          inlayHints = {
            includeInlayParameterNameHints = 'all',
            includeInlayParameterNameHintsWhenArgumentMatchesName = false,
            includeInlayFunctionParameterTypeHints = true,
            includeInlayVariableTypeHints = true,
            includeInlayPropertyDeclarationTypeHints = true,
            includeInlayFunctionLikeReturnTypeHints = true,
            includeInlayEnumMemberValueHints = true,
          }
        }
      }
    })
  else
    -- Default setup for other servers
    setup_lsp_server(server)
  end
end
