const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

require('dotenv').config();

const app = express();
const PORT = 5000;
const botToken = process.env.BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: true });

app.use(express.json());
app.use(cors());

const fields = {
    'resort_touring': 'Resort Touring',
    'tour_date': 'Tour Date',
    'tour_time': 'Tour Time',
    'marital_status': 'Marital Status',
    'credit_debit': 'Credit Card or Debit Card',
    'guest1': 'Guest #1',
    'guest2': 'Guest #2',
    'pn_guest1': 'Phone number Guest #1',
    'pn_guest2': 'Phone number Guest #2',
    'street_address': 'Street Address',
    'city': 'City',
    'state': 'State',
    'email': 'Email',
    'deposit': 'Deposit',
    'gifts': 'Gifts',
    'opc_name': 'OPC Name',
    'greeter_name': 'Greeter Name',
    'location_booked': 'Location Booked',
    'notes': 'Notes' 

}

bot.onText(/\/start/, async (msg, match) => {
    try {
        const chatId = msg.chat.id;
        const firstName = msg.from.first_name || "there";

        const appUrl = 'https://form-submitter-mini-app.vercel.app/';

        const welcomeMessage = `Hello ${firstName}, Let's start submitting`;

        const opts = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Start', web_app: { url: appUrl } }
                    ]
                ]
            }
        };

        bot.sendMessage(chatId, welcomeMessage, opts);
    } catch (error) {
        console.log("Error occured: ", error.message);
    }
});

const getSavedDataMessage = async (data) =>{
    const entries = Object.entries(fields);
    let message = '';

    // Print each key-value pair
    entries.forEach(([key, value]) => {
        if(data[key].length) {
            message = `${message}\n✅ ${value}: ${data[key]}`
        } else {
            message = `${message}\n☑️ ${value}:`
        }
    });

    return message
}


app.post('/send', async (req, res) => {
    const data = req.body;

    try {
        const message = await getSavedDataMessage(data);

        // Wait for Telegram to respond
        const telegramResponse = await bot.sendMessage(process.env.GROUP_ID, message);

        res.status(200).json({
            status: 'success',
            message: 'Message sent successfully',
            telegramMessageId: telegramResponse.message_id,
        });
    } catch (error) {
        console.error('Telegram error:', error);

        res.status(500).json({
            status: 'error',
            message: 'Failed to send Telegram message'
        });
    }
});


app.listen(PORT, () => {
    console.log(`Scraper server running at http://localhost:${PORT}`);
});