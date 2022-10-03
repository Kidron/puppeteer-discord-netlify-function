const chromium = require('chrome-aws-lambda');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const dotenv = require('dotenv');

dotenv.config();

const WHAT_CHANNEL = process.env.WHAT_CHANNELID;

exports.handler = async (event, context) => {

    client.login(process.env.TOKEN)

    client.on('ready',() => {
        console.log(`Logged in as ${client.user.tag}!`)
    }

    )


    const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
        headless: chromium.headless,
      });

      const page = await browser.newPage();

    try {
        
            await page.goto('https://multidollar.company/');
            await page.screenshot({ path: './images/currentBeneQueue.png' });
          
            await browser.close();
        
            client.channels.cache.get(WHAT_CHANNEL).send("Current Benediction Queue:", {files: ['./images/currentBeneQueue.png']});

            console.log("This code ran");

            return {
                statusCode: 200,
                body: JSON.stringify({
                  status: 'Ok'
                })
            }


    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Failed'}),
        }
    }

}
