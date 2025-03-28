from fastapi import APIRouter, Depends
from sqlalchemy.orm.session import Session
from DB.database import get_db  # Import database connection
from DB import *  # Import User model
# from DB import CRUD  # Import CRUD functions
# from schemas import UserSchema  # Pydantic schema

router = APIRouter(prefix="/users", tags=["test"])


@router.get("/")
def test(db: Session = Depends(get_db)):
    return CRUD.universal_query(
    db=db,
    base_model=Class,
    joins=[(Teacher, Teacher.id == Class.teacher_id)],
    attributes={"classes": ["Cname"], "teachers": ["name"]},
    filters=[Teacher.id == 1]  # Ensure filters are in a list
)