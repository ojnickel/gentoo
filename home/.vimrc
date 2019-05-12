set noshowmode
set ts=4
set cursorline
set cursorcolumn
"hi CursorLine   cterm=NONE ctermbg=darkgrey ctermfg=white guibg=darkred guifg=white
hi CursorColumn cterm=NONE ctermbg=darkgrey ctermfg=white guibg=darkred guifg=white
nnoremap <Leader>c :set cursorline! cursorcolumn!<CR>
set number
" indentation
set expandtab       " use spaces instead of tabs
set autoindent      " autoindent based on line above, works most of the time
set smartindent     " smarter indent for C-like languages
set shiftwidth=4    " when reading, tabs are 4 spaces
set softtabstop=4   " in insert mode, tabs are 4 spaces

set nocompatible
filetype off
set rtp+=~/.vim/bundle/vundle/
call vundle#rc()

" This is the Vundle package, which can be found on GitHub.
" do: # git clone https://github.com/gmarik/vundle.git ~/.vim/bundle/vundle
" For GitHub repos, you specify plugins using the
" 'user/repository' format
Plugin 'gmarik/vundle'
Plugin 'vim-airline/vim-airline'
Plugin 'vim-airline/vim-airline-themes'
Plugin 'flazz/vim-colorschemes'
Plugin 'tpope/vim-fugitive'
Plugin 'scrooloose/syntastic'
Plugin 'tpope/vim-surround'
Plugin 'yggdroot/indentline'
Plugin 'ryanoasis/vim-devicons'
" -- Web Development
" Plugin 'valloric/youcompleteme'
Plugin 'Shutnik/jshint2.vim'
Plugin 'mattn/emmet-vim'
Plugin 'kchmck/vim-coffee-script'
Plugin 'groenewege/vim-less'
Plugin 'ap/vim-css-color'
Plugin 'hail2u/vim-css3-syntax'
Plugin 'digitaltoad/vim-jade'
Plugin 'tpope/vim-haml'


" We could also add repositories with a ".git" extension
Plugin 'scrooloose/nerdtree.git'
Plugin 'Xuyuanp/nerdtree-git-plugin'

" To get plugins from Vim Scripts, you can reference the plugin
" by name as it appears on the site
Plugin 'Buffergator'

" Now we can turn our filetype functionality back on
filetype plugin indent on

" colors and theme
syntax enable
colorscheme molokai

" Give a shortcut key to NERD Tree
map <F2> :NERDTreeToggle<CR>
"Show hidden files in NerdTree
let NERDTreeShowHidden=1

" set mapleader
let mapleader = "-"

"exit
nmap <leader>q :q!<CR>
" save
nmap <leader>w :w<CR>
nmap <leader>x :x<CR>

"autopen NERDTree and focus cursor in new document
"autocmd VimEnter * NERDTree
"autocmd VimEnter * wincmd p

" indentation
set expandtab       " use spaces instead of tabs
set autoindent      " autoindent based on line above, works most of the time
set smartindent     " smarter indent for C-like languages
set shiftwidth=4    " when reading, tabs are 4 spaces
set softtabstop=4   " in insert mode, tabs are 4 spaces

" windows like clipboard
" yank to and paste from the clipboard without prepending "* to commands
let &clipboard = has('unnamedplus') ? 'unnamedplus' : 'unnamed'
" map c-x and c-v to work as they do in windows, only in insert mode
vm <c-x> "+x
vm <c-c> "+y
cno <c-v> <c-r>+
exe 'ino <script> <C-V>' paste#paste_cmd['i']

 " switch between buffers
" nnoremap <Leader>h <C-w>h 
" nnoremap <Leader>l <C-w>l 
" nnoremap <Leader>j <C-w>j
" nnoremap <Leader>k <C-w>k
" nnoremap <Leader>s <C-w>w
"
" no lines longer than 80 cols
set textwidth=80

" for vim-devicons
set encoding=utf-8
set guifont=DroidSansMono\ Nerd\ Font\ 14
" required if using https://github.com/bling/vim-airline
let g:airline_powerline_fonts=1
" wait for mapkeys
set notimeout
set nottimeout

" expander for emmet
imap <expr> <tab> emmet#expandAbbrIntelligent("\<tab>")

"tabs
" Enable the list of buffers
let g:airline#extensions#tabline#enabled = 1

" Show just the filename
let g:airline#extensions#tabline#fnamemod = ':t'

" This allows buffers to be hidden if you've modified a buffer.
" This is almost a must if you wish to use buffers in this way.
set hidden

" To open a new empty buffer
" This replaces :tabnew which I used to bind to this mapping
nmap t :enew<cr>

" Move to the next buffer
nmap <leader>l :bnext<CR>

" Move to the previous buffer
nmap <leader>h :bprevious<CR>

nmap <leader>d :bdelete<CR>

" Close the current buffer and move to the previous one
" This replicates the idea of closing a tab
nmap <leader>bq :bp <BAR> bd #<CR>

" Show all open buffers and their status
nmap <leader>bl :ls<CR>

let g:user_emmet_settings = {
  \  'css' : {
  \    'extends' : 'css',
  \    'filters' : 'fc',
  \    'snippets' : {
  \             'mqm': "@media screen and (min-width:${1}) {\n\t|\n}",
  \    		'mqx': "@media screen and (max-width:${1}) {\n\t|\n}",
  \    		'mqmx': "@media screen and (min-width:${1}) and (max-width:${1}) {\n\t|\n}",
  \    		'by': "body {\n\t${1} |\n}",
  \	},
  \
  \  },
  \}

