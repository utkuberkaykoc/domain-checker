const whois = require('whois');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

let completedDomains = [];

const readDomainsFromFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const domains = data.split('\n').map(domain => domain.trim()).filter(domain => domain.length > 0);
        resolve(domains);
      }
    });
  });
};

const isAvailable = async (domain) => {
  return new Promise((resolve, reject) => {
    whois.lookup(domain, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const notFound = data.includes('No match for domain');
        resolve(notFound);
      }
    });
  });
};

const checkDomain = async (domain) => {
  try {
    const isDomainAvailable = await isAvailable(domain);
    if (isDomainAvailable) {
      console.log(chalk.green(`\n${chalk.blue(domain)}: Alan adı kullanılabilir.\n`));
    } else {
      console.log(chalk.red(`\n${chalk.blue(domain)}: Alan adı kullanılamaz!\n`));
    }
    return domain;
  } catch (error) {
    console.error(chalk.red(`\nHata oluştu: ${error.message}\n`));
    return null;
  }
};

const checkDomains = async () => {
  try {
    const domains = await readDomainsFromFile(path.join(__dirname, 'domains.txt'));
    const promises = domains.map(domain => checkDomain(domain));
    completedDomains = await Promise.all(promises);
    console.log(chalk.yellow(`\nTÜM ${domains.length} ALAN ADLARI TARANDI.\n`));
  } catch (error) {
    console.error(chalk.red(`\nHata oluştu: ${error.message}\n`));
  }
};

checkDomains();

/*
        _   _            _               _               _                           _   
  _   _| |_| | ___   _  | |__   ___ _ __| | ____ _ _   _| | _____   ___   _ __   ___| |_ 
 | | | | __| |/ / | | | | '_ \ / _ \ '__| |/ / _` | | | | |/ / _ \ / __| | '_ \ / _ \ __|
 | |_| | |_|   <| |_| |_| |_) |  __/ |  |   < (_| | |_| |   < (_) | (__ _| | | |  __/ |_ 
  \__,_|\__|_|\_\\__,_(_)_.__/ \___|_|  |_|\_\__,_|\__, |_|\_\___/ \___(_)_| |_|\___|\__|
                                                   |___/                                                                                
*/
