import time

from selenium import webdriver
from bs4 import BeautifulSoup
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from webdriver_manager.microsoft import EdgeChromiumDriverManager

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CheckBody (BaseModel):
    website: str
    html: str

@app.get('/')
def home():
    return {
        'Name': 'Ozinpic Server'
    }

@app.post('/get')
async def crawl(payload: CheckBody):

    product = []

    if(payload.website == 'red-bubble'):
        try:
            mySoup = BeautifulSoup(payload.html, 'html.parser')

            id: int = 1
        
            for container in mySoup.find_all('a', {'class': 'styles__link--3QJ5N'}):
                productLink = container.get('href')
                productName = container.find('span', {'class': 'styles__box--2Ufmy styles__text--23E5U styles__display6--3wsBG styles__nowrap--33UtL styles__display-block--3kWC4'}).text
                productImage = container.find('img', {'class': 'styles__image--G1zaZ styles__productImage--k9E27 styles__rounded--Mb445 styles__fluid--1Qsjf'})
                imageLink = productImage.get('src')
                imageAlt = productImage.get('alt')
                product.append({
                    'add': 1,
                    'key': id,
                    'link': productLink,
                    'name': productName,
                    'image': {
                        'link': imageLink,
                        'alt': imageAlt
                    }
                })
                id = id + 1
        except:
            return {
                "success": "false",
                "message": "Internal Server Error"
            }
    

        return {
            "success": "true",
            "product": {
                "total": id - 1,
                "list": product
            },
            "time": round(time.time() * 1000)
        }

    if(payload.website == 'amazon'):
        return {
            "success": "true",
            "product": {
                "total": 0,
                "list": []
            },
            "time": round(time.time() * 1000)
        }