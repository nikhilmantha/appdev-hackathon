# file to hold request bodies 
from pydantic import BaseModel
from pathlib import Path

class Example(BaseModel):
    name : str