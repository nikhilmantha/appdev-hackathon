# file to hold api endpoints for authentication (endpoints for login and register pages)
from fastapi import APIRouter
from ..schemas.schemas import Example #shows how to import a schema

router = APIRouter(tags = ["auth"])


@router.get('/register')
async def register():
    return {"page" : "register"}

@router.get('/login')
async def login():
    return {"page" : "login"}