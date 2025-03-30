#!/bin/bash
set -eo pipefail
trap 'echo "Error on line $LINENO. Exit code $?" >&2' ERR

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENV_NAME="solar-env"
MINICONDA_DIR="$HOME/miniconda3"
NVM_VERSION="v0.39.7"
LOG_FILE="$HOME/setup.log"

# Initialize log file with proper permissions
touch "$LOG_FILE" && chmod 644 "$LOG_FILE"
echo "Solar Energy Prediction System Setup Log" > "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"

# Helper functions
log() {
    local message="$1"
    echo -e "${YELLOW}[INFO]${NC} $message"
    echo "[INFO] $message" >> "$LOG_FILE"
}

success() {
    echo -e "${GREEN}$1${NC}"
    echo "$1" >> "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
    echo "[ERROR] $1" >> "$LOG_FILE"
    exit 1
}

check_command() {
    command -v "$1" >/dev/null 2>&1 || {
        error "Required command $1 not found"
    }
}

# Header
echo -e "${GREEN}"
cat << "EOF"
  _____       _          _____                      _        
 / ____|     | |        |  __ \                    (_)       
| (___   ___ | | ___   _| |__) |___ _ __   ___  ___ _ ___    
 \___ \ / _ \| |/ / | | |  _  // _ \ '_ \ / _ \/ __| / __|   
 ____) | (_) |   <| |_| | | \ \  __/ |_) |  __/\__ \ \__ \   
|_____/ \___/|_|\_\\__, |_|  \_\___| .__/ \___||___/_|___/   
                    __/ |          | |                        
                   |___/           |_|                        
EOF
echo -e "${NC}"

# Check root privileges
if [[ $EUID -eq 0 ]]; then
    error "This script should not be run as root"
fi

# System dependencies
log "Checking system dependencies..."
sudo apt update >> "$LOG_FILE" 2>&1 || {
    echo -e "${YELLOW}[WARN] Failed to update package lists. Continuing anyway...${NC}"
}

declare -a REQUIRED_PKGS=("curl" "wget" "tree" "git" "build-essential")
TO_INSTALL=()

for pkg in "${REQUIRED_PKGS[@]}"; do
    if ! dpkg -s "$pkg" >/dev/null 2>&1; then
        TO_INSTALL+=("$pkg")
    fi
done

if [ ${#TO_INSTALL[@]} -gt 0 ]; then
    log "Installing missing packages: ${TO_INSTALL[*]}..."
    sudo apt-get install -y "${TO_INSTALL[@]}" >> "$LOG_FILE" 2>&1 || {
        echo -e "${RED}[ERROR] Failed to install system packages. Try manually:"
        echo "sudo apt-get install -y ${TO_INSTALL[*]}"
        exit 100
    }
    success "System packages installed"
else
    success "All system dependencies already satisfied"
fi

# Install NVM
install_nvm() {
    log "Installing Node Version Manager (nvm)..."
    export NVM_DIR="$HOME/.nvm"
    mkdir -p "$NVM_DIR"
    curl -sS -o- "https://raw.githubusercontent.com/nvm-sh/nvm/$NVM_VERSION/install.sh" | bash >> "$LOG_FILE" 2>&1
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
}

if ! type nvm &>/dev/null; then
    install_nvm
    success "nvm installed successfully"
else
    success "nvm already installed"
fi

# Setup Node.js
LTS_VERSION=$(nvm version-remote --lts)

if ! nvm ls "$LTS_VERSION" >/dev/null 2>&1; then
    log "Installing Node.js LTS ($LTS_VERSION)..."
    nvm install --lts >> "$LOG_FILE" 2>&1 || error "Failed to install Node.js"
    success "Node.js $LTS_VERSION installed"
else
    success "Node.js $LTS_VERSION already installed"
fi

log "Setting default Node.js version..."
nvm alias default "$LTS_VERSION" >> "$LOG_FILE" 2>&1
nvm use default >> "$LOG_FILE" 2>&1
success "Node.js $LTS_VERSION configured as default"

# Install Miniconda
install_miniconda() {
    log "Installing Miniconda..."
    wget -q "https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh" -O miniconda.sh
    bash miniconda.sh -b -p "$MINICONDA_DIR" >> "$LOG_FILE" 2>&1
    rm miniconda.sh
    
    # Verify installation
    if [ ! -f "$MINICONDA_DIR/bin/conda" ]; then
        error "Miniconda installation failed - conda executable not found"
    fi
}

if ! command -v conda >/dev/null 2>&1; then
    install_miniconda
    success "Miniconda installed successfully at $MINICONDA_DIR"
    
    # Initialize Conda
    log "Initializing Miniconda..."
    eval "$("$MINICONDA_DIR/bin/conda" shell.bash hook)"
    source "$MINICONDA_DIR/etc/profile.d/conda.sh" >> "$LOG_FILE" 2>&1 || {
        error "Failed to initialize Conda"
    }
else
    MINICONDA_DIR=$(dirname $(dirname $(which conda)))
    success "Miniconda already installed at $MINICONDA_DIR"
fi

# Configure Conda environment
log "Configuring Conda environment '$ENV_NAME'..."
if ! conda env list | grep -qw "$ENV_NAME"; then
    log "Creating Conda environment with Python 3.10..."
    conda create --name "$ENV_NAME" python=3.10 -y >> "$LOG_FILE" 2>&1 || {
        error "Failed to create Conda environment"
    }
    success "Conda environment created with Python 3.10"
else
    log "Verifying Python version in Conda environment..."
    env_python="$MINICONDA_DIR/envs/$ENV_NAME/bin/python"
    if [[ ! -f "$env_python" ]] || [[ $("$env_python" --version 2>&1) != *"3.10"* ]]; then
        log "Installing Python 3.10 in existing environment..."
        conda install --name "$ENV_NAME" python=3.10 -y >> "$LOG_FILE" 2>&1 || {
            error "Failed to install Python 3.10 in environment"
        }
        success "Python 3.10 installed in environment"
    else
        success "Conda environment $ENV_NAME already exists with Python 3.10"
    fi
fi

# Initialize and activate environment
log "Initializing Conda..."
eval "$("$MINICONDA_DIR/bin/conda" shell.bash hook)"
source "$MINICONDA_DIR/etc/profile.d/conda.sh" >> "$LOG_FILE" 2>&1 || {
    error "Failed to initialize Conda"
}

log "Activating environment..."
conda activate "$ENV_NAME" >> "$LOG_FILE" 2>&1 || {
    error "Failed to activate environment"
}

# Python dependencies
install_python_deps() {
    log "Searching for Python dependencies..."
    find . -name "requirements.txt" -not -path "*/node_modules/*" -type f -print0 | while IFS= read -r -d '' req_file; do
        log "Installing Python packages from $req_file..."
        (
            eval "$("$MINICONDA_DIR/bin/conda" shell.bash hook)"
            source "$MINICONDA_DIR/etc/profile.d/conda.sh" || error "Conda initialization failed"
            
            conda activate "$ENV_NAME" || error "Failed to activate $ENV_NAME in subshell"
            
            py_path=$(which python)
            log "Using Python from: $py_path"
            
            cd "$(dirname "$req_file")" || error "Failed to enter directory: $(dirname "$req_file")"
            log_file_section="DEPENDENCIES_$(echo "$req_file" | tr './' '_')"
            {
                echo "=== STARTING INSTALLATION FROM $req_file ==="
                echo "Python version: $(python --version)"
                echo "Pip version: $(python -m pip --version)"
                python -m pip install --no-cache-dir -r "$(basename "$req_file")" \
                    --break-system-packages
                echo "=== INSTALLATION COMPLETED ==="
            } >> "$LOG_FILE" 2>&1 || {
                error "Failed to install Python packages from $req_file\nCheck lines with '$log_file_section' in $LOG_FILE"
            }
            success "Successfully installed packages from $req_file"
        )
    done
    success "All Python dependencies processed"
}
install_python_deps

# Node.js dependencies
install_node_deps() {
    log "Searching for Node.js dependencies..."
    find . -name "package.json" -not -path "*/node_modules/*" -type f -print0 | while IFS= read -r -d '' pkg_file; do
        dir=$(dirname "$pkg_file")
        log "Processing Node.js dependencies in $dir..."
        
        (
            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
            nvm use default || error "Failed to load Node.js version"
            
            cd "$dir" || error "Failed to enter directory: $dir"
            
            if [ ! -f "package-lock.json" ] && [ ! -f "yarn.lock" ]; then
                log "No lockfile found, generating..."
                npm install --package-lock-only --legacy-peer-deps >> "$LOG_FILE" 2>&1 || {
                    error "Failed to generate lockfile in $dir"
                }
            fi

            {
                echo "=== STARTING NPM INSTALLATION IN $dir ==="
                npm ci --no-audit --loglevel verbose --legacy-peer-deps
                echo "=== INSTALLATION COMPLETED ==="
            } >> "$LOG_FILE" 2>&1 || {
                error "Failed to install Node.js dependencies in $dir\nCheck full log at: $LOG_FILE"
            }
            
            success "Dependencies installed in $dir"
        )
    done
    success "All Node.js dependencies processed"
}
install_node_deps

# Generate project tree
generate_project_tree() {
    log "Generating project structure documentation..."
    exclude_patterns=(
        ".git|node_modules|.conda|__pycache__|dist|build|*.egg-info|.vscode|.idea|.DS_Store"
    )
    echo -e "# Project Structure\n\n\`\`\`plaintext" > PROJECT_TREE.md
    tree -a -I "${exclude_patterns[*]}" >> PROJECT_TREE.md
    echo -e "\`\`\`" >> PROJECT_TREE.md
    success "Project structure documentation generated"
}

if [ ! -f "PROJECT_TREE.md" ] || [ "$0" -nt "PROJECT_TREE.md" ]; then
    generate_project_tree
else
    success "Project structure documentation already exists"
fi

# Configure .gitignore
configure_gitignore() {
    log "Configuring .gitignore..."
    declare -A patterns=(
        ["/node_modules/"]=1
        ["/__pycache__/"]=1
        ["/dist/"]=1
        ["/build/"]=1
        ["*.egg-info"]=1
        [".env"]=1
        ["*.log"]=1
        ["*.py[co]"]=1
        ["*.sw[op]"]=1
        ["*~"]=1
        ["!.gitignore"]=1
        ["!PROJECT_TREE.md"]=1
    )

    touch .gitignore
    for pattern in "${!patterns[@]}"; do
        if ! grep -qxF "$pattern" .gitignore; then
            echo "$pattern" >> .gitignore
        fi
    done
    success ".gitignore configured"
}
configure_gitignore

# Final checks
log "Verifying installations..."
check_command node
check_command npm
check_command conda
check_command python
check_command pip

success "\nSetup completed successfully!"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Activate environment: conda activate ${ENV_NAME}"
echo "2. Start development server: npm run dev"
echo -e "\nDetailed log available at: ${YELLOW}${LOG_FILE}${NC}"