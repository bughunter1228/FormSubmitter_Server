const express = require("express");
const cors = require("cors");
const TelegramBot = require("node-telegram-bot-api");

require("dotenv").config();

const app = express();
const PORT = 5000;
const botToken = process.env.BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: true });

app.use(express.json());
app.use(cors());

const fields = {
  agent: "Agent Name",
  resort_touring: "Resort Touring",
  tour_date: "Tour Date",
  tour_time: "Tour Time",
  marital_status: "Marital Status",
  credit_debit: "Credit Card or Debit Card",
  guest1: "Guest #1",
  guest2: "Guest #2",
  pn_guest1: "Phone number Guest #1",
  pn_guest2: "Phone number Guest #2",
  street_address: "Street Address",
  city: "City",
  state: "State",
  zip_code: "Zip Code",
  email: "Email",
  deposit: "Deposit",
  gifts: "Gifts",
  opc_name: "OPC Name",
  greeter_name: "Greeter Name",
  location_booked: "Location Booked",
  notes: "Notes",
};

const GroupIds = [-4864425856];
const TamkiaGroupId = -4786958434;
const ChrisGroupId = -4830546618;
const LenoreGroupId = -4696262982;
const LillyGroupId = -4612332483;
const ScottGroupId = -4862020380;
const CharlesGroupId = -4891932983;
const RobertGroupId = -4947136943;
const TaniaGroupId = -4891926604;
const MarshaGroupId = --4909044283;
const RodneyGroupId = -4805379953;

bot.onText(/\/start/, async (msg, match) => {
  try {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || "there";

    const appUrl = "https://form-submitter-mini-app.vercel.app/";

    const welcomeMessage = `Hello ${firstName}, Let's start submitting`;

    const opts = {
      reply_markup: {
        inline_keyboard: [[{ text: "Start", web_app: { url: appUrl } }]],
      },
    };

    bot.sendMessage(chatId, welcomeMessage, opts);
  } catch (error) {
    console.log("Error occured: ", error.message);
  }
});

const getSavedDataMessage = async (data) => {
  const entries = Object.entries(fields);
  let message = "";

  // Print each key-value pair
  entries.forEach(([key, value]) => {
    if (key === 'agent') {
      if (data[key].length) {
        message = `${message}\n🌟 ${value}: ${data[key]} 🌟`;
      } else {
        message = `${message}\n🌟 ${value}:`;
      }
    } else {
      if (data[key].length) {
        message = `${message}\n✅ ${value}: ${data[key]}`;
      } else {
        message = `${message}\n☑️ ${value}:`;
      }
    }
  });

  return message;
};

app.post("/send", async (req, res) => {
  const data = req.body;

  try {
    const message = await getSavedDataMessage(data);
    const targetGroups = [...GroupIds];

    // Add Tamkia's group if the agent is Tamkia Ayala
    if (data.agent === "Tamkia Ayala") {
      targetGroups.push(TamkiaGroupId);
    }

    if (data.agent === "Chris Zepeda") {
      targetGroups.push(ChrisGroupId);
    }

    if (data.agent === "Lenore McAndrew") {
      targetGroups.push(LenoreGroupId);
    }

    if (data.agent === "Lilly Yacin") {
      targetGroups.push(LillyGroupId);
    }

    if (data.agent === "Scott Ritter") {
      targetGroups.push(ScottGroupId);
    }

    if (data.agent === "Charles Taylor") {
      targetGroups.push(CharlesGroupId);
    }

    if (data.agent === "Robert Enriquez") {
      targetGroups.push(RobertGroupId);
    }

    if (data.agent === "Tania Palacios") {
      targetGroups.push(TaniaGroupId);
    }
    
    if (data.agent === "Marsha Souma") {
      targetGroups.push(MarshaGroupId);
    }
    
    if (data.agent === "Rodney Arnold") {
      targetGroups.push(RodneyGroupId);
    }
    // Wait for Telegram to respond
    targetGroups.forEach(async (groupId) => {
      await bot.sendMessage(groupId, message);
    });

    res.status(200).json({
      status: "success",
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Telegram error:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to send Telegram message",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Scraper server running at http://localhost:${PORT}`);
});
