from fastapi import FastAPI, Query
from pydantic import BaseModel
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "add local host for react here (individual port)" # will figure out hosting later
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#  root page
@app.get("/")
async def root():
    return {"message":"hello world"}