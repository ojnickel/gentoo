# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH

# Path to your oh-my-zsh installation.
export ZSH=$HOME/.oh-my-zsh

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time oh-my-zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/robbyrussell/oh-my-zsh/wiki/Themes
#^ZSH_THEME="wild-cherry"
ZSH_THEME="powerlevel10k/powerlevel10k"
#ZSH_THEME="remy"
#ZSH_THEME="agnoster"

# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random will cause zsh to load
# a theme from this variable instead of looking in ~/.oh-my-zsh/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )


##Powerlevel9k config
#POWERLEVEL9K_MODE="nerdfont-complete"
#POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(os_icon user host dir vcs)
#POWERLEVEL9K_LINUX_GENTOO_ICON="\uF30d"
#POWERLEVEL9K_HOME_ICON="\uF7DC"
#POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(status time)
##POWERLEVEL9K_MULTILINE_FIRST_PROMPT_PREFIX=''
##POWERLEVEL9K_MULTILINE_LAST_PROMPT_PREFIX="%K{white}%F{black} \UF017 `date +%T` %f%k%F{white}%f "
##POWERLEVEL9K_MULTILINE_FIRST_PROMPT_PREFIX=""
#
#POWERLEVEL9K_MULTILINE_FIRST_PROMPT_PREFIX="%F{white}\u256D\u2500%f"
#POWERLEVEL9K_MULTILINE_LAST_PROMPT_PREFIX="%F{white}\u2570\uf460%f "
#
#POWERLEVEL9K_SHORTEN_DIR_LENGTH=2
#POWERLEVEL9K_OS_ICON_BACKGROUND="246"
##POWERLEVEL10K_OS_ICON_BACKGROUND="white"
#POWERLEVEL9K_OS_ICON_FOREGROUND="091"
#POWERLEVEL9K_DIR_HOME_BACKGROUND="black"
#POWERLEVEL9K_DIR_HOME_FOREGROUND="white"
#POWERLEVEL9K_DIR_HOME_SUBFOLDER_BACKGROUND="blue"
#POWERLEVEL9K_DIR_HOME_SUBFOLDER_FOREGROUND="black"
#POWERLEVEL9K_DIR_DEFAULT_BACKGROUND="green"
#POWERLEVEL9K_DIR_DEFAULT_FOREGROUND="black"
#POWERLEVEL9K_USER_DEFAULT_FOREGROUND="019" #blue
#POWERLEVEL9K_USER_DEFAULT_BACKGROUND="002" #green
#POWERLEVEL9K_PROMPT_ON_NEWLINE=true
#POWERLEVEL9K_PROMPT_ADD_NEWLINE=true
#POWERLEVEL9K_LEFT_SEGMENT_SEPARATOR=$'\uF12E'
#POWERLEVEL9K_RIGHT_SEGMENT_SEPARATOR=$'\uE0C2'

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to automatically update without prompting.
# DISABLE_UPDATE_PROMPT="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS=true

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
 ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
 HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load?
# Standard plugins can be found in ~/.oh-my-zsh/plugins/*
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(
	git
  zsh-syntax-highlighting
  zsh-autosuggestions
  zsh-history-substring-search
)

source $ZSH/oh-my-zsh.sh

# Keybindings for zsh-history-substring-search
bindkey '^[[A' history-substring-search-up
bindkey '^[[B' history-substring-search-down

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"
#alias world="emerge -avDN world && grub-mkconfig -o /boot/grub/grub.cfg"
alias world="emerge -avDN world" 
#mkdir and cd into it
mkcd() { mkdir -p $1; cd $1 }

alias lst='ls -R | grep ":$" | sed -e '"'"'s/:$//'"'"' -e '"'"'s/[^-][^\/]*\//--/g'"'"' -e '"'"'s/^/   /'"'"' -e '"'"'s/-/|/'"'"
#list only dirs
#alias ld="ls -d */"
alias ld="eza -algDs size"

#rme -> remove al except some files
rme () {
    i=0
    for f in $@; do
        mv $f ..
    done
    rm * -rvf
    for f in $@; do
        mv ../$f ./ -v
    done
}

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

