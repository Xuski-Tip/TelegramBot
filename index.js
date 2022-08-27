const TegegramApi = require('node-telegram-bot-api')

const chats = {}

const {gameOptions,  againOptions} = require('./options.js')
const token = '5654157382:AAGmoUjOlTXkxf6OPT7D4nfV1lVROHq4oq8'

const bot = new TegegramApi(token, {polling: true})

const startGame = async(chatid)  => {
            await bot.sendMessage(chatid, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`)
            const randomNumber = Math.floor(Math.random() * 10)
            chats[chatid] = randomNumber
            await bot.sendMessage(chatid, 'Отгадывай', gameOptions)
}


const start = () => {
    bot.setMyCommands( [
        {command: '/start',  description: 'Начальное привествие'},
        {command: '/info',  description: 'Получить информацию о пользователе'},
        {command: '/game',  description: 'Игра угадай цифру'}

    ])
    
    bot.on('message',  async msg => {
        const text = msg.text
        const chatId = msg.chat.id
        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp')
            return bot.sendMessage(chatId, `Добро пожаловать) человек`)
        }
        if(text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}  ${msg.from.last_name}`)
        }
        if(text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'я вас не понимаю, пиши нормально человечишка!')
    })
    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return startGame(chatId)
        }
        if(data === chats[chatId]) {
            return bot.sendMessage(chatId, `Ну ты конечно красувчик отгадал цифру ${chats[chatId]}`, againOptions)
        } else  {
            return bot.sendMessage(chatId, `Нет не правильно ХА-Ха, правильная цифра - ${chats[chatId]}`, againOptions)
        }
    })
}
start()