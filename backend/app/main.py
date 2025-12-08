from fastapi import FastAPI, Query
from pydantic import BaseModel
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.api.user import router as user_router
from app.api.cards import router as cards_router
from dotenv import load_dotenv
import os

load_dotenv()

REACT_PORT = os.getenv("REACT_PORT")

app = FastAPI()

origins = [
    "http://localhost:5173", 
    "http://localhost:3000",  
]

# Add REACT_PORT if it's set and not already in the list
if REACT_PORT and REACT_PORT not in origins:
    origins.append(REACT_PORT)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# add router endpoints from other files
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(cards_router)


#  root page
@app.get("/")
async def root():
    return {"message":"hello world"}