alias x="exit"
#alias upos="mount /boot && mount /boot/efi && eix-sync && emerge -uavDN world"
function upgentoo (){
    echo "mounting boot..."
    sleep 1
    mount /boot
    echo "mounting EFI..."
    sleep 1
    mount /boot/efi
    echo "updating package DB..."
    sleep 1
    eix-sync
    echo "updating OS..."
    #emerge -uavDN world && echo "udating boot menu" && grub-mkconfig -o /boot/grub/grub.cfg
    emerge -uavDN world 
}
alias lsa="eza -algT"
alias l="eza -alg"

#function portage () {
    #local use_keyword=""
    #local package=""
    #local flags=""

    ## Parse options
    #while [[ "$#" -gt 0 ]]; do
        #case $1 in
            #"-u")
                #use_keyword="use/packages"
                #;;
            #"-k")
                #use_keyword="accept_keywords"
                #;;
            #"-h")
                #echo "Usage: $0 [-u|-k] -p package"
                #return
                #;;
            #*)
                #echo "Unknown option: $1"
                #return
                #;;
        #esac
        #shift
    #done

    ## Interactively select package using fzf if not specified
    #if [[ -z "$package" ]]; then
        #echo "Select a package (start typing to search):"
        #package=$(find /usr/portage/ -mindepth 2 -maxdepth 2 -type d | sed 's/\/usr\/portage\///' | fzf)
        
        #if [[ -z "$package" ]]; then
            #echo "No package selected. Exiting."
            #return
        #fi
    #fi

    ## Prompt for flags/keywords if a package and option are set
    #if [[ -n "$package" && -n "$use_keyword" ]]; then
        #echo "Setting $use_keyword for $package."
        #echo "Please enter your desired flags or keywords (comma-separated):"
        #read -p "> " flags

        ## Apply the changes
        #if [[ "$use_keyword" == "use/packages" ]]; then
            #echo "$package $flags" | sudo tee -a /etc/portage/package.use
        #elif [[ "$use_keyword" == "accept_keywords" ]]; then
            #echo "$package $flags" | sudo tee -a /etc/portage/package.accept_keywords
        #fi

        #echo "Updated $use_keyword for $package."
    #else
        #echo "Error: Both -u or -k option is required."
    #fi
#}
#function portage () {
    #local use_keyword=""
    #local package=""
    #local flags=""

    ## Parse options
    #while [[ "$#" -gt 0 ]]; do
        #case $1 in
            #"-u")
                #use_keyword="use/packages"
                #;;
            #"-k")
                #use_keyword="accept_keywords"
                #;;
            #"-h")
                #echo "Usage: $0 [-u|-k] -p package"
                #return
                #;;
            #*)
                #echo "Unknown option: $1"
                #return
                #;;
        #esac
        #shift
    #done

    ## Interactively select package using fzf if not specified
    #if [[ -z "$package" ]]; then
        #echo "Select a package (start typing to search):"
        #package=$(find /usr/portage/ -mindepth 2 -maxdepth 2 -type d | sed 's/\/usr\/portage\///' | fzf)
        
        #if [[ -z "$package" ]]; then
            #echo "No package selected. Exiting."
            #return
        #fi
    #fi

    ## Prompt for flags/keywords if a package and option are set
    #if [[ -n "$package" && -n "$use_keyword" ]]; then
        #echo "Setting $use_keyword for $package."
        #echo "Please enter your desired flags or keywords (comma-separated):"
        #read -p "> " flags

        ## Apply the changes
        #if [[ "$use_keyword" == "use/packages" ]]; then
            #echo "$package $flags" | sudo tee -a /etc/portage/package.use
        #elif [[ "$use_keyword" == "accept_keywords" ]]; then
            #echo "$package $flags" | sudo tee -a /etc/portage/package.accept_keywords
        #fi

        #echo "Updated $use_keyword for $package."
    #else
        #echo "Error: Both -u or -k option is required."
    #fi
#}

