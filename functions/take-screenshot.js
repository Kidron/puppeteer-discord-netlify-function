const chromium = require('chrome-aws-lambda');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const dotenv = require('dotenv');

dotenv.config();

const WHAT_CHANNEL = process.env.WHAT_CHANNELID;

client.on('ready',() => {
    console.log(`Logged in as ${client.user.tag}!`)
})

exports.handler = async (event, context) => {


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
        
            client.channels.cache.get(WHAT_CHANNEL).send("Current Benediction Queue:");
            // Split into another send command - pic wouldn't send as one
            client.channels.cache.get(WHAT_CHANNEL).send({files: ['./images/currentBeneQueue.png']});

            console.log(`Message sent to Discord ${WHAT_CHANNEL}`);

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
client.login(process.env.TOKEN)

