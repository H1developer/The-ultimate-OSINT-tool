#!/usr/bin/env node

/**
 * ReconKit OSINT - Linux Command Line Interface
 * Professional Grade Open Source Intelligence Tool
 * 
 * Usage on Linux:
 *   chmod +x recon.js
 *   ./recon.js help
 */

const args = process.argv.slice(2);
let command = args[0] ? args[0].toLowerCase() : undefined;
const target = args[1];

if (command) {
  const commandMap = {
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
    "27": "help"
  };
  
  if (commandMap[command]) {
    command = commandMap[command];
  }
}

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
  yellow: "\x1b[33m"
};

function printBanner() {
  console.log(`${COLORS.green}
  ██████╗ ███████╗██████╗ ██████╗ ███╗   ██╗██╗  ██╗██╗████████╗
  ██╔══██╗██╔════╝██╔════╝██╔═══██╗████╗  ██║██║ ██╔╝██║╚══██╔══╝
  ██████╔╝█████╗  ██║     ██║   ██║██╔██╗ ██║█████╔╝ ██║   ██║   
  ██╔══██╗██╔══╝  ██║     ██║   ██║██║╚██╗██║██╔═██╗ ██║   ██║   
  ██║  ██║███████╗╚██████╗╚██████╔╝██║ ╚████║██║  ██╗██║   ██║   
  ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝   ╚═╝   
                                                                 
  ReconKit OSINT Linux Toolkit v1.0.0 (Open Source)
  ${COLORS.reset}`);
}