#function portage () {
    #local use_keyword=""
    #local package=""
    #local flags=""

    ## Parse options
    #while [[ "$#" -gt 0 ]]; do
        #case $1 in
            #"-u")
                #shift
                #flags="$1"
                #use_keyword="use/packages"
                #;;
            #"-k")
                #shift
                #flags="$1"
                #use_keyword="accept_keywords"
                #;;
            #"-h")
                #echo "Usage: $0 [-u|-k] -p package"
                #return
                #;;
            #*)
                #echo "Unknown option: $1"
                #return
                #;;
        #esac
        #shift
    #done

    ## Interactively select package using fzf if not specified
    #if [[ -z "$package" ]]; then
        #echo "Select a package (start typing to search):"
        #package=$(find /usr/portage/ -mindepth 2 -maxdepth 2 -type d | sed 's/\/usr\/portage\///' | fzf)

        #if [[ -z "$package" ]]; then
            #echo "No package selected. Exiting."
            #return
        #fi
    #fi

     ##Prompt for flags/keywords if a package and option are set
    #if [[ -n "$package" && -n "$use_keyword" ]]; then
        ##echo "Setting $use_keyword for $package."
        ##echo "Please enter your desired flags or keywords (comma-separated):"
        ##read -p "> " flags

        ## Apply the changes
        #if [[ "$use_keyword" == "use/packages" ]]; then
            #echo "$package $flags" | tee -a /etc/portage/package.use/packages
        #elif [[ "$use_keyword" == "accept_keywords" ]]; then
            #echo "$package $flags" | tee -a /etc/portage/package.accept_keywords
        #fi

        #echo "Updated $use_keyword for $package."
    #else
        #echo "Error: Both -u or -k option is required."
    #fi
#}

function portage() {
    local package=""
    local flags=""
    local config_type=""
    local config_file=""

    # Interactive menu to choose configuration type
    echo "What do you want to configure?"
    echo "1) USE flags"
    echo "2) Accept keywords"
    read -k 1 choice
    echo ""

    case $choice in
        1)
            config_type="USE flags"
            config_file="/etc/portage/package.use/packages"
            ;;
        2)
            config_type="keywords"
            config_file="/etc/portage/package.accept_keywords"
            ;;
        *)
            echo "Invalid choice. Exiting."
            return 1
            ;;
    esac

    # Interactive package selection with fzf
    echo "Select a package (type to search):"
    package=$(find /var/db/repos/gentoo -mindepth 2 -maxdepth 2 -type d 2>/dev/null | \
              sed 's|/var/db/repos/gentoo/||' | \
              fzf --height=50% --border --prompt="Package: " --preview 'echo {}')

    if [[ -z "$package" ]]; then
        echo "No package selected. Exiting."
        return 1
    fi

    # Prompt for flags/keywords
    echo ""
    echo "Selected package: $package"
    echo "Enter $config_type (space-separated):"
    read flags

    if [[ -z "$flags" ]]; then
        echo "No flags provided. Exiting."
        return 1
    fi

    # Confirm before writing
    echo ""
    echo "Will add the following line to $config_file:"
    echo "  $package $flags"
    echo ""
    echo "Proceed? (y/n)"
    read -k 1 confirm
    echo ""

    if [[ "$confirm" == "y" || "$confirm" == "Y" ]]; then
        # Ensure directory exists for package.use
        if [[ "$config_file" == *"package.use"* ]]; then
            mkdir -p "$(dirname "$config_file")" 2>/dev/null
        fi

        echo "$package $flags" >> "$config_file"
        echo "Successfully added to $config_file"
    else
        echo "Cancelled."
        return 1
    fi
}

# free ram -> only cache
alias freemem="sync; echo 3 > /proc/sys/vm/drop_caches"
alias rebuild="emerge -av @preserved-rebuild"
export EDITOR="/usr/bin/vim"

alias i="emerge -av"
alias r="emerge -Cav"
alias dp="emerge -cav"
#sync and ask for updating world
function u () { #action w(orld),a(sk), s(ync): default
    action=$(1:-s)

    echo "Updating..."
    sleep 1
    emaint sync -a 
    if [[ $action = "a" ]]; then
        echo "Upgrade System?"
        read a
        [[ -n $a ]] && emerge -uavDN world
    elif [[ $action = "w" ]]; then
        emerge -uavDN world
    else
        echo "Just syncing..."
    fi

}


# argcomplete for port.py
eval "$(register-python-argcomplete port.py)"
