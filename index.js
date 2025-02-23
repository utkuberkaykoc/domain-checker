const whois = require('whois');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

/**
 * Reads domains from a file.
 * @param {string} filePath - Path to the file containing domain names.
 * @returns {Promise<string[]>} - Returns a list of domains.
 */
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

/**
 * Checks if a domain is available.
 * @param {string} domain - Domain name to check.
 * @returns {Promise<boolean>} - Returns true if available, false otherwise.
 */
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

/**
 * Checks and prints domain availability.
 * @param {string} domain - Domain name to check.
 * @returns {Promise<void>}
 */
const checkDomain = async (domain) => {
  try {
    const isDomainAvailable = await isAvailable(domain);
    if (isDomainAvailable) {
      console.log(chalk.green(`\n${chalk.blue(domain)}: Available ✅\n`));
    } else {
      console.log(chalk.red(`\n${chalk.blue(domain)}: Not Available ❌\n`));
    }
  } catch (error) {
    console.error(chalk.red(`\nError: ${error.message}\n`));
  }
};

/**
 * Checks domains from a given file.
 * @param {string} filePath - Path to the file containing domain names.
 * @returns {Promise<void>}
 */
const checkDomainsFromFile = async (filePath) => {
  try {
    const domains = await readDomainsFromFile(filePath);
    const promises = domains.map(domain => checkDomain(domain));
    await Promise.all(promises);
    console.log(chalk.yellow(`\nScanned ${domains.length} domains.\n`));
  } catch (error) {
    console.error(chalk.red(`\nError: ${error.message}\n`));
  }
};

module.exports = {
  checkDomain,
  checkDomainsFromFile
};
