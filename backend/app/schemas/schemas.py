# file to hold request bodies 
from pydantic import BaseModel, ConfigDict, Field, EmailStr
from pydantic.functional_validators import BeforeValidator
from pathlib import Path

from typing_extensions import Annotated

from bson import ObjectId # used for mongo
from pymongo import AsyncMongoClient
from pymongo import ReturnDocument

PyObjectId = Annotated[str, BeforeValidator(str)]

class Example(BaseModel):
    name : str


class UserRegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLoginRequest(BaseModel):
    email : EmailStr
    password : str


# schema for users in the MongoDB table
class UserModel(BaseModel):
    id: PyObjectId | None = Field(alias = "_id", default = None)
    username: str = Field(...)
    email : EmailStr = Field(...)
    password : str = Field(...)

    packs_available: int = Field(default = 0, ge = 0)
    completed_goals : int = Field(default = 0, ge = 0)
    goals_available : int = Field(default = 3, ge = 0, le = 3)

    model_config = ConfigDict(
        populate_by_name = True, # allow population either by alias or regular id
    )

