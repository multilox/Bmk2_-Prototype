import asyncio
import logging
import aiohttp
import pathlib
from aiohttp.web_fileresponse import FileResponse
from aiogram import Bot, Dispatcher, types
from aiogram.filters.command import Command

# Включаем логирование, чтобы не пропустить важные сообщения
logging.basicConfig(level=logging.INFO)
# Объект бота
bot = Bot(token="6966357812:AAGDjuKpIqSxY0oCXcd5GM8YFNsOdDefq5g")
# Диспетчер
dp = Dispatcher()

dir_p=pathlib.Path.cwd()


# Хэндлер на команду /start
@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    await message.answer("Hello!")
p1 = pathlib.Path(dir_p, "html", "snake.html")
@dp.message(Command("zmey"))
async def index(message: types.Message):
    await message.answer("Hello!", reply_markup=types.InlineKeyboardButton(text="play, zmeya",web_app=types.web_app_info.WebAppInfo(url=p1)))


# Запуск процесса поллинга новых апдейтов
async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
