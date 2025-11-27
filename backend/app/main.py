from fastapi import FastAPI, Query
from pydantic import BaseModel
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.api.user import router as user_router


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

# add router endpoints from other files
app.include_router(auth_router)
app.include_router(user_router)


#  root page
@app.get("/")
async def root():
    return {"message":"hello world"}