# ReconKit OSINT Toolkit

ReconKit is an advanced, professional-grade Open Source Intelligence (OSINT) toolkit designed for cybersecurity researchers, pentesters, and privacy analysts.

It features both a **Web-based Terminal Dashboard** (React/TypeScript) and a **Linux Command Line Interface (CLI)** script.

## Features
- **IP Intelligence**: Geolocation, ISP tracking, and ASN routing information mapping.
- **DNS Enumeration**: Deep DNS resolution using DoH (DNS over HTTPS) APIs.
- **GitHub Recon**: Mines public profiles to extract metadata, location hints, and repository statistics.
- **Dual-Interface**: Run the beautiful cyber-dashboard in your browser, or strictly from the Linux terminal via `recon.js`.

## Web Dashboard Installation (React/Vite)
To run the Web App interface locally:
\`\`\`bash
# Install dependencies
npm install

# Start the dev server
npm run dev
\`\`\`

## Linux CLI Usage
For Linux terminal warriors, a standalone Node.js CLI script is included at the root of the project.

\`\`\`bash
# Make the script executable
chmod +x recon.js

# View help menu
./recon.js help

# Track an IP Address
./recon.js ip 8.8.8.8

# Enumerate a domain's DNS records
./recon.js dns google.com

# Extract GitHub user intelligence
./recon.js github torvalds
\`\`\`

## Technology Stack
- **Frontend Core**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS, Framer Motion
- **CLI Core**: Node.js (v18+) with standard fetch API
- **APIs**: ipapi.co, Google DNS API, GitHub REST API
