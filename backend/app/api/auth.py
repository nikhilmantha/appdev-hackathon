# file to hold api endpoints for authentication (endpoints for login and register pages)
from fastapi import APIRouter, HTTPException, status
from ..schemas.schemas import UserRegisterRequest, UserModel, UserLoginRequest  #shows how to import a schema
from pymongo import AsyncMongoClient
from dotenv import load_dotenv
import os
from bson import ObjectId
from fastapi.responses import Response

load_dotenv

MONGO_URL = os.getenv("MONGO_URL")




router = APIRouter(tags = ["auth"])
client = AsyncMongoClient(MONGO_URL)

db = client.appDevHacktahon
users_collection = db.get_collection("users")


@router.post('/register', response_description = "Create a New User",
             response_model  = UserModel,
             status_code = status.HTTP_201_CREATED,
             response_model_by_alias = False)
async def register(user: UserRegisterRequest):

    new_user = UserModel(
        username = user.username,
        email = user.email,
        password = user.password
        # includes all additional information server needs to store
    )


    user_db = new_user.model_dump(by_alias = True, exclude = ["id"])
    result = await users_collection.insert_one(user_db)
    
    user_db["_id"] = result.inserted_id

    return user_db

@router.post('/login', response_description = "Login to an Existing Account",
            response_model = dict,
            status_code = status.HTTP_200_OK)
async def login(user : UserLoginRequest):

    user_db = await users_collection.find_one({"email": user.email})

    if not user_db or user.password != user_db["password"]:
        raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED,
                            detail = "Incorrect Email or Password")

    return {"id": str(user_db["_id"])}



@router.delete('/delete_user/{user_id}', response_description = "Delete a user")
async def delete_user(user_id: str):

    delete_result = await users_collection.delete_one({"_id": ObjectId(user_id)})

    if delete_result.deleted_count == 1:
        return Response(status_code = status.HTTP_204_NO_CONTENT)
    

    raise HTTPException(status_code = 404, detail = f"User {user_id} is not found")