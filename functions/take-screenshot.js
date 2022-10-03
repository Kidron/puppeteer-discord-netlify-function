const chromium = require('chrome-aws-lambda');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const dotenv = require('dotenv');

dotenv.config();

const WHAT_CHANNEL = process.env.WHAT_CHANNELID;

exports.handler = async (event, context) => {

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    
    setInterval(function() {
  
      (async () => {
        const browser = await puppeteer.launch({
          args: chromium.args,
          executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
          headless: chromium.headless,
        });
        const page = await browser.newPage();
        await page.goto('https://multidollar.company/');
        await page.screenshot({ path: 'currentBeneQueue.png' });
      
        await browser.close();
  
        client.channels.cache.get(WHAT_CHANNEL).send("Current Benediction Queue:", {files: ['currentBeneQueue.png']});
      })();
      console.log('done');
    }, 60 * 200);
  
  });


// exports.handler = async (event, context) => {

    const pageToScreenshot = JSON.parse(event.body).pageToScreenshot;

    const browser = await chromium.puppeteer.launch({
        executablePath: await chromium.executablePath,
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        headless: chromium.headless,
    });
    
    const page = await browser.newPage();

    await page.goto(pageToScreenshot);

    const screenshot = await page.screenshot({ encoding: 'binary' });

    await browser.close();
  
    return {
        statusCode: 200,
        body: JSON.stringify({ 
            message: `Complete screenshot of ${pageToScreenshot}`, 
            buffer: screenshot 
        })
    }

}