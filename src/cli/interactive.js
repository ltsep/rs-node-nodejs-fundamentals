import readline from 'readline';
import { stdin as input, stdout as output, cwd } from 'process';

const interactive = async () => {
  // Write your code here
  // Use readline module for interactive CLI
  // Support commands: uptime, cwd, date, exit
  // Handle Ctrl+C and unknown commands

  const rl = readline.createInterface({ input, output, prompt: '> ' });

  const now = Date.now();

  rl.prompt();

  rl.on('line', (cmd) => {
    switch (cmd) {
      case 'uptime':
        const seconds = ((Date.now() - now) / 1000).toFixed(2);
        const uptime = `${seconds}s\n`;
        output.write(uptime);
        break;

      case 'cwd':
        output.write(cwd() + '\n');
        break;

      case 'date':
        const currentDateIso = new Date().toISOString();
        output.write(currentDateIso + '\n');
        break;

      case 'exit':
        output.write('Goodbye!\n');
        process.exit(0);

      default:
        output.write('Unknown command\n');
    }

    rl.prompt();
  });

  rl.on('SIGINT', () => {
    output.write('\nGoodbye!\n');
    rl.close();
    process.exit(0);
  });
};

interactive();
