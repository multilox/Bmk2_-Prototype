import asyncio
import logging
import aiohttp
import pathlib
from aiohttp.web_fileresponse import FileResponse
from aiogram import Bot, Dispatcher, types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.types.web_app_info import WebAppInfo
from aiogram.filters.command import Command


logging.basicConfig(level=logging.INFO)

bot = Bot(token="6966357812:AAGDjuKpIqSxY0oCXcd5GM8YFNsOdDefq5g")

dp = Dispatcher()

dir_p=pathlib.Path.cwd()



buttons = InlineKeyboardMarkup(
    inline_keyboard=[
        [InlineKeyboardButton(text='play', web_app=WebAppInfo(url="https://multilox.github.io/Bmk2_-Prototype/")),]]
)

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    await message.reply("2048",reply_markup=buttons)


# Запуск процесса поллинга новых апдейтов
async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
