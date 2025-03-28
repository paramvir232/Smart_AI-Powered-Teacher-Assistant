from fastapi import APIRouter, Depends,FastAPI, HTTPException
from sqlalchemy.orm.session import Session
from DB.database import get_db  # Import database connection
from DB import *  # Import User model
from pydantic import BaseModel


college_route = APIRouter(prefix="/college", tags=["COLLEGE"])


@college_route.get("/{college_id}/teacher_list/")
def teachers(college_id:int ,db: Session = Depends(get_db)):
    return CRUD.universal_query(
    db=db,
    base_model=Teacher,
    joins=[(College, College.id == Teacher.college_id)],
    attributes={"teachers": ["id","Tname"]},
    filters=[College.id == college_id]  # Ensure filters are in a list
)
@college_route.get("/{college_id}/details")
def detail(college_id:int ,db: Session = Depends(get_db)):

    return CRUD.get_item(db,College,college_id)

class addTeacher(BaseModel):
    id:int
    Tname: str
    email: str
    college_id: int  # Example attributes for a teacher

# Use POST instead of GET for adding a teacher
@college_route.post("/add_teacher/")
def add_teacher(teacher: addTeacher, db: Session = Depends(get_db)):
    # ✅ Check if the college exists before adding tteacher
    data = {
  "id": teacher.id,
  "Tname": teacher.Tname,
  "email": teacher.email,
  "college_id": teacher.college_id
}

    # ✅ Insert teacher into the database
    new_teacher = CRUD.add_item(db, Teacher, **data)
    raise HTTPException(status_code=200, detail="Teacher Added Successfully")

class LOGIN(BaseModel):
    id:int
    password: str  # Example attributes for a teacher

@college_route.post("/login/")
def login(data: LOGIN, db: Session = Depends(get_db)):
    # ✅ Get college data using CRUD
    college_data = CRUD.get_item(db, College, data.id)

    if not college_data:
        raise HTTPException(status_code=404, detail="College not found")

    # ✅ Check if password matches
    if data.password == college_data.password:
        return {"Message":"Success Login","ID": data.id}

    # ✅ Proper failure response
    raise HTTPException(status_code=401, detail="Invalid password")
        
    