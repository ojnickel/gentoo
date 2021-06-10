"set mouse with Nerdtree
set mouse=a
let g:NERDTreeMouseMode=3
set pastetoggle=<F3>

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
call plug#begin()
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'
Plug 'rafi/awesome-vim-colorschemes'
Plug 'tpope/vim-fugitive'
Plug 'scrooloose/syntastic'
Plug 'tpope/vim-surround'
Plug 'yggdroot/indentline'
Plug 'ryanoasis/vim-devicons'
" -- Web Development
"Plug 'valloric/youcompleteme'
" Use release branch (recommend)
Plug 'neoclide/coc.nvim', {'branch': 'release'}
Plug 'Shutnik/jshint2.vim'
Plug 'mattn/emmet-vim'
Plug 'kchmck/vim-coffee-script'
Plug 'groenewege/vim-less'
Plug 'ap/vim-css-color'
Plug 'hail2u/vim-css3-syntax'
Plug 'digitaltoad/vim-jade'
Plug 'tpope/vim-haml'
Plug 'cakebaker/scss-syntax.vim'
Plug 'jiangmiao/auto-pairs'
Plug 'prettier/vim-prettier', {
  \ 'do': 'npm install',
  \ 'for': ['javascript', 'typescript', 'css', 'less', 'scss', 'json', 'graphql', 'markdown', 'vue', 'php', 'html'] }
Plug 'scrooloose/nerdtree'
Plug 'Xuyuanp/nerdtree-git-plugin'


call plug#end()
" Now we can turn our filetype functionality back on
filetype plugin indent on

" colors and theme
syntax enable
"colorscheme molokai
"colorscheme afterglow
set background=dark    " Setting dark mode
colorscheme gruvbox

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

" coc.nvim setup ============================================================{{{

" color for cursor holding highlight
hi default CocHighlightText guibg=#8a8a8a guifg=#211F1C
hi default CocHighlightText ctermbg=#8a8a8a ctermfg=#211F1C

" fugitive git bindings
nnoremap <leader>ga :Git add %:p<CR><CR>
nnoremap <leader>gs :Gstatus<CR>
nnoremap <leader>gc :Gcommit -v -q<CR>
nnoremap <leader>gt :Gcommit -v -q %:p<CR>
nnoremap <leader>gd :Gdiff<CR>
nnoremap <leader>ge :Gedit<CR>
nnoremap <leader>gr :Gread<CR>
nnoremap <leader>gw :Gwrite<CR><CR>
nnoremap <leader>gl :silent! Glog<CR>:bot copen<CR>
nnoremap <leader>gpr :Ggrep<Space>
nnoremap <leader>gm :Gmove<Space>
nnoremap <leader>gb :Git branch<Space>
nnoremap <leader>go :Git checkout<Space>
nnoremap <leader>gps :Dispatch! git push<CR>
nnoremap <leader>gpl :Dispatch! git pull<CR>
nnoremap <leader>gp :Gpush<CR>
