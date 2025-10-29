-- Language-specific plugins
return {
  -- WordPress specific
  { "dsawardekar/wordpress.vim", ft = "php" },

  -- Markdown
  { "preservim/vim-markdown", ft = "markdown" },
  {
    "iamcco/markdown-preview.nvim",
    ft = "markdown",
    build = "cd app && npm install",
    config = function()
      vim.g.mkdp_auto_close = 0
      vim.g.mkdp_theme = "dark"
    end,
  },

  -- Database
  { "tpope/vim-dadbod" },
  { "kristijanhusak/vim-dadbod-ui" },
  { "kristijanhusak/vim-dadbod-completion" },

  -- Docker
  { "ekalinin/Dockerfile.vim", ft = "dockerfile" },
}
