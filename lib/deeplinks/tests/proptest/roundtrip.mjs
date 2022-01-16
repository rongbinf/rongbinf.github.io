import { chromium, firefox } from 'playwright';
import { getLocation, getSelection, randomlySelect } from './util.mjs';
import process from 'process';

export default async (port, browserType, runs) => {
  const url = `http://localhost:${port}/tests/html/e2e.html`;
  const browser = browserType === 'chromium' ? await chromium.launch() : await firefox.launch();
  const page = await browser.newPage();
  let testsRun = 0;
  for (;;) {
    await page.goto(url);

    let replication = await page.evaluate(randomlySelect);
    let origSelection = await page.evaluate(getSelection);
    let location = await page.evaluate(getLocation);

    await page.goto('about:blank');
    await page.goto(location);

    let newSelection = await page.evaluate(getSelection);

    let origSelectionTest, newSelectionTest;
    if (browserType === 'firefox') {
      // Firefox includes whitespace for element node selections, but not for
      // text node selections. Since we convert all selections to text node
      // selections, we need to trim this.
      origSelectionTest = origSelection.split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n').trim();
      newSelectionTest = newSelection.split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n').trim();
    } else {
      origSelectionTest = origSelection.trim();
      newSelectionTest = newSelection.trim();
    }

    if (origSelectionTest !== newSelectionTest) {
      console.log(`\nFAILED!\n${location}\n--- EXPECTED: ---\n${origSelectionTest}\n--- RECEIVED: ---\n${newSelectionTest}\n--- REPLICATION: ---\n${replication}`);
      return false;
    }

    testsRun++;
    process.stdout.write(`tests run: ${testsRun}\r`);
    if (testsRun === runs) {
      console.log('');
      return true;
    }
  }
};

