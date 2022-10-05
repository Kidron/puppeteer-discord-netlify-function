const chromium = require('chrome-aws-lambda');
const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');

dotenv.config();

const WHAT_CHANNEL = process.env.WHAT_CHANNELID;
// const whatSite = 'https://multidollar.company/';

client.on('ready',() => {
    console.log(`Logged in as ${client.user.tag}!`)
})

exports.handler = async (event, context) => {

    const whatSite = 'https://multidollar.company/';


    const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
        headless: chromium.headless,
      });

      const page = await browser.newPage();


    try {
          
            await page.goto(whatSite);
            const screenshot = await page.screenshot();
            
            const numberInQueue = await page.$eval('body > section:nth-child(1) > div > h2 > div:nth-child(1) > span', (el) => el.innerText);
            const blizzETA = await page.$eval('body > section:nth-child(1) > div > h2 > div:nth-child(2) > span', (el) => el.innerText);

            if(numberInQueue === null) {
                console.log(`Queue less than 1 - DO NOTHING`);
            } else if(numberInQueue > 0) {

                await client.channels.cache.get(WHAT_CHANNEL).send(`Number in queue: ${numberInQueue} \n Blizzard ETA: ${blizzETA}`, {files: [screenshot]});

                console.log(`Message sent to Discord ${WHAT_CHANNEL}`);

            }
            await browser.close();

            return {
                statusCode: 200,
                body: JSON.stringify({
                  status: 'Ok'
                })
            }


    } catch (error) {
        
        await browser.close();
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Failed'}),
        }
    }   
}
client.login(process.env.TOKEN);