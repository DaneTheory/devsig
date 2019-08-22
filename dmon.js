#!/usr/bin/env node
const chalk = require('chalk');

process.on('uncaughtException', (error) => {
  console.log(chalk.redBright(error.message));
  console.log(error);
});

const program = require('commander');

const { startMonitor } = require('./commands');
const { getAndVerifyEmail } = require('./middleware');

function commaSeparatedList(value, previous) {
  return value.split(',');
}

program
  .version('0.0.1')
  .description('DMon Agent');

program
  .command('start [monitor]')
  .option('-a, --apps <apps>', 'list the apps to monitor', commaSeparatedList)
  .option('-k, --key-events <events>', 'list the keyboard events to monitor', commaSeparatedList)
  .option('-m, --mouse-events <events>', 'list the mouse events to monitor', commaSeparatedList)
  .description('Start a monitor or all monitors')
  //.action(getAndVerifyEmail)
  .action(startMonitor);

program.parse(process.argv);
  