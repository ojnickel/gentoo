-- Editor enhancement plugins
return {
  -- Fuzzy Finding
  {
    "nvim-telescope/telescope.nvim",
    dependencies = { "nvim-lua/plenary.nvim" },
    config = function()
      require("telescope").setup({
        defaults = {
          layout_config = { height = 0.8, width = 0.9 },
        },
      })
    end,
  },
  { "nvim-telescope/telescope-file-browser.nvim" },

  -- Which key
  { "folke/which-key.nvim" },

  -- Comments
  { "numToStr/Comment.nvim" },

  -- Auto pairs
  { "windwp/nvim-autopairs" },

  -- Color preview
  { "norcalli/nvim-colorizer.lua" },
}
