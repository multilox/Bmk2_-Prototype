import vk_api
import requests

TOKEN_USER ="98cb699a98cb699a98cb699afb9bdc91be998cb98cb699afed0df25645ce860329b61e3"
VERSION = 5.199
DOMAIN =  "assshit228"
# через api vk вызываем статистику постов

response = requests.get('https://api.vk.com/method/wall.get',
params={'access_token': TOKEN_USER,
                'v': VERSION,
                'domain': DOMAIN,
                })

data = response.json()["response"]["items"]
print(data)
# https://api.vk.com/method/wall.get?access_token=98cb699a98cb699a98cb699afb9bdc91be998cb98cb699afed0df25645ce860329b61e3&v=5.199&domain=kubsu_official