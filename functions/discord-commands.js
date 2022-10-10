const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const Discord = require('discord.js');
const client = new Discord.Client();



const WHAT_CHANNEL = process.env.WHAT_CHANNELID;
const whatSite = 'https://multidollar.company/';


const sendQueue = async () => {

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
});

const page = await browser.newPage();

  try {

    await page.goto(whatSite);
    const screenshot = await page.screenshot();

    let numberInQueue = await page.$eval('body > section:nth-child(1) > div > h2 > div:nth-child(1)', (el) => el.innerText);
    numberInQueue = numberInQueue.replace(/\D/g,'');
    numberInQueue = parseInt(numberInQueue);

    const blizzETA = await page.$eval('body > section:nth-child(1) > div > h2 > div:nth-child(2)', (el) => el.innerText);


   await client.channels.cache.get(WHAT_CHANNEL).send(`Number in queue: ${numberInQueue} \n${blizzETA}`, {files: [screenshot]});

    console.log(`Message sent to Discord ${WHAT_CHANNEL}`);

    await browser.close();
    client.destroy();

    // if(numberInQueue > 0 || numberInQueue < 15000) {

    //     client.channels.cache.get(WHAT_CHANNEL).send(`Number in queue: ${numberInQueue} \n${blizzETA}`, {files: [screenshot]});

    //     console.log(`Message sent to Discord ${WHAT_CHANNEL}`);
    // } else {
    //     console.log(`Queue less than 1`);
    // }

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



client.on('ready',() => {
    console.log(`Logged in as ${client.user.tag}!`)
})




exports.handler = async (event, context) => {

    
    client.login(process.env.TOKEN);

    client.on('message', (message) => {
      if (message.author.bot) return;
      if (message.content === "$q" || message.content === "$queue") {
        console.log("$q was typed");
        await(sendQueue);
      }
    });

    // const browser = await puppeteer.launch({
    //     args: chromium.args,
    //     defaultViewport: chromium.defaultViewport,
    //     executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
    //     headless: chromium.headless,
    //     ignoreHTTPSErrors: true,
    // });

    // const page = await browser.newPage();



    // try {
    
    //         await page.goto(whatSite);
    //         const screenshot = await page.screenshot();

    //         let numberInQueue = await page.$eval('body > section:nth-child(1) > div > h2 > div:nth-child(1)', (el) => el.innerText);
    //         numberInQueue = numberInQueue.replace(/\D/g,'');
    //         numberInQueue = parseInt(numberInQueue);

    //         const blizzETA = await page.$eval('body > section:nth-child(1) > div > h2 > div:nth-child(2)', (el) => el.innerText);


    //        await client.channels.cache.get(WHAT_CHANNEL).send(`Number in queue: ${numberInQueue} \n${blizzETA}`, {files: [screenshot]});

    //         console.log(`Message sent to Discord ${WHAT_CHANNEL}`);

    //         await browser.close();
    //         client.destroy();

    //         // if(numberInQueue > 0 || numberInQueue < 15000) {

    //         //     client.channels.cache.get(WHAT_CHANNEL).send(`Number in queue: ${numberInQueue} \n${blizzETA}`, {files: [screenshot]});

    //         //     console.log(`Message sent to Discord ${WHAT_CHANNEL}`);
    //         // } else {
    //         //     console.log(`Queue less than 1`);
    //         // }

    //         return {
    //             statusCode: 200,
    //             body: JSON.stringify({
    //               status: 'Ok'
    //             })
    //         }


    // } catch (error) {
    //     await browser.close();
    //     console.log(error);
    //     return {
    //         statusCode: 500,
    //         body: JSON.stringify({error: 'Failed'}),
    //     }
    // }   
}
