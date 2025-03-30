#Requires -Version 7.0
$ErrorActionPreference = "Stop"

# Configuration
$ENV_NAME = "solar-env"
$MINICONDA_DIR = "$env:USERPROFILE\miniconda3"
$NVM_VERSION = "v0.39.7"
$LOG_FILE = "$env:USERPROFILE\setup.log"

# Colors for output
$RED = 'Red'
$GREEN = 'Green'
$YELLOW = 'Yellow'

# Initialize log file
New-Item -Path $LOG_FILE -Type File -Force | Out-Null
Set-Content $LOG_FILE "Solar Energy Prediction System Setup Log`n========================================"

# Helper functions
function log {
    param([string]$message)
    Write-Host "[INFO] $message" -ForegroundColor $YELLOW
    Add-Content $LOG_FILE "[INFO] $message"
}

function success {
    param([string]$message)
    Write-Host $message -ForegroundColor $GREEN
    Add-Content $LOG_FILE $message
}

function error {
    param([string]$message)
    Write-Host "[ERROR] $message" -ForegroundColor $RED
    Add-Content $LOG_FILE "[ERROR] $message"
    exit 1
}

function check_command {
    param([string]$cmd)
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        error "Required command $cmd not found"
    }
}

# Header
Write-Host @"
  _____       _          _____                      _        
 / ____|     | |        |  __ \                    (_)       
| (___   ___ | | ___   _| |__) |___ _ __   ___  ___ _ ___    
 \___ \ / _ \| |/ / | | |  _  // _ \ '_ \ / _ \/ __| / __|   
 ____) | (_) |   <| |_| | | \ \  __/ |_) |  __/\__ \ \__ \   
|_____/ \___/|_|\_\\__, |_|  \_\___| .__/ \___||___/_|___/   
                    __/ |          | |                        
                   |___/           |_|                        
"@ -ForegroundColor Green

# Check admin privileges
if ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    error "This script should not be run as administrator"
}

# System dependencies
log "Checking system dependencies..."
$required = @("git", "python", "nodejs", "wget")
$installed = Get-WingetPackage | Select-Object -ExpandProperty Id

foreach ($pkg in $required) {
    if ($pkg -notin $installed) {
        try {
            winget install --id $pkg --accept-package-agreements --accept-source-agreements
            success "Installed $pkg"
        }
        catch {
            error "Failed to install $pkg"
        }
    }
}

# Install NVM
function Install-Nvm {
    log "Installing Node Version Manager..."
    $nvm_dir = "$env:USERPROFILE\.nvm"
    if (-not (Test-Path $nvm_dir)) {
        New-Item -Path $nvm_dir -ItemType Directory | Out-Null
    }
    Invoke-WebRequest "https://github.com/coreybutler/nvm-windows/releases/download/$NVM_VERSION/nvm-setup.exe" -OutFile nvm-setup.exe
    Start-Process nvm-setup.exe -Wait -ArgumentList "/S"
    Remove-Item nvm-setup.exe
}

if (-not (Test-Path "$env:ProgramFiles\nodejs\nvm.exe")) {
    Install-Nvm
    success "nvm installed"
}
else {
    success "nvm already installed"
}

# Setup Node.js
$LTS_VERSION = (nvm list available | Select-String 'LTS' | Select-Object -First 1).ToString().Split()[2]
if (-not (nvm list | Select-String $LTS_VERSION)) {
    log "Installing Node.js LTS ($LTS_VERSION)..."
    nvm install $LTS_VERSION
    success "Node.js $LTS_VERSION installed"
}
else {
    success "Node.js $LTS_VERSION already installed"
}

log "Setting default Node.js version..."
nvm use $LTS_VERSION
nvm on
success "Node.js $LTS_VERSION configured"

# Install Miniconda
function Install-Miniconda {
    log "Installing Miniconda..."
    Invoke-WebRequest "https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe" -OutFile miniconda.exe
    Start-Process miniconda.exe -Wait -ArgumentList "/InstallationType=JustMe /AddToPath=0 /RegisterPython=0 /S /D=$MINICONDA_DIR"
    Remove-Item miniconda.exe
}

if (-not (Test-Path "$MINICONDA_DIR\Scripts\conda.exe")) {
    Install-Miniconda
    success "Miniconda installed"
}
else {
    success "Miniconda already installed"
}

# Configure Conda environment
$env:Path += ";$MINICONDA_DIR\Scripts;$MINICONDA_DIR\Library\bin"

if (-not (conda env list | Select-String $ENV_NAME)) {
    log "Creating Conda environment..."
    conda create -n $ENV_NAME python=3.10 -y
    success "Conda environment created"
}
else {
    success "Conda environment exists"
}

# Activate environment
log "Activating environment..."
conda activate $ENV_NAME

# Python dependencies
function Install-PythonDeps {
    log "Installing Python dependencies..."
    Get-ChildItem -Recurse -Filter requirements.txt | ForEach-Object {
        log "Installing from $($_.FullName)..."
        python -m pip install -r $_.FullName
    }
}
Install-PythonDeps

# Node.js dependencies
function Install-NodeDeps {
    log "Installing Node.js dependencies..."
    Get-ChildItem -Recurse -Filter package.json | ForEach-Object {
        Push-Location $_.Directory
        npm install
        Pop-Location
    }
}
Install-NodeDeps

# Generate project tree
function Generate-ProjectTree {
    log "Generating project structure..."
    tree /f /a | Out-File PROJECT_TREE.md
}
Generate-ProjectTree

# Final checks
log "Verifying installations..."
check_command "node"
check_command "npm"
check_command "conda"
check_command "python"

success "`nSetup completed successfully!"
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Activate environment: conda activate $ENV_NAME"
Write-Host "2. Start development server: npm run dev"
Write-Host "`nDetailed log available at: $LOG_FILE" -ForegroundColor Yellow