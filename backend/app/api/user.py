# file to hold endpoints involving a logged in user (goals and profile)
from fastapi import APIRouter, HTTPException, status
from ..schemas.schemas import UserRegisterRequest, UserModel, UserLoginRequest  #shows how to import a schema
from pymongo import AsyncMongoClient
from dotenv import load_dotenv
import os
from bson import ObjectId
from fastapi.responses import Response
load_dotenv

MONGO_URL = os.getenv("MONGO_URL")



router = APIRouter(tags = ["user"])
client = AsyncMongoClient(MONGO_URL)

db = client.appDevHacktahon
users_collection = db.get_collection("users")
user_goals_collection = db.get_collection("user_goals")
user_cards_collection = db.get_collection("user_cards")


# all of these routes assume you have a user account


# INCOMPLETE
# STILL NEEDS CARDS AND GOAL IMPLEMENTATION
@router.get("/profile/{user_id}",
             response_description = "Go to a specific user's profile",
             response_model_by_alias = False,
             response_model = dict)
async def profile(user_id : str):

    user_db = await users_collection.find_one({"_id" : ObjectId(user_id)})

    if not user_db:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,
                            detail = "No user with that ID exists")

    cards_cursor = user_cards_collection.find({"user_id" : ObjectId(user_id)})
    user_cards = [card async for card in cards_cursor]

    # change ObjectIds into strings
    for c in user_cards:
        c["_id"] = str(c["_id"])
        c["user_id"] = str(c["user_id"])
        c["card_id"] = str(c["card_id"])
    
    # cast the userDB model into the UserModel
    user = UserModel(**user_db)

    return {"user" : user, "user_cards" : user_cards}



