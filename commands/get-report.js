const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { table } = require('table');

const { log } = console;
const { blue, blueBright, green, greenBright, red, redBright, yellow, yellowBright } = chalk;

let reporterFiles;

module.exports = function(reporter, options) {
  try {
    if (!reporterFiles) {
      reporterFiles = fs.readdirSync(path.join(__dirname, '../reporters/'));
    }

    // get reporter to run
    const reporterFileToRun = reporterFiles
      .find(file => file.toLowerCase() === reporter.toLowerCase() ||
      file.toLowerCase() === reporter.toLowerCase() + '.js');

    if (!reporterFileToRun) {
      throw new Error(`Cannot find reporter '${reporter}'`);
    }

    const rpt = require(`../reporters/${reporterFileToRun}`);
    rpt.on('report', (msg) => {
      if (msg.type === 'console') {
        const output = table(msg.data, msg.options);
        console.log(output);
      }
    });
    const name = rpt.name || reporterFileToRun;
    rpt.on('error', (msg) => log(redBright(`[${name}] ${msg}`)));
    rpt.on('failure', (msg) => log(redBright(`[${name}] ${msg}`)));
    rpt.on('info', (msg) => log(blueBright(`[${name}] ${msg}`)));
    rpt.on('success', (msg) => log(greenBright(`[${name}] ${msg}`)));
    rpt.on('warning', (msg) => log(yellowBright(`[${name}] ${msg}`)));
    rpt.init(options);
    rpt.start();
  } catch (error) {
    log(redBright(error.message));
    log(error);
  }
}