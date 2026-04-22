import { parseArgs } from 'util';

const dynamic = async () => {
  // Write your code here
  // Accept plugin name as CLI argument
  // Dynamically import plugin from plugins/ directory
  // Call run() function and print result
  // Handle missing plugin case

  try {
    const { values: argValues } = parseArgs({
      args: process.argv.slice(2),
      options: {
        plugin: { type: 'string' },
      },
      allowPositionals: false,
    });

    const pluginName = argValues.plugin;

    const res = await import(`./plugins/${pluginName}.js`);
    const result = res.run();
    console.log(result);
  } catch {
    console.log('Plugin not found');
  }
};

await dynamic();
