import asyncio
import logging
import aiohttp
import pathlib
from aiohttp.web_fileresponse import FileResponse
from aiogram import Bot, Dispatcher, types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton,MenuButtonWebApp
from aiogram.types.web_app_info import WebAppInfo
from aiogram.filters.command import Command

# Включаем логирование, чтобы не пропустить важные сообщения
logging.basicConfig(level=logging.INFO)
# Объект бота
bot = Bot(token="6966357812:AAGDjuKpIqSxY0oCXcd5GM8YFNsOdDefq5g")
# Диспетчер
dp = Dispatcher()

dir_p=pathlib.Path.cwd()

inline_btn_1 = InlineKeyboardButton("lox",))
inline_kb1 = InlineKeyboardMarkup().add(inline_btn_1)
@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    await message.reply("Just a web app integrated withen telegram! 😀",
                        reply_markup=inline_btn_1(
                            [
                                [
                                    inline_btn_1(
                                        "Open Web app 💥",
                                        web_app=WebAppInfo(url="https://multilox.github.io/Bmk2_-Prototype/"))
                                ]
                            ]
                        ))


# Запуск процесса поллинга новых апдейтов
async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
