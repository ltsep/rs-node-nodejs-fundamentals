import { stdout as output } from 'process';
import { parseArgs } from 'util';

const progress = () => {
  // Write your code here
  // Simulate progress bar from 0% to 100% over ~5 seconds
  // Update in place using \r every 100ms
  // Format: [████████████████████          ] 67%

  // --duration <milliseconds> — total duration in milliseconds (default: 5000)
  // --interval <milliseconds> — update interval in milliseconds (default: 100)
  // --length <number> — progress bar character length (default: 30)
  // --color <hex> — optional color for the filled part of the progress bar in #RRGGBB format (default: no color)

  const { values: argValues } = parseArgs({
    args: process.argv.slice(2),
    options: {
      duration: { type: 'string' },
      interval: { type: 'string' },
      length: { type: 'string' },
      color: { type: 'string' },
    },
    allowPositionals: false,
  });

  const duration = argValues.duration ? Number(argValues.duration) : 5000;
  const ms = argValues.interval ? Number(argValues.interval) : 100;
  const length = argValues.length ? Number(argValues.length) : 30;
  let hexColor = argValues.color || '#ffffff';
  hexColor = hexColor.replace('#', '');

  const steps = Math.round(duration / ms);
  const arr = Array(length).fill(' ');

  let offset = 0;

  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);

  const fgColorString = `\x1b[38;2;${r};${g};${b}m`;
  const _bgColorString = `\x1b[48;2;${r};${g};${b}m`;
  const resetFormatString = `\x1b[0m`;

  const printInterval = setInterval(() => {
    const index = Math.round((offset / steps) * length);
    arr.fill('█', 0, index);
    const res = `${fgColorString}\r[${arr.join('')}]${resetFormatString}`;

    output.write(res);

    if (offset === steps) {
      clearInterval(printInterval);
      output.write('\nDone!\n');
      return;
    }

    offset++;
  }, ms);
};

progress();
