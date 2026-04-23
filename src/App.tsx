import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal as TerminalIcon, Maximize2, X, Minus, Globe, Search, Database, 
  ShieldAlert, Code, BrainCircuit, Activity, Lock, Key, Server, Cpu, 
  Network, Hash, TextCursorInput, Bug, Workflow, FileJson, ShieldCheck, 
  Filter, MailCheck, Waves, Link, Unlock, Binary, UserSearch, Bot
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface HistoryLine {
  id: string;
  isInput: boolean;
  content: string | React.ReactNode;
}

export default function App() {
  const [history, setHistory] = useState<HistoryLine[]>([
    {
      id: 'init-1',
      isInput: false,
      content: <span className="text-emerald-500 font-bold">ReconKit OSINT Terminal [Version 5.0.0-PRO-CYBER]</span>,
    },
    {
      id: 'init-2',
      isInput: false,
      content: '(c) ReconKit Toolset. Open Source Intelligence.',
    },
    {
      id: 'init-3',
      isInput: false,
      content: <span className="text-gray-400 border border-emerald-900/50 bg-emerald-900/10 px-3 py-1.5 rounded inline-block mt-2 font-bold mb-2 shadow-[0_0_15px_rgba(16,185,129,0.15)]"><span className="text-emerald-400">💡 PRO TIP:</span> The ultimate suite is unlocked. Click any module on the right grid to load it!</span>,
    },
    {
      id: 'init-4',
      isInput: false,
      content: 'Type "help" to see all 24 available commands.',
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const endOfTerminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isProcessing]);

  const addLine = (content: string | React.ReactNode, isInput = false) => {
    setHistory(prev => [...prev, { id: Date.now() + Math.random().toString(), isInput, content }]);
  };

  const handleQuickLaunch = (cmd: string) => {
    // Determine if the command requires a target
    const noTargetCommands = ['help', 'clear', 'about'];
    
    if (noTargetCommands.includes(cmd)) {
      // Execute immediately if no target needed
      setInputVal(cmd);
      // Wait a tick for state to update, then fire form submit manually
      setTimeout(() => {
        if (inputRef.current?.form) {
           inputRef.current.form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }, 50);
    } else {
      // Prompt for target if needed to make it simpler to use
      const promptText = prompt(`Enter the target parameter for [${cmd}]:\n(e.g., an IP address, domain, username, or hash)`);
      if (promptText === null) return; // User cancelled
      
      const param = promptText.trim();
      if (!param) {
         alert("A target parameter is required for this command.");
         return;
      }

      setInputVal(`${cmd} ${param}`);
      setTimeout(() => {
        if (inputRef.current?.form) {
           inputRef.current.form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }, 50);
    }
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isProcessing) return;

    const cmdString = inputVal.trim();
    setInputVal('');
    addLine(cmdString, true);
    setIsProcessing(true);

    const args = cmdString.split(' ').filter(Boolean);
    let command = args[0].toLowerCase();
    const target = args.slice(1).join(' ');

    const commandMap: Record<string, string> = {
      "1": "ip", "01": "ip",
      "2": "dns", "02": "dns",
      "3": "github", "03": "github",
      "4": "shodan", "04": "shodan",
      "5": "whois", "05": "whois",
      "6": "crypto", "06": "crypto",
      "7": "pwned", "07": "pwned",
      "8": "dork", "08": "dork",
      "9": "cert", "09": "cert",
      "10": "mac",
      "11": "subnet",
      "12": "hash",
      "13": "encode",
      "14": "cve",
      "15": "asn",
      "16": "jwt",
      "17": "defang",
      "18": "extract",
      "19": "spf",
      "20": "entropy",
      "21": "urlparse",
      "22": "decode",
      "23": "hex",
      "24": "nexus",
      "25": "sherlock",
      "26": "ask",
      "27": "clear",
      "28": "about"
    };

    if (commandMap[command]) {
      command = commandMap[command];
    }

    try {
      if (command === 'help') {
        addLine(<span className="text-emerald-400">AVAILABLE COMMANDS:</span>);
        addLine('  [01] ip <address>          Fetch IP Geolocation & ISP data');
        addLine('  [02] dns <domain>          Enumerate DNS records explicitly');
        addLine('  [03] github <username>     Extract GitHub intelligence data');
        addLine('  [04] shodan <ip>           Query Shodan InternetDB for open ports & vulns');
        addLine('  [05] whois <domain>        Query domain registrar and registration data');
        addLine('  [06] crypto <btc_addr>     Analyze Bitcoin wallet transactions & balance');
        addLine('  [07] pwned <password>      SHA-1 k-Anonymity check against breach databases');
        addLine('  [08] dork <target>         Generate optimized Google Dorks for exposure hunting');
        addLine('  [09] cert <domain>         Analyze SSL/TLS Certificates and Issuers');
        addLine('  [10] mac <mac>             Vendor lookup for MAC Addresses');
        addLine('  [11] subnet <cidr>         Calculate Subnet allocations (e.g. 192.168.1.0/24)');
        addLine('  [12] hash <text>           Generate SHA-256 Crypto Hash of any text');
        addLine('  [13] encode <text>         Convert text to Base64 String');
        addLine(<span className="text-yellow-400 font-bold">  [14] cve &lt;cve-id&gt;        [CYBER] Fetch NIST National Vulnerability Database Intel</span>);
        addLine(<span className="text-yellow-400 font-bold">  [15] asn &lt;asn_num&gt;         [CYBER] BGP Autonomous System Route Identifier</span>);
        addLine(<span className="text-yellow-400 font-bold">  [16] jwt &lt;token&gt;           [CYBER] Decode and Inspect JSON Web Tokens (JWT)</span>);
        addLine(<span className="text-yellow-400 font-bold">  [17] defang &lt;ioc&gt;          [CYBER] Defang malicious URLs/IPs for safe reporting</span>);
        addLine(<span className="text-yellow-400 font-bold">  [18] extract &lt;text&gt;        [CYBER] Regex Extract IPs, Emails, and Hashes from text</span>);
        addLine(<span className="text-yellow-400 font-bold">  [19] spf &lt;domain&gt;          [CYBER] Analyze SPF & DMARC records for Email Spoofing</span>);
        addLine(<span className="text-yellow-400 font-bold">  [20] entropy &lt;text&gt;        [CYBER] Calculate Shannon Entropy (detects packed data)</span>);
        addLine(<span className="text-yellow-400 font-bold">  [21] urlparse &lt;url&gt;        [CYBER] Deeply dissect a Phishing URL component by component</span>);
        addLine(<span className="text-yellow-400 font-bold">  [22] decode &lt;b64&gt;          [CYBER] Decode Base64 encoded payloads</span>);
        addLine(<span className="text-yellow-400 font-bold">  [23] hex &lt;hex_string&gt;      [CYBER] Decode Hexadecimal strings to ASCII text</span>);
        addLine(<span className="text-purple-400 font-bold">  [24] nexus &lt;handle&gt;        [SPECIAL] AI Social Media Tracing & Profiler</span>);
        addLine(<span className="text-emerald-400 font-bold">  [25] sherlock &lt;user&gt;       [OSINT] Query 15+ Social Media platforms for username</span>);
        addLine(<span className="text-purple-400 font-bold">  [26] ask &lt;query&gt;           [SPECIAL] AI Cybersecurity Expert & Advisor</span>);
        addLine('  [27] clear                 Clear the terminal screen');
        addLine('  [28] about                 Show information about ReconKit');
      } 
      else if (command === 'clear') {
        setHistory([]);
      }
      else if (command === 'about') {
        addLine('ReconKit is an advanced Linux-styled OSINT Web Platform.');
        addLine('Includes NEXUS AI Profiler and 13+ professional native OSINT enumeration tools.');
      }
      else if (command === 'ip') {
        if (!target) throw new Error("Missing target. Usage: ip [address]");
        addLine(`[*] Initiating IP Tracker for target: ${target}`);
        const res = await fetch(`https://ipapi.co/${target}/json/`);
        const data = await res.json();
        if (data.error) throw new Error(data.reason || "Invalid IP or rate limit hit");
        
        addLine(<span className="text-emerald-400 font-bold">[SUCCESS] Target Acquired.</span>);
        addLine(`Location:    ${data.city}, ${data.region}, ${data.country_name}`);
        addLine(`Coordinates: ${data.latitude}, ${data.longitude}`);
        addLine(`ISP:         ${data.org}`);
        addLine(`ASN:         ${data.asn}`);
      }
      else if (command === 'dns') {
        if (!target) throw new Error("Missing target. Usage: dns [domain]");
        addLine(`[*] Interrogating Google DNS DoH for target: ${target}`);
        const res = await fetch(`https://dns.google/resolve?name=${target}&type=ANY`);
        const data = await res.json();
        if (data.Status !== 0 || !data.Answer) throw new Error("No DNS records found or invalid domain.");
        
        addLine(<span className="text-emerald-400 font-bold">[SUCCESS] DNS Records Extracted.</span>);
        data.Answer.forEach((record: any) => {
          let typeStr = ['A', 'NS', 'MD', 'MF', 'CNAME', 'SOA', 'MB', 'MG', 'MR', 'NULL', 'WKS', 'PTR', 'HINFO', 'MINFO', 'MX', 'TXT'][record.type - 1] || `TYPE${record.type}`;
          addLine(`[${typeStr.padEnd(5, ' ')}] ${record.name.padEnd(20, ' ')} -> ${record.data}`);
        });
      }
      else if (command === 'github') {
         if (!target) throw new Error("Missing target. Usage: github [username]");
         addLine(`[*] Querying GitHub Intelligence database for target: ${target}`);
         const res = await fetch(`https://api.github.com/users/${target}`);
         if (!res.ok) throw new Error("GitHub user not found or rate limit hit");
         const data = await res.json();

         addLine(<span className="text-emerald-400 font-bold">[SUCCESS] Profile Data Acquired.</span>);
         addLine(`Real Name:   ${data.name || 'Unknown'}`);
         addLine(`Location:    ${data.location || 'Unknown'}`);
         addLine(`Company:     ${data.company || 'Unknown'}`);
         addLine(`Followers:   ${data.followers} | Repos: ${data.public_repos}`);
      }
      else if (command === 'shodan') {
         if (!target) throw new Error("Missing target. Usage: shodan [ip]");
         addLine(`[*] Querying Shodan InternetDB for: ${target}`);
         const res = await fetch(`https://internetdb.shodan.io/${target}`);
         if (!res.ok) throw new Error("No Shodan InternetDB records found for this IP.");
         const data = await res.json();
         
         addLine(<span className="text-emerald-400 font-bold">[SUCCESS] Exposure Data Acquired.</span>);
         addLine(`Open Ports:      ${data.ports?.join(', ') || 'None detected'}`);
         addLine(`Hostnames:       ${data.hostnames?.join(', ') || 'N/A'}`);
         addLine(`Vulnerabilities: ${data.vulns?.length > 0 ? <span className="text-red-500 font-bold">{data.vulns.join(', ')}</span> : 'None indexed'}`);
         addLine(`CPE / Tags:      ${data.cpes?.concat(data.tags || [])?.join(', ') || 'None'}`);
      }
      else if (command === 'whois') {
         if (!target) throw new Error("Missing target. Usage: whois [domain]");
         addLine(`[*] Fetching Domain Registrar info for: ${target}`);
         const res = await fetch(`https://networkcalc.com/api/dns/whois/${target}`);
         const json = await res.json();
         if (!json.whois || !json.whois.registrar) throw new Error("No WHOIS data found.");
         
         addLine(<span className="text-emerald-400 font-bold">[SUCCESS] WHOIS Data Acquired.</span>);
         addLine(`Registrar:    ${json.whois.registrar}`);
         addLine(`Creation:     ${json.whois.creation_date}`);
         addLine(`Expiration:   ${json.whois.expiration_date}`);
         addLine(`Name Servers: ${json.whois.name_servers?.join(', ')}`);
      }
      else if (command === 'crypto') {
         if (!target) throw new Error("Missing target. Usage: crypto [btc_wallet]");
         addLine(`[*] Tracing Bitcoin Ledger for wallet: ${target}`);
         const res = await fetch(`https://blockchain.info/rawaddr/${target}`);
         if (!res.ok) throw new Error("Blockchain ledger could not locate that wallet address.");
         const data = await res.json();

         addLine(<span className="text-emerald-400 font-bold">[SUCCESS] Wallet Ledger Acquired.</span>);
         addLine(`Final Balance:  ${(data.final_balance / 100000000).toFixed(6)} BTC`);
         addLine(`Total Received: ${(data.total_received / 100000000).toFixed(6)} BTC`);
         addLine(`Total Sent:     ${(data.total_sent / 100000000).toFixed(6)} BTC`);
         addLine(`Total Txs:      ${data.n_tx}`);
      }
      else if (command === 'pwned') {
         if (!target) throw new Error("Missing target. Usage: pwned [password]");
         addLine(`[*] Checking encrypted hash against HIBP breach database...`);
         
         const buffer = new TextEncoder().encode(target);
         const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
         const hashArray = Array.from(new Uint8Array(hashBuffer));
         const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
         const prefix = hashHex.slice(0, 5);
         const suffix = hashHex.slice(5);

         const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
         if (!res.ok) throw new Error("Failed to contact breach database.");
         const text = await res.text();
         const lines = text.split('\n');
         const foundLog = lines.find(line => line.startsWith(suffix));

         if (foundLog) {
            const count = foundLog.split(':')[1].trim();
            addLine(<span className="text-red-500 font-bold animate-pulse">[CRITICAL WARNING] Password found in {parseInt(count).toLocaleString()} data breaches! Do not use this.</span>);
         } else {
            addLine(<span className="text-emerald-400 font-bold">[SAFE] This password was not found in any known public data breach.</span>);
         }
      }
      else if (command === 'dork') {
         if (!target) throw new Error("Missing target. Usage: dork [target.com]");
         addLine(`[*] Generating Weaponized Google Dorks for exposure hunting on ${target}...`);
         addLine(' ');
         addLine(<span className="text-emerald-400 font-bold">Copy/Paste these directly into Google:</span>);
         addLine(<span className="text-cyan-300">1. Exposed Configs: </span>);
         addLine(`   site:${target} ext:env | ext:log | ext:conf | ext:sql`);
         addLine(<span className="text-cyan-300">2. Directory Listings: </span>);
         addLine(`   site:${target} intitle:"index of"`);
         addLine(<span className="text-cyan-300">3. Exposed Documents: </span>);
         addLine(`   site:${target} ext:pdf | ext:docx | ext:xlsx`);
         addLine(<span className="text-cyan-300">4. Third-Party Paste Leaks: </span>);
         addLine(`   site:pastebin.com "${target}"`);
         addLine(<span className="text-cyan-300">5. Subdomain Enumeration: </span>);
         addLine(`   site:*.${target} -www`);
      }
      else if (command === 'cert') {
         if (!target) throw new Error("Missing target. Usage: cert [domain]");
         addLine(`[*] Pulling Certificate Transparency logs for: ${target}`);
         const res = await fetch(`https://networkcalc.com/api/security/certificate/${target}`);
         const json = await res.json();
         if (!json.certificate) throw new Error("No certificate data found or domain invalid.");
         const cert = json.certificate;

         addLine(<span className="text-emerald-400 font-bold">[SUCCESS] Certificate Chain Extracted.</span>);
         addLine(`Issuer:     ${cert.issuer?.organization || 'Unknown'}`);
         addLine(`Valid From: ${cert.valid_from}`);
         addLine(`Valid To:   ${cert.valid_to}`);
         addLine(`Alt Names:  ${cert.subject_alt_names?.join(', ') || 'None'}`);
      }
      // NEW COMMANDS
      else if (command === 'mac') {
         if (!target) throw new Error("Missing target. Usage: mac [00:1A:2B:...] ");
         addLine(`[*] Identifying hardware vendor for MAC: ${target}`);
         const res = await fetch(`https://networkcalc.com/api/mac/${encodeURIComponent(target)}`);
         const json = await res.json();
         if (!json.mac || !json.mac.vendor) throw new Error("OUI not found for this MAC Address.");
         addLine(<span className="text-emerald-400 font-bold">[SUCCESS] Vendor Identified.</span>);
         addLine(`Vendor:  ${json.mac.vendor}`);
         addLine(`Name:    ${json.mac.mac_vendor}`);
      }
      else if (command === 'subnet') {
         if (!target) throw new Error("Missing target. Usage: subnet [192.168.1.0/24]");
         addLine(`[*] Calculating subnet parameters for CIDR: ${target}`);
         const res = await fetch(`https://networkcalc.com/api/ip/${encodeURIComponent(target)}`);
         const json = await res.json();
         if (!json.address) throw new Error("Invalid IP/CIDR Subnet format.");
         addLine(<span className="text-emerald-400 font-bold">[SUCCESS] IP Subnet Analyzed.</span>);
         addLine(`Type:          ${json.address.type}`);
         addLine(`Broadcast:     ${json.address.broadcast}`);
         addLine(`Hosts Allowed: ${parseInt(json.address.hosts.count).toLocaleString()}`);
         addLine(`IP Range:      ${json.address.hosts.start} -> ${json.address.hosts.end}`);
      }
      else if (command === 'hash') {
         if (!target) throw new Error("Missing target. Usage: hash [text]");
         addLine(`[*] Generating SHA-256 Checksum...`);
         const buffer = new TextEncoder().encode(target);
         const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
         const hashArray = Array.from(new Uint8Array(hashBuffer));
         const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
         addLine(<span className="text-emerald-400 font-bold">[SUCCESS] Hash Generated:</span>);
         addLine(`Input:   ${target}`);
         addLine(`SHA-256: ${hashHex}`);
      }
      else if (command === 'encode') {
         if (!target) throw new Error("Missing target. Usage: encode [text]");
         addLine(`[*] Encoding payload to Base64 String...`);
         const encoded = btoa(unescape(encodeURIComponent(target)));
         addLine(<span className="text-emerald-400 font-bold">[SUCCESS] Base64 Created:</span>);
         addLine(encoded);
      }
      // -- NEW CYBER MODULES --
      else if (command === 'cve') {
        if (!target) throw new Error("Missing target. Usage: cve [CVE-YYYY-NNNN]");
        addLine(`[*] Interrogating NIST NVD / MITRE for Vulnerability: ${target.toUpperCase()}...`);
        const res = await fetch(`https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${target.toUpperCase()}`);
        if (!res.ok) throw new Error("Rate limited by NIST. Try again safely.");
        const data = await res.json();
        if (!data.vulnerabilities || data.vulnerabilities.length === 0) throw new Error("CVE not found or not published.");
        const cveData = data.vulnerabilities[0].cve;
        const cvss = cveData.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 'N/A';
        const desc = cveData.descriptions.find((d: any) => d.lang === 'en')?.value || 'No description available.';
        
        addLine(<span className="text-yellow-400 font-bold">[VULNERABILITY IDENTIFIED]</span>);
        addLine(`ID:          ${cveData.id}`);
        addLine(`CVSS Score:  ${cvss >= 9 ? <span className="text-red-500 font-bold">{cvss} (CRITICAL)</span> : cvss}`);
        addLine(`Published:   ${cveData.published.split('T')[0]}`);
        addLine(`Description: ${desc}`);
      }
      else if (command === 'asn') {
        if (!target) throw new Error("Missing target. Usage: asn [15169]");
        const cleanAsn = target.replace(/^as/i, '');
        addLine(`[*] Interrogating BGP Routing Database for ASN ${cleanAsn}...`);
        const res = await fetch(`https://api.bgpview.io/asn/${cleanAsn}`);
        const data = await res.json();
        if (data.status !== "ok") throw new Error("ASN not found.");
        
        addLine(<span className="text-yellow-400 font-bold">[ROUTING INTEL ACQUIRED]</span>);
        addLine(`Name:         ${data.data.name}`);
        addLine(`Description:  ${data.data.description_short}`);
        addLine(`Country:      ${data.data.country_code}`);
        addLine(`Email:        ${data.data.email_contacts?.join(', ') || 'N/A'}`);
      }
      else if (command === 'jwt') {
        if (!target) throw new Error("Missing target. Usage: jwt [token]");
        addLine(`[*] Decoding JSON Web Token...`);
        const parts = target.split('.');
        if (parts.length !== 3) throw new Error("Invalid JWT format. Must contain 3 sections separated by dots.");
        
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        
        addLine(<span className="text-yellow-400 font-bold">[JWT PAYLOAD COMPROMISED]</span>);
        addLine(<span className="text-cyan-300">Header:</span>);
        addLine(JSON.stringify(header, null, 2));
        addLine(<span className="text-cyan-300 mt-2">Data Claims:</span>);
        addLine(JSON.stringify(payload, null, 2));
      }
      else if (command === 'defang') {
        if (!target) throw new Error("Missing target.");
        addLine(`[*] Defanging IOC for safe reporting...`);
        const defanged = target.replace(/\./g, '[.]').replace(/http/gi, 'hxxp');
        addLine(<span className="text-yellow-400 font-bold">Defanged: </span>);
        addLine(defanged);
      }
      else if (command === 'extract') {
        if (!target) throw new Error("Missing text payload.");
        addLine(`[*] Running Regex Extractor on provided dump...`);
        const ips = target.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g) || [];
        const emails = target.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
        const uniqueIps = Array.from(new Set(ips));
        const uniqueEmails = Array.from(new Set(emails));
        
        addLine(<span className="text-yellow-400 font-bold">[IOCs EXTRACTED]</span>);
        addLine(`IP Addresses (${uniqueIps.length}): ${uniqueIps.join(', ') || 'None'}`);
        addLine(`Emails (${uniqueEmails.length}): ${uniqueEmails.join(', ') || 'None'}`);
      }
      else if (command === 'spf') {
        if (!target) throw new Error("Missing target. Usage: spf [domain]");
        addLine(`[*] Checking Email Spoofing Protections (SPF/DMARC) for: ${target}`);
        const [spfRes, dmarcRes] = await Promise.all([
          fetch(`https://dns.google/resolve?name=${target}&type=TXT`),
          fetch(`https://dns.google/resolve?name=_dmarc.${target}&type=TXT`)
        ]);
        const spfData = await spfRes.json();
        const dmarcData = await dmarcRes.json();
        
        const spfRec = (spfData.Answer || []).find((a: any) => a.data.includes('v=spf1'));
        const dmarcRec = (dmarcData.Answer || []).find((a: any) => a.data.includes('v=DMARC1'));
        
        addLine(<span className="text-yellow-400 font-bold">[EMAIL HYGIENE VERIFIED]</span>);
        addLine(<span className="text-gray-300">SPF Record:   {spfRec ? <span className="text-emerald-400">{spfRec.data}</span> : <span className="text-red-500">MISSING (Vulnerable to spoofing)</span>}</span>);
        addLine(<span className="text-gray-300">DMARC Record: {dmarcRec ? <span className="text-emerald-400">{dmarcRec.data}</span> : <span className="text-red-500">MISSING</span>}</span>);
      }
      else if (command === 'entropy') {
        if (!target) throw new Error("Missing target string.");
        addLine(`[*] Calculating Shannon Entropy to detect packing/encryption...`);
        let p: Record<string, number> = {};
        for (let i = 0; i < target.length; i++) {
          p[target[i]] = (p[target[i]] || 0) + 1;
        }
        let entropy = 0;
        for (let key in p) {
          const freq = p[key] / target.length;
          entropy -= freq * Math.log2(freq);
        }
        addLine(<span className="text-yellow-400 font-bold">[SHANNON ENTROPY EVALUATED]</span>);
        addLine(`Entropy: ${entropy.toFixed(4)} bits/character`);
        if (entropy > 6.5) addLine(<span className="text-red-500">Warning: High entropy (&gt;6.5). Data is likely encrypted, compressed, or heavily obfuscated.</span>);
      }
      else if (command === 'urlparse') {
        if (!target) throw new Error("Missing URL.");
        addLine(`[*] Dissecting URL wrapper components...`);
        let u = target;
        if (!u.startsWith('http')) u = 'http://' + u;
        const parsed = new URL(u);
        addLine(<span className="text-yellow-400 font-bold">[URL DISSECTED]</span>);
        addLine(`Protocol: ${parsed.protocol}`);
        addLine(`Host:     ${parsed.hostname}`);
        addLine(`Port:     ${parsed.port || (parsed.protocol === 'https:' ? '443' : '80')}`);
        addLine(`Path:     ${parsed.pathname}`);
        addLine(`Params:   ${parsed.search}`);
        addLine(`Hash:     ${parsed.hash}`);
      }
      else if (command === 'decode') {
        if (!target) throw new Error("Missing base64 target.");
        addLine(`[*] Decoding Base64 payload...`);
        try {
          const decoded = decodeURIComponent(escape(atob(target.trim())));
          addLine(<span className="text-yellow-400 font-bold">[PAYLOAD DECODED]:</span>);
          addLine(decoded);
        } catch(e) {
          throw new Error("Target is not valid Base64 string.");
        }
      }
      else if (command === 'hex') {
        if (!target) throw new Error("Missing hex target.");
        addLine(`[*] Translating Hexadecimal to ASCII Text...`);
        const hex = target.replace(/\s+/g, '');
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
          const code = parseInt(hex.substr(i, 2), 16);
          if (!isNaN(code)) str += String.fromCharCode(code);
        }
        addLine(<span className="text-yellow-400 font-bold">[HEX DECODED]:</span>);
        addLine(str);
      }
      // -- END CYBER MODULES --
      else if (command === 'sherlock') {
        if (!target) throw new Error("Missing username target.");
        addLine(<span className="text-emerald-400 font-bold">[*] Running SHERLOCK Social Media Sweep for: {target}</span>);
        
        const platforms = [
          { name: 'Instagram', url: `https://instagram.com/${target}` },
          { name: 'Twitter/X', url: `https://twitter.com/${target}` },
          { name: 'TikTok', url: `https://tiktok.com/@${target}` },
          { name: 'Reddit', url: `https://reddit.com/user/${target}` },
          { name: 'GitHub', url: `https://github.com/${target}` },
          { name: 'Pinterest', url: `https://pinterest.com/${target}` },
          { name: 'Snapchat', url: `https://snapchat.com/add/${target}` },
          { name: 'YouTube', url: `https://youtube.com/@${target}` },
          { name: 'Twitch', url: `https://twitch.tv/${target}` },
          { name: 'Steam', url: `https://steamcommunity.com/id/${target}` },
          { name: 'Linktree', url: `https://linktr.ee/${target}` },
          { name: 'Patreon', url: `https://patreon.com/${target}` },
          { name: 'Spotify', url: `https://open.spotify.com/user/${target}` },
          { name: 'Medium', url: `https://medium.com/@${target}` },
          { name: 'Flickr', url: `https://flickr.com/people/${target}` }
        ];

        addLine(<span className="text-gray-300">Generating direct cross-origin target matrix...</span>);
        
        const links = platforms.map(p => (
           <div key={p.name} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2 sm:mb-1">
              <span className="text-gray-500 font-bold min-w-[100px]">{p.name}:</span>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline font-mono text-xs break-all hidden sm:block">{p.url}</a>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline font-mono text-xs break-all sm:hidden">Check Profile ↗</a>
           </div>
        ));

        addLine(
          <div className="mt-2 mb-2 p-3 sm:p-4 bg-black/40 border border-white/10 rounded-lg">
             <div className="mb-3 text-xs text-yellow-500/80 uppercase tracking-widest font-bold">
                [!] Click links to instantly verify existence
             </div>
             {links}
          </div>
        );
      }
      else if (command === 'nexus') {
        if (!target) throw new Error("Missing target. Usage: nexus [name or username]");
        addLine(<span className="text-purple-400 animate-pulse">[*] Activating NEXUS Deep-Trace AI for target: {target}</span>);
        addLine(<span className="text-purple-400 animate-pulse">[*] Sweeping Social Media (Instagram, Twitter, LinkedIn) for footprint...</span>);
        
        try {
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are NEXUS, an advanced OSINT module. Investigate: "${target}". 
            Search social media platforms and the open web. Format strictly as terminal output.
            DO NOT USE Markdown headers (#). Use bracketed sections like [KNOWN ALIASES].
            Include:
            [TARGET ACQUISITION]
            [SOCIAL MEDIA FOOTPRINT]
            [DIGITAL EXPOSURE]
            [PSYCHOMETRIC PROFILE]
            Keep it deeply analytical and concise.`,
            config: {
              tools: [{ googleSearch: {} }],
              temperature: 0.2
            }
          });

          addLine(<span className="text-purple-500 font-bold">[SUCCESS] NEXUS Trace Complete. Synthesizing data:</span>);
          addLine(' ');

          const rawOutput = response.text || "No data synthesized.";
          rawOutput.split('\n').forEach(line => {
            if (line.trim().startsWith('[')) {
              addLine(<span className="text-emerald-300 font-bold">{line}</span>);
            } else if (line.trim() !== '') {
              addLine(<span className="text-gray-300">{line.replace(/\*\*/g, '')}</span>);
            }
          });
        } catch (error: any) {
           throw new Error("NEXUS API Failure: " + (error.message || error.toString()));
        }
      }
      else if (command === 'ask') {
        if (!target) throw new Error("Missing query. What do you want to ask?");
        addLine(<span className="text-purple-400 animate-pulse">[*] Uplinking to ORACLE Cyber Advisor with query: {target}</span>);
        
        try {
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are ORACLE, an elite cybersecurity expert, red teamer, and incident responder.
            The user is asking you: "${target}".
            Provide advice, scripts, methodologies, or explanations strictly with a cybersecurity mindset.
            Format your response as a professional terminal output, keeping it incredibly informative, actionable, and straight to the point.
            Avoid overly conversational filler. Give the pure technical briefing.`,
            config: {
              temperature: 0.3
            }
          });

          addLine(<span className="text-purple-500 font-bold">[ORACLE FEED] Transmission Received:</span>);
          addLine(' ');

          const rawOutput = response.text || "No insights received.";
          rawOutput.split('\n').forEach(line => {
             addLine(<span className="text-gray-300">{line.replace(/\*\*/g, '')}</span>);
          });
        } catch (error: any) {
           throw new Error("ORACLE API Failure: " + (error.message || error.toString()));
        }
      }
      else {
        throw new Error(`Command not recognized: ${command}. Type 'help' for instructions or click a quick-action button.`);
      }
    } catch (err: any) {
      console.error(err);
      addLine(<span className="text-red-500">[ERROR] {err.message}</span>);
      
      const usageMap: Record<string, string> = {
        ip: "ip <address> (e.g. ip 8.8.8.8)",
        dns: "dns <domain> (e.g. dns google.com)",
        github: "github <username> (e.g. github torvalds)",
        shodan: "shodan <ip> (e.g. shodan 8.8.8.8)",
        whois: "whois <domain> (e.g. whois google.com)",
        crypto: "crypto <btc_addr> (e.g. crypto 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa)",
        pwned: "pwned <password> (e.g. pwned password123)",
        dork: "dork <target> (e.g. dork tesla.com)",
        cert: "cert <domain> (e.g. cert google.com)",
        mac: "mac <mac_address> (e.g. mac 00:00:5e:00:53:01)",
        subnet: "subnet <cidr> (e.g. subnet 192.168.1.0/24)",
        hash: "hash <text> (e.g. hash mysecrettext)",
        encode: "encode <text> (e.g. encode mysecrettext)",
        cve: "cve <cve-id> (e.g. cve CVE-2021-44228)",
        asn: "asn <asn_number> (e.g. asn AS15169)",
        jwt: "jwt <token> (e.g. jwt eyJhbGciOi...)",
        defang: "defang <ioc> (e.g. defang http://malicious.com)",
        extract: "extract <text> (e.g. extract badguy@evil.com with ip 1.1.1.1)",
        spf: "spf <domain> (e.g. spf google.com)",
        entropy: "entropy <text> (e.g. entropy some text here)",
        urlparse: "urlparse <url> (e.g. urlparse https://google.com/path)",
        decode: "decode <b64> (e.g. decode dGVzdA==)",
        hex: "hex <hex_string> (e.g. hex 48656c6c6f)",
        nexus: "nexus <handle> (e.g. nexus elonmusk)",
        sherlock: "sherlock <username> (e.g. sherlock elonmusk)",
        ask: "ask <query> (e.g. ask how to map internal network via nmap)"
      };

      if (command && usageMap[command]) {
         addLine(<span className="text-emerald-500 font-bold ml-4 mt-1 block">💡 How to use [{command}]:</span>);
         addLine(<span className="text-gray-300 ml-4 mb-2 block">Type: <span className="text-white font-mono bg-white/10 px-1 py-0.5 rounded">{usageMap[command]}</span></span>);
      }
    } finally {
      addLine(' '); // Add empty line spacing
      setIsProcessing(false);
    }
  };

  const actionButtons = [
    { cmd: 'ip', label: 'IP Trace', icon: Globe },
    { cmd: 'dns', label: 'DNS Enum', icon: Database },
    { cmd: 'github', label: 'Git Recon', icon: Code },
    { cmd: 'shodan', label: 'Shodan', icon: Server },
    { cmd: 'whois', label: 'WhoIs', icon: Search },
    { cmd: 'crypto', label: 'Crypto', icon: Lock },
    { cmd: 'pwned', label: 'Pwned', icon: Key },
    { cmd: 'dork', label: 'Dork Hunt', icon: Search },
    { cmd: 'cert', label: 'SSL Cert', icon: ShieldAlert },
    { cmd: 'mac', label: 'MAC Lookup', icon: Cpu },
    { cmd: 'subnet', label: 'IP Subnet', icon: Network },
    { cmd: 'hash', label: 'SHA Hash', icon: Hash },
    { cmd: 'encode', label: 'B64 Encode', icon: TextCursorInput },
    { cmd: 'cve', label: 'CVE Intel', icon: Bug },
    { cmd: 'asn', label: 'BGP / ASN', icon: Workflow },
    { cmd: 'jwt', label: 'JWT Decode', icon: FileJson },
    { cmd: 'defang', label: 'IOC Defang', icon: ShieldCheck },
    { cmd: 'extract', label: 'IOC Extract', icon: Filter },
    { cmd: 'spf', label: 'SPF & DMARC', icon: MailCheck },
    { cmd: 'entropy', label: 'Entropy', icon: Waves },
    { cmd: 'urlparse', label: 'URL Dissect', icon: Link },
    { cmd: 'decode', label: 'B64 Decode', icon: Unlock },
    { cmd: 'hex', label: 'Hex Decode', icon: Binary },
    { cmd: 'sherlock', label: 'Sherlock', icon: UserSearch },
    { cmd: 'ask', label: 'Ask Oracle', icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-[#050505] p-2 sm:p-6 lg:p-10 font-sans flex items-center justify-center relative overflow-hidden">
      
      {/* Ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-7xl flex flex-col xl:flex-row gap-6 relative z-10 h-[85vh]">
        
        {/* Main Terminal Window */}
        <div className="flex-1 bg-[#0c0c0c] border border-white/10 rounded-xl shadow-[0_0_40px_rgba(32,194,14,0.1)] flex flex-col overflow-hidden backdrop-blur-3xl h-full">
          {/* Terminal Header Chrome */}
          <div className="bg-[#111] border-b border-white/5 py-2 px-4 flex items-center justify-between select-none shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 border border-red-600"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 border border-yellow-600"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 border border-green-600"></div>
            </div>
            <div className="text-xs font-mono text-gray-500 flex items-center gap-2 shrink-0 overflow-hidden ml-4">
              <ShieldAlert className="w-3 h-3 text-emerald-500" />
              root@reconkit: ~ (ULTIMATE GUI)
            </div>
            <div className="flex items-center gap-2">
              <Minus className="w-4 h-4 text-gray-600" />
              <Maximize2 className="w-4 h-4 text-gray-600" />
              <X className="w-4 h-4 text-gray-600" />
            </div>
          </div>

          {/* Terminal Window Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 font-mono text-sm sm:text-base text-gray-300 relative scrollbar-hide" onClick={() => inputRef.current?.focus()}>
            
            <AnimatePresence>
              {history.map((line) => (
                <motion.div 
                  key={line.id}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="mb-1 break-words leading-relaxed"
                >
                  {line.isInput ? (
                    <div className="flex gap-2">
                      <span className="text-emerald-500 font-bold shrink-0">root@reconkit:~#</span>
                      <span className="text-white">{line.content}</span>
                    </div>
                  ) : (
                    <div className="pl-0">{line.content}</div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Current Input Line */}
            <div className="flex gap-2 mt-1">
              <span className="text-emerald-500 font-bold shrink-0">root@reconkit:~#</span>
              <form onSubmit={handleCommand} className="flex-1 relative">
                <input 
                  ref={inputRef}
                  id="cmdInput"
                  type="text"
                  autoComplete="off"
                  autoFocus
                  disabled={isProcessing}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="w-full bg-transparent outline-none border-none text-white font-mono placeholder:text-gray-700"
                  spellCheck={false}
                />
              </form>
            </div>

            <div ref={endOfTerminalRef} className="h-4"></div>
          </div>
        </div>

        {/* Improved Easy-Use GUI Sidebar */}
        <div className="hidden xl:flex w-80 flex-col gap-4 overflow-y-auto pr-2 scrollbar-[width:4px] scrollbar-thumb-emerald-500/20 scrollbar-track-transparent shrink-0 pb-4">
          <div className="text-white/40 text-xs font-bold tracking-widest px-2 mb-0 border-b border-white/5 pb-2">COMMAND LAUNCH GRID</div>
          
          <div className="grid grid-cols-3 gap-2">
            {actionButtons.map((btn, idx) => {
              const IconComp = btn.icon;
              return (
                <button 
                  key={idx}
                  onClick={() => handleQuickLaunch(btn.cmd)}
                  className="border border-emerald-500/20 bg-black/40 hover:border-emerald-500/60 hover:bg-emerald-500/10 p-2 rounded-lg flex flex-col items-center justify-center gap-1.5 backdrop-blur-md transition-all active:scale-95 group text-center cursor-pointer min-h-[70px]"
                >
                  <IconComp className="w-5 h-5 text-emerald-500/50 group-hover:text-emerald-400 transition-colors" />
                  <div className="text-white/70 group-hover:text-white font-sans text-[10px] font-bold leading-tight flex items-center justify-center gap-1">
                    <span className="text-emerald-500/50 group-hover:text-emerald-400 font-mono text-[9px]">{String(idx + 1).padStart(2, '0')}.</span>
                    {btn.label}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-purple-400/60 text-xs font-bold tracking-widest px-2 mt-2 -mb-1 border-b border-purple-500/20 pb-2">AI OPERATIONS</div>

          <button 
             onClick={() => handleQuickLaunch('nexus')}
             className="border cursor-pointer flex-shrink-0 border-purple-500/50 hover:bg-purple-900/40 bg-purple-900/10 p-4 rounded-lg flex flex-col items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] backdrop-blur-md transition-all active:scale-95 group"
          >
            <BrainCircuit className="w-8 h-8 text-purple-400 animate-pulse group-hover:text-purple-300" />
            <div className="flex flex-col items-center">
               <div className="text-purple-400 font-mono text-[10px] mb-1">MODULE [24]</div>
               <div className="text-white font-sans text-sm font-bold uppercase tracking-wider group-hover:text-purple-100">AI Social NEXUS</div>
            </div>
            <p className="text-purple-200/60 text-[10px] text-center leading-tight mt-1">Deep Social Media Trace <br/> & Psychometric Profiler</p>
          </button>
        </div>

      </div>
    </div>
  );
}