async function runCommand() {
  if (!command || command === 'help') {
    printBanner();
    console.log(`  ${COLORS.cyan}Usage:${COLORS.reset}`);
    console.log(`    ./recon.js <command> <target>\n`);
    console.log(`  ${COLORS.cyan}Commands:${COLORS.reset}`);
    console.log(`    [01] ip <ip_address>      Track IP Location & ISP`);
    console.log(`    [02] dns <domain>         Enumerate DNS Records`);
    console.log(`    [03] github <username>    Extract GitHub Intelligence`);
    console.log(`    [04] shodan <ip>          Query Shodan InternetDB for open ports & vulns`);
    console.log(`    [05] whois <domain>       Query registrar and registration data`);
    console.log(`    [06] crypto <btc_addr>    Analyze Bitcoin transactions & balance`);
    console.log(`    [07] pwned <password>     SHA-1 k-Anonymity check against breach DBs`);
    console.log(`    [08] dork <target>        Generate optimized Google Dorks`);
    console.log(`    [09] cert <domain>        Analyze SSL/TLS Certificates`);
    console.log(`    [10] mac <mac>            Vendor lookup for MAC Addresses`);
    console.log(`    [11] subnet <cidr>        Calculate Subnet allocations (e.g. 192.168.1.0/24)`);
    console.log(`    [12] hash <text>          Generate SHA-256 Crypto Hash of any text`);
    console.log(`    [13] encode <text>        Convert text to Base64 String`);
    console.log(`    [14] cve <cve-id>         [CYBER] Fetch NIST National Vulnerability Database Intel`);
    console.log(`    [15] asn <asn_num>        [CYBER] BGP Autonomous System Route Identifier`);
    console.log(`    [16] jwt <token>          [CYBER] Decode and Inspect JSON Web Tokens`);
    console.log(`    [17] defang <ioc>         [CYBER] Defang malicious URLs/IPs for safe reporting`);
    console.log(`    [18] extract <text>       [CYBER] Regex Extract IPs, Emails, and Hashes`);
    console.log(`    [19] spf <domain>         [CYBER] Analyze SPF & DMARC records`);
    console.log(`    [20] entropy <text>       [CYBER] Calculate Shannon Entropy`);
    console.log(`    [21] urlparse <url>       [CYBER] Deeply dissect a Phishing URL`);
    console.log(`    [22] decode <b64>         [CYBER] Decode Base64 encoded payloads`);
    console.log(`    [23] hex <hex_string>     [CYBER] Decode Hexadecimal strings to ASCII text`);
    console.log(`    [24] nexus <handle>       [SPECIAL] AI Social Media Profiler`);
    console.log(`    [25] sherlock <username>  [OSINT] Query 15+ Social Media platforms for username`);
    console.log(`    [26] ask <query>          [SPECIAL] AI Cybersecurity Expert & Advisor`);
    console.log(`    [27] help                 Display this help menu\n`);
    process.exit(0);
  }

  if (!target) {
    console.error(`\n  ${COLORS.red}[!] Error: Target is required for command '${command}'${COLORS.reset}\n`);
    process.exit(1);
  }

  try {
    console.log(`\n  ${COLORS.yellow}[*] Executing '${command}' scan on target '${target}'...${COLORS.reset}\n`);

    if (command === 'ip') {
      const res = await fetch(`https://ipapi.co/${target}/json/`);
      const data = await res.json();
      if (data.error) throw new Error(data.reason || "Invalid IP or rate limited");
      console.log(`  ${COLORS.green}[+] Target Acquired:${COLORS.reset}`);
      console.log(`      Location: ${data.city}, ${data.region}, ${data.country_name}`);
      console.log(`      ISP:      ${data.org}`);
      console.log(`      ASN:      ${data.asn}`);
      console.log(`      Coordinates: ${data.latitude}, ${data.longitude}\n`);
      
    } else if (command === 'dns') {
      const res = await fetch(`https://dns.google/resolve?name=${target}&type=ANY`);
      const data = await res.json();
      if (data.Status !== 0 || !data.Answer) throw new Error("No DNS records found or invalid domain.");
      console.log(`  ${COLORS.green}[+] Target Acquired:${COLORS.reset}`);
      data.Answer.forEach((record) => {
        let typeStr = ['A', 'NS', 'MD', 'MF', 'CNAME', 'SOA', 'MB', 'MG', 'MR', 'NULL', 'WKS', 'PTR', 'HINFO', 'MINFO', 'MX', 'TXT'][record.type - 1] || `TYPE${record.type}`;
        console.log(`      [${typeStr}] ${record.name} -> ${record.data}`);
      });
      console.log("");
    } else if (command === 'github') {
      const res = await fetch(`https://api.github.com/users/${target}`);
      if (!res.ok) throw new Error("GitHub user not found");
      const data = await res.json();
      console.log(`  ${COLORS.green}[+] Target Acquired:${COLORS.reset}`);
      console.log(`      Name:       ${data.name || 'N/A'}`);
      console.log(`      Company:    ${data.company || 'N/A'}`);
      console.log(`      Location:   ${data.location || 'N/A'}`);
      console.log(`      Followers:  ${data.followers}`);
      console.log(`      Public Repos: ${data.public_repos}\n`);
    } else if (command === 'shodan') {
      const res = await fetch(`https://internetdb.shodan.io/${target}`);
      if (!res.ok) throw new Error("No Shodan records found for this IP.");
      const data = await res.json();
      console.log(`  ${COLORS.green}[+] Shodan Exposure Data:${COLORS.reset}`);
      console.log(`      Open Ports:      ${data.ports ? data.ports.join(', ') : 'None'}`);
      console.log(`      Hostnames:       ${data.hostnames ? data.hostnames.join(', ') : 'None'}`);
      console.log(`      Vulnerabilities: ${data.vulns && data.vulns.length > 0 ? COLORS.red + data.vulns.join(', ') + COLORS.reset : 'None'}`);
      const tagsCpes = [].concat(data.cpes || [], data.tags || []);
      console.log(`      CPEs / Tags:     ${tagsCpes.join(', ') || 'None'}\n`);
    } else if (command === 'whois') {
      const res = await fetch(`https://networkcalc.com/api/dns/whois/${target}`);
      const json = await res.json();
      const data = json.whois;
      if (!data || !data.registrar) throw new Error("WHOIS lookup failed.");
      console.log(`  ${COLORS.green}[+] Domain WHOIS Extracted:${COLORS.reset}`);
      console.log(`      Registrar:    ${data.registrar}`);
      console.log(`      Creation:     ${data.creation_date}`);
      console.log(`      Expiration:   ${data.expiration_date}`);
      console.log(`      Name Servers: ${data.name_servers ? data.name_servers.join(', ') : 'Unknown'}\n`);
    } else if (command === 'crypto') {
      const res = await fetch(`https://blockchain.info/rawaddr/${target}`);
      if (!res.ok) throw new Error("Bitcoin wallet not found or invalid.");
      const data = await res.json();
      console.log(`  ${COLORS.green}[+] BTC Wallet Ledger Extracted:${COLORS.reset}`);
      console.log(`      Final Balance:  ${(data.final_balance / 100000000).toFixed(6)} BTC`);
      console.log(`      Total Received: ${(data.total_received / 100000000).toFixed(6)} BTC`);
      console.log(`      Total Sent:     ${(data.total_sent / 100000000).toFixed(6)} BTC`);
      console.log(`      Total Txs:      ${data.n_tx}\n`);
    } else if (command === 'pwned') {
      const crypto = require('crypto');
      const hash = crypto.createHash('sha1').update(target).digest('hex').toUpperCase();
      const prefix = hash.slice(0, 5);
      const suffix = hash.slice(5);
      
      const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      if (!res.ok) throw new Error("Failed to contact breach database.");
      const text = await res.text();
      const lines = text.split('\n');
      const found = lines.find(line => line.startsWith(suffix));
      
      if (found) {
        const count = found.split(':')[1].trim();
        console.log(`  ${COLORS.red}[!] CRITICAL: Password found in ${parseInt(count).toLocaleString()} data breaches!${COLORS.reset}\n`);
      } else {
        console.log(`  ${COLORS.green}[+] SAFE: Password not found in known public breaches.${COLORS.reset}\n`);
      }
    } else if (command === 'dork') {
      console.log(`  ${COLORS.green}[+] Generated Weaponized Dorks for ${target}:${COLORS.reset}`);
      console.log(`      1. Exposed Configs:     site:${target} ext:env | ext:log | ext:conf`);
      console.log(`      2. Directory Listings:  site:${target} intitle:"index of"`);
      console.log(`      3. Exposed Documents:   site:${target} ext:pdf | ext:docx | ext:xlsx`);
      console.log(`      4. Third-Party Pastes:  site:pastebin.com "${target}"`);
      console.log(`      5. Deep Subdomains:     site:*.${target} -www\n`);
    } else if (command === 'cert') {
      const res = await fetch(`https://networkcalc.com/api/security/certificate/${target}`);
      const json = await res.json();
      const cert = json.certificate;
      if (!cert) throw new Error("No certificate data found");
      console.log(`  ${COLORS.green}[+] SSL/TLS Certificate Extracted:${COLORS.reset}`);
      console.log(`      Issuer:      ${cert.issuer ? cert.issuer.organization : 'Unknown'}`);
      console.log(`      Valid From:  ${cert.valid_from}`);
      console.log(`      Valid To:    ${cert.valid_to}`);
      console.log(`      Alt Names:   ${cert.subject_alt_names ? cert.subject_alt_names.join(', ') : 'None'}\n`);
    } else if (command === 'mac') {
      const res = await fetch(`https://networkcalc.com/api/mac/${encodeURIComponent(target)}`);
      const json = await res.json();
      if (!json.mac || !json.mac.vendor) throw new Error("OUI not found for this MAC Address.");
      console.log(`  ${COLORS.green}[+] Vendor Identified:${COLORS.reset}`);
      console.log(`      Vendor:  ${json.mac.vendor}`);
      console.log(`      Name:    ${json.mac.mac_vendor}\n`);
    } else if (command === 'subnet') {
      const res = await fetch(`https://networkcalc.com/api/ip/${encodeURIComponent(target)}`);
      const json = await res.json();
      if (!json.address) throw new Error("Invalid IP/CIDR Subnet format.");
      console.log(`  ${COLORS.green}[+] IP Subnet Analyzed:${COLORS.reset}`);
      console.log(`      Type:          ${json.address.type}`);
      console.log(`      Broadcast:     ${json.address.broadcast}`);
      console.log(`      Hosts Allowed: ${parseInt(json.address.hosts.count).toLocaleString()}`);
      console.log(`      IP Range:      ${json.address.hosts.start} -> ${json.address.hosts.end}\n`);
    } else if (command === 'hash') {
      const crypto = require('crypto');
      const hashHex = crypto.createHash('sha256').update(target).digest('hex');
      console.log(`  ${COLORS.green}[+] Hash Generated:${COLORS.reset}`);
      console.log(`      Input:   ${target}`);
      console.log(`      SHA-256: ${hashHex}\n`);
    } else if (command === 'encode') {
      const encoded = Buffer.from(target).toString('base64');
      console.log(`  ${COLORS.green}[+] Base64 Created:${COLORS.reset}`);
      console.log(`      ${encoded}\n`);
    } else if (command === 'cve') {
      const res = await fetch(`https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${target.toUpperCase()}`);
      if (!res.ok) throw new Error("Rate limited by NIST or invalid CVE.");
      const data = await res.json();
      if (!data.vulnerabilities || data.vulnerabilities.length === 0) throw new Error("CVE not found.");
      const cveData = data.vulnerabilities[0].cve;
      const cvss = cveData.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 'N/A';
      const desc = cveData.descriptions.find(d => d.lang === 'en')?.value || 'N/A';
      console.log(`  ${COLORS.yellow}[+] VULNERABILITY IDENTIFIED:${COLORS.reset}`);
      console.log(`      ID:          ${cveData.id}`);
      console.log(`      CVSS Score:  ${cvss}`);
      console.log(`      Published:   ${cveData.published.split('T')[0]}`);
      console.log(`      Description: ${desc}\n`);
    } else if (command === 'asn') {
      const cleanAsn = target.replace(/^as/i, '');
      const res = await fetch(`https://api.bgpview.io/asn/${cleanAsn}`);
      const data = await res.json();
      if (data.status !== "ok") throw new Error("ASN not found.");
      console.log(`  ${COLORS.yellow}[+] ROUTING INTEL ACQUIRED:${COLORS.reset}`);
      console.log(`      Name:         ${data.data.name}`);
      console.log(`      Description:  ${data.data.description_short}`);
      console.log(`      Country:      ${data.data.country_code}`);
      console.log(`      Email:        ${data.data.email_contacts ? data.data.email_contacts.join(', ') : 'N/A'}\n`);
    } else if (command === 'jwt') {
      const parts = target.split('.');
      if (parts.length !== 3) throw new Error("Invalid JWT.");
      const header = JSON.parse(Buffer.from(parts[0], 'base64').toString('utf-8'));
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
      console.log(`  ${COLORS.yellow}[+] JWT COMPROMISED:${COLORS.reset}`);
      console.log(`      Header: ${JSON.stringify(header)}`);
      console.log(`      Payload: ${JSON.stringify(payload)}\n`);
    } else if (command === 'defang') {
      const defanged = target.replace(/\./g, '[.]').replace(/http/gi, 'hxxp');
      console.log(`  ${COLORS.yellow}[+] DEFANGED IOC:${COLORS.reset}\n      ${defanged}\n`);
    } else if (command === 'extract') {
      const ips = target.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g) || [];
      const emails = target.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
      console.log(`  ${COLORS.yellow}[+] EXTRACTED IOCs:${COLORS.reset}`);
      console.log(`      IPs:    ${Array.from(new Set(ips)).join(', ') || 'None'}`);
      console.log(`      Emails: ${Array.from(new Set(emails)).join(', ') || 'None'}\n`);
    } else if (command === 'spf') {
      const spfRes = await fetch(`https://dns.google/resolve?name=${target}&type=TXT`);
      const spfData = await spfRes.json();
      const spfRec = (spfData.Answer || []).find(a => a.data.includes('v=spf1'));
      
      const dmarcRes = await fetch(`https://dns.google/resolve?name=_dmarc.${target}&type=TXT`);
      const dmarcData = await dmarcRes.json();
      const dmarcRec = (dmarcData.Answer || []).find(a => a.data.includes('v=DMARC1'));
      
      console.log(`  ${COLORS.yellow}[+] EMAIL HYGIENE VERIFIED:${COLORS.reset}`);
      console.log(`      SPF:   ${spfRec ? spfRec.data : COLORS.red + 'MISSING' + COLORS.reset}`);
      console.log(`      DMARC: ${dmarcRec ? dmarcRec.data : COLORS.red + 'MISSING' + COLORS.reset}\n`);
    } else if (command === 'entropy') {
      let p = {};
      for (let i = 0; i < target.length; i++) p[target[i]] = (p[target[i]] || 0) + 1;
      let entropy = 0;
      for (let key in p) {
        const freq = p[key] / target.length;
        entropy -= freq * Math.log2(freq);
      }
      console.log(`  ${COLORS.yellow}[+] SHANNON ENTROPY EVALUATED:${COLORS.reset}`);
      console.log(`      Entropy: ${entropy.toFixed(4)} bits/char\n`);
    } else if (command === 'urlparse') {
      let u = target;
      if (!u.startsWith('http')) u = 'http://' + u;
      const parsed = new URL(u);
      console.log(`  ${COLORS.yellow}[+] URL DISSECTED:${COLORS.reset}`);
      console.log(`      Host:   ${parsed.hostname}`);
      console.log(`      Protocol: ${parsed.protocol}`);
      console.log(`      Path:   ${parsed.pathname}`);
      console.log(`      Params: ${parsed.search}\n`);
    } else if (command === 'decode') {
      const decoded = Buffer.from(target, 'base64').toString('utf-8');
      console.log(`  ${COLORS.yellow}[+] base64 DECODED:${COLORS.reset}`);
      console.log(`      ${decoded}\n`);
    } else if (command === 'hex') {
      const hex = target.replace(/\s+/g, '');
      let str = '';
      for (let i = 0; i < hex.length; i += 2) {
        const code = parseInt(hex.substr(i, 2), 16);
        if (!isNaN(code)) str += String.fromCharCode(code);
      }
      console.log(`  ${COLORS.yellow}[+] HEX DECODED:${COLORS.reset}`);
      console.log(`      ${str}\n`);
    } else if (command === 'sherlock') {
      console.log(`  ${COLORS.yellow}[*] Sweeping Social Media for username: ${target}${COLORS.reset}`);
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
      for (const p of platforms) {
          console.log(`      ${COLORS.blue}[${p.name}]${COLORS.reset}\t ${p.url}`);
      }
      console.log("\n");
    } else if (command === 'nexus') {
      console.log(`  ${COLORS.yellow}[*] Activating NEXUS AI Profiler for: ${target}${COLORS.reset}`);
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
         throw new Error("GEMINI_API_KEY environment variable is missing. Export it to use NEXUS AI.");
      }
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      
      console.log(`  ${COLORS.yellow}[*] Sweeping social media (Instagram, Twitter...) via Live Web Grounding...${COLORS.reset}\n`);
      try {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are NEXUS, an advanced OSINT module. Conduct an investigation on the entity or username known as "${target}". 
               Search across social media platforms (Instagram, Twitter, TikTok, LinkedIn) and the open web.
               Format the response strictly as a sterile, professional terminal output.
               DO NOT USE Markdown headers (#). Use bracketed sections like [KNOWN ALIASES].
               Include these exact sections:
               [TARGET ACQUISITION]
               [SOCIAL MEDIA FOOTPRINT]
               [DIGITAL EXPOSURE]
               [PSYCHOMETRIC PROFILE]
               Keep the tone analytical, concise, and grounded in real-world footprint data.`,
            config: {
              tools: [{ googleSearch: {} }],
              temperature: 0.2
            }
         });
         console.log(response.text);
         console.log("\n");
      } catch (e) {
         throw new Error("NEXUS API Failure: " + (e.message || e.toString()));
      }
    } else if (command === 'ask') {
      console.log(`  ${COLORS.yellow}[*] Uplinking to ORACLE Cyber Advisor with query: ${target}${COLORS.reset}`);
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
         throw new Error("GEMINI_API_KEY environment variable is missing. Export it to use ORACLE AI.");
      }
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      
      try {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are ORACLE, an elite cybersecurity expert, red teamer, and incident responder.
               The user is asking you: "${target}".
               Provide advice, scripts, methodologies, or explanations strictly with a cybersecurity mindset.
               Format your response as a professional terminal output, keeping it incredibly informative, actionable, and straight to the point.
               Avoid overly conversational filler. Give the pure technical briefing.`,
            config: {
              temperature: 0.3
            }
         });
         console.log(`  ${COLORS.green}[ORACLE FEED] Transmission Received:${COLORS.reset}\n`);
         console.log(response.text);
         console.log("\n");
      } catch (e) {
         throw new Error("ORACLE API Failure: " + (e.message || e.toString()));
      }
    } else {
      console.error(`  ${COLORS.red}[!] Unknown command: ${command}${COLORS.reset}\n`);
    }

  } catch (err) {
    console.error(`  ${COLORS.red}[ERROR] ${err.message}${COLORS.reset}`);
    
    const usageMap = {
      ip: "ip <address> (e.g. ./recon.js ip 8.8.8.8)",
      dns: "dns <domain> (e.g. ./recon.js dns google.com)",
      github: "github <username> (e.g. ./recon.js github torvalds)",
      shodan: "shodan <ip> (e.g. ./recon.js shodan 8.8.8.8)",
      whois: "whois <domain> (e.g. ./recon.js whois google.com)",
      crypto: "crypto <btc_addr> (e.g. ./recon.js crypto 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa)",
      pwned: "pwned <password> (e.g. ./recon.js pwned password123)",
      dork: "dork <target> (e.g. ./recon.js dork tesla.com)",
      cert: "cert <domain> (e.g. ./recon.js cert google.com)",
      mac: "mac <mac_address> (e.g. ./recon.js mac 00:00:5e:00:53:01)",
      subnet: "subnet <cidr> (e.g. ./recon.js subnet 192.168.1.0/24)",
      hash: "hash <text> (e.g. ./recon.js hash mysecrettext)",
      encode: "encode <text> (e.g. ./recon.js encode mysecrettext)",
      cve: "cve <cve-id> (e.g. ./recon.js cve CVE-2021-44228)",
      asn: "asn <asn_number> (e.g. ./recon.js asn AS15169)",
      jwt: "jwt <token> (e.g. ./recon.js jwt eyJhbGciOi...)",
      defang: "defang <ioc> (e.g. ./recon.js defang http://malicious.com)",
      extract: "extract <text> (e.g. ./recon.js extract badguy@evil.com 1.1.1.1)",
      spf: "spf <domain> (e.g. ./recon.js spf google.com)",
      entropy: "entropy <text> (e.g. ./recon.js entropy some text here)",
      urlparse: "urlparse <url> (e.g. ./recon.js urlparse https://google.com/path)",
      decode: "decode <b64> (e.g. ./recon.js decode dGVzdA==)",
      hex: "hex <hex_string> (e.g. ./recon.js hex 48656c6c6f)",
      nexus: "nexus <handle> (e.g. ./recon.js nexus elonmusk)",
      sherlock: "sherlock <username> (e.g. ./recon.js sherlock elonmusk)",
      ask: "ask <query> (e.g. ./recon.js ask how to run nmap)"
    };

    if (command && usageMap[command]) {
       console.log(`  ${COLORS.green}💡 How to use [${command}]:${COLORS.reset}`);
       console.log(`  ${COLORS.reset}Type: ${usageMap[command]}\n`);
    } else {
       console.log("\n");
    }
  }
}

runCommand();
