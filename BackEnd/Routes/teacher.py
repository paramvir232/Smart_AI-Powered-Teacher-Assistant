from fastapi import APIRouter, Depends,FastAPI, HTTPException
from sqlalchemy.orm.session import Session
from DB.database import get_db  # Import database connection
from DB import *  # Import User model
from pydantic import BaseModel


teacher_route = APIRouter(prefix="/college", tags=["COLLEGE"])