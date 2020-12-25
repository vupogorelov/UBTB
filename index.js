const fs = require("fs");
const TelegramBot = require('node-telegram-bot-api'); // подключаем node-telegram-bot-api

//const book = fs.readFileSync("ubrus.js").toString();
const book = fs.readFileSync("test.txt").toString();

const token = '1476739596:AAEyV7EFAw8TTwDyLsN9DkvKS-slZ5K68BU'; // тут токен кторый мы получили от botFather
const bot = new TelegramBot(token, {polling: true});

let arrayFindWords=[]; //тут будем хранить результат поиска глобально, чтобы был доступ из любого места кода

//конфиг клавиатуры
const keyboard1 = [
	[
		{
			text: 'Показать всё в одном сообщении', // текст на кнопке
			callback_data: 'showOne' // данные для обработчика событий
		}
	],
	[
	    {
			text: 'Показать разными сообщениями',
			callback_data: 'showMulti'
	    }
	],
];

// обработка любых соощений
bot.on('message', (msg) => {
	const chatId = msg.chat.id;

	if (msg.text == '?') {
	    bot.sendMessage(chatId, 'Напишите: найти [что искать] \nБез квадратных скобок. \nПосле лова "найти"" должен быть пробел!');
    } else {
        bot.sendMessage(chatId, 'Напишите: найти [что искать]');
    }
});

// обработчик событий клавиатуры
bot.on('callback_query', (query) => {
	const chatId = query.message.chat.id;
	let msgMaxLimit = 10; //config.msgLimits[1];
	let ret = "";


	if (query.data === 'showOne') {
		for (var i = 0; i < msgMaxLimit && i < arrayFindWords.length; i++) {
		    ret += i+1 + '\n' + arrayFindWords[i] + '\n\n';
		}
		bot.sendMessage(chatId, ret);
	}

	if (query.data === 'showMulti') {
		for (var i = 0; i < msgMaxLimit && i < arrayFindWords.length; i++) {
		    bot.sendMessage(chatId, i+1 + '\n' + arrayFindWords[i]);
		}
	}
});



// обработка если найден триггер-текст
bot.onText(/найти (.+)/, function (msg, match) {
    const chatId = msg.chat.id;

    let regEx = new RegExp('(?=[^"]*'+match[1]+')(?:^|[A-ZА-Я0-9Ё])[^"]+\.', 'gi');
	arrayFindWords = book.match(regEx);

	bot.sendMessage(chatId, 'Найдено совпадений: ' + arrayFindWords.length, {reply_markup: {inline_keyboard: keyboard1}});
	
});



// website 
const express = require('express');
const app = express();
let port = process.env.PORT || 80;

let minute = 0;

setInterval(() => {
    minute++
}, 1000 * 60)


app.get('/', (req, res) => {
    res.send(`Бот работает ${minute} минут.`)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})