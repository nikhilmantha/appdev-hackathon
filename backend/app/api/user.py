# file to hold endpoints involving a logged in user (goals and profile)
from fastapi import APIRouter, HTTPException, status
from ..schemas.schemas import UserRegisterRequest, UserModel, UserLoginRequest  #shows how to import a schema
from pymongo import AsyncMongoClient
from dotenv import load_dotenv
import os
from bson import ObjectId
from fastapi.responses import Response
from datetime import date, datetime
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

    today_str = date.today().isoformat()

    user_db = await users_collection.find_one(
        {"_id" : ObjectId(user_id)})

    if not user_db:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,
                            detail = "No user with that ID exists")

    cards_cursor = user_cards_collection.find({"user_id" : ObjectId(user_id)})
    card_db = [card async for card in cards_cursor]

    # convert c
    for card in card_db:
        card["_id"] = str(card["_id"])
        card["user_id"] = str(card["user_id"])
        card["card_id"] = str(card["card_id"])

    
    goals_cursor = user_goals_collection.find({"user_id" : ObjectId(user_id), "assigned_for" : today_str})
    goal_db = [goal async for goal in goals_cursor]

    for goal in goal_db:
        goal["_id"] = str(goal["_id"])
        goal["user_id"] = str(goal["user_id"])
        goal["goal_id"] = str(goal["goal_id"])

    # change ObjectIds into strings

    
    # cast the userDB model into the UserModel
    user = UserModel(**user_db)

    return {"user" : user, "user_cards" : card_db, "user_goals" : goal_db}



