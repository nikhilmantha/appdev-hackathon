# file to hold all tasks and card related functionality
from fastapi import APIRouter, HTTPException, status
from ..schemas.schemas import UserRegisterRequest, UserModel, UserLoginRequest  #shows how to import a schema
from pymongo import AsyncMongoClient
from dotenv import load_dotenv
import os
from bson import ObjectId
from fastapi.responses import Response
from datetime import date, datetime
import random

load_dotenv

MONGO_URL = os.getenv("MONGO_URL")

client = AsyncMongoClient(MONGO_URL)

db = client.appDevHacktahon
users_collection = db.get_collection("users")
user_goals_collection = db.get_collection("user_goals")
user_cards_collection = db.get_collection("user_cards")
goal_templates_collection = db.get_collection("goal_templates")
cards_collection = db.get_collection("cards")




router = APIRouter(tags = ["cards"])

# heloer method to convert ObjectIds into strings
# specifically for the user case when 
def serialize(doc):
    doc["_id"] = str(doc["_id"])
    doc["user_id"] = str(doc["user_id"])
    doc["goal_id"] = str(doc["goal_id"])
    return doc

@router.post("/tasks/{user_id}",
             response_description = "Create/See your goals",
             )
async def create_tasks(user_id : str):
    # get the current date as a string
    today_str = date.today().isoformat()

    # count how many goals are already created
    current_count = await user_goals_collection.count_documents({
        "user_id" : ObjectId(user_id),
        "assigned_for" : today_str
    })


    if current_count >= 3:
        # goals are already created
        goals = user_goals_collection.find({
            "user_id" : ObjectId(user_id),
            "assigned_for" : today_str
        })

        # convert object ids into jsonable type (String)
        return [serialize(goal) async for goal in goals]
    

    # pick 3 goals (for demo only going to grab first 3)
    picked_goals =  goal_templates_collection.find()
    templates = [template async for template in picked_goals]

    goal_set = random.sample(templates, k= 3)

    new_user_goals = []
    for template in goal_set:
        new_user_goals.append({
            "user_id" : ObjectId(user_id),
            "goal_id" : template["_id"],
            "status" : "active",
            "reward_packs" : template["reward_packs"],
            "assigned_for" : today_str,
            "created_at": datetime.now(),
            "completed_at" : None
        })
    
    
    result = await user_goals_collection.insert_many(new_user_goals)

    for g, inserted_id in zip(new_user_goals, result.inserted_ids):
        g["_id"] = inserted_id

    return [serialize(g) for g in new_user_goals]

@router.post("/tasks/{user_id}/goal/{user_goal_id}/complete",
             response_description = "Endpoint for completing a goal")
async def complete_goal(user_id : str, user_goal_id: str):
    user_goal = await user_goals_collection.find_one({
        "_id" : ObjectId(user_goal_id),
        "user_id" : ObjectId(user_id),
        "status" : "active"
    })

    # goal not found in db table
    if not user_goal:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,
                            detail = "Active goal not found")
    

    # update the relational table between users and goals
    await user_goals_collection.update_one(
        {"_id" : user_goal["_id"]},
        {"$set": {"status" : "completed", "completed_at" : datetime.now()}}

    )


    # update the user's internally tracked metrics
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$inc": {
                "completed_goals" : 1,
                "packs_available" : user_goal.get("reward_packs", 1)
            }
        }
    )


    return {"message" : "Goal completed, packs awarded"}

@router.post("/users/{user_id}/packs/open", 
             response_description = "Open a pack associated with a specific user")
async def open_pack(user_id : str):
    user = await users_collection.find_one({"_id" : ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,
                            detail = "User not found")

    if user.get("packs_available", 0) <= 0:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST,
                            detail = "No Packs Available")
    
    # decrement the pack count
    await users_collection.update_one(
        {"_id" : ObjectId(user_id)},
        {"$inc" : {"packs_available" : -1}}
    )

    # fetch some cards (all for demo)
    cards_cursor =  cards_collection.find()
    all_cards = [card async for card in cards_cursor]

    # no cards in db
    if len(all_cards) == 0:
        raise HTTPException(status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail = "No cards in database")
    
    pulled = random.sample(all_cards, k = 3) # pulls four random cards

    # update user, card relationship
    for card in pulled:
        await user_cards_collection.update_one(
            # search criteria
            {"user_id" : ObjectId(user_id),
             "card_id" : card["_id"]},

            # changing the quantity
             {"$inc" : {"quantity" : 1}},
             #insert into db if it doesn't exist
             upsert = True
        )

    return { "cards" : 
                [ {"card_id" : str(card["_id"]), "name" : card["name"] , "rarity" : card["rarity"]}  for card in pulled]}
                

@router.get("/catalog",
            response_description = "Returns all cards in the db")
async def get_catalog():

    # gets all the cards in the db
    cards_cursor =  cards_collection.find({})
    all_cards = [card async for card in cards_cursor]

    if not all_cards:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,
                            detail = "No catalog of cards in db")


    

    for card in all_cards:
        card["_id"] = str(card["_id"])

    return all_cards
    
@router.get("/goals/{goal_id}",
            response_description = "get the data for a specific goal")
async def get_goal(goal_id : str):

    goal = await goal_templates_collection.find_one({"_id" : ObjectId(goal_id)})

    if not goal:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,
                            detail = "No Goal with passed ID")
    
    goal["_id"] = str(goal["_id"])

    return goal


@router.get("/goals_all",
            response_description = "Get all available Goals")
async def get_all_goals():

    goal_cursor =  goal_templates_collection.find({})

    all_goals = [goal async for goal in goal_cursor]


    if not all_goals:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,
                            detail = "No Goals Found")
    
    
    
    # change objectIds into strings
    for goal in all_goals:
        goal["_id"] = str(goal["_id"])
    
    return all_goals
    

@router.get("/card/{card_id}",
            response_description = "Get information about a card")
async def get_card(card_id : str):

    card = await cards_collection.find_one({"_id" : ObjectId(card_id)})

    if not card:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,
                            detail = "No card found with given id")
    
    card["_id"] = str(card["_id"])

    return card


