const dns = require('dns');
const fs = require('fs');

// Set Google DNS
try {
    dns.setServers(['8.8.8.8']);
} catch (e) {
    console.error("Error setting DNS servers:", e.message);
}

const domain = '_mongodb._tcp.cluster0.hhldeas.mongodb.net';
const output = {
    srv: [],
    txt: [],
    error: null
};

console.log(`Resolving SRV and TXT for ${domain}...`);

// Resolve SRV
dns.resolveSrv(domain, (err, addresses) => {
    if (err) {
        output.error = err.message;
        saveOutput();
    } else {
        output.srv = addresses;
        // Resolve TXT
        dns.resolveTxt('cluster0.hhldeas.mongodb.net', (err, records) => {
            if (err) {
                output.txtError = err.message;
            } else {
                output.txt = records;
            }
            saveOutput();
        });
    }
});

function saveOutput() {
    fs.writeFileSync('dns_debug.json', JSON.stringify(output, null, 2));
    console.log("Done writing to dns_debug.json");
}
