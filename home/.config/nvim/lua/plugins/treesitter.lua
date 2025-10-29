-- Treesitter configuration
return {
  {
    "nvim-treesitter/nvim-treesitter",
    build = ":TSUpdate",
    config = function()
      require("nvim-treesitter.configs").setup({
        ensure_installed = {
          "html",
          "css",
          "scss",
          "javascript",
          "typescript",
          "php",
          "python",
          "dockerfile",
          "sql",
          "lua",
        },
        auto_install = true,
        highlight = { enable = true },
        indent = { enable = true },
      })
    end,
  },
}
