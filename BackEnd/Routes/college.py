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
    Tpass: str
    college_id: int  # Example attributes for a teacher

# Use POST instead of GET for adding a teacher
@college_route.post("/add_teacher/")
def add_teacher(teacher: addTeacher, db: Session = Depends(get_db)):
    #   Check if the college exists before adding tteacher
    data = {
  "id": teacher.id,
  "Tname": teacher.Tname,
  "Tpass": teacher.Tpass,
  "college_id": teacher.college_id
}

    #   Insert teacher into the database
    new_teacher = CRUD.add_item(db, Teacher, **data)
    raise HTTPException(status_code=200, detail="Teacher Added Successfully")

class LOGIN(BaseModel):
    id:int
    password: str  # Example attributes for a teacher

@college_route.post("/login/")
def login(data: LOGIN, db: Session = Depends(get_db)):
    #   Get college data using CRUD
    college_data = CRUD.get_item(db, College, data.id)

    if not college_data:
        raise HTTPException(status_code=404, detail="College not found")

    #   Check if password matches
    if data.password == college_data.password:
        return {"Message":"Success Login","ID": data.id}

    #   Proper failure response
    raise HTTPException(status_code=401, detail="Invalid password")
        
class addStudent(BaseModel):
    id:int
    Sname: str
    Spass: str
    college_id: int  # Example attributes for a teacher

# Use POST instead of GET for adding a teacher
@college_route.post("/add_student/")
def add_Student(STD: addStudent, db: Session = Depends(get_db)):
    #   Check if the college exists before adding tteacher
    data = {
  "id": STD.id,
  "Sname": STD.Sname,
  "Spass": STD.Spass,
  "college_id": STD.college_id
}

    #   Insert teacher into the database
    new_STD = CRUD.add_item(db, Student, **data)
    raise HTTPException(status_code=200, detail="Student Added Successfully")

@college_route.get("/{college_id}/class_list/")
def get_classes(college_id: int, db: Session = Depends(get_db)):
    return CRUD.universal_query(
        db=db,
        base_model=Class,
        joins=[
            (Teacher, Teacher.id == Class.teacher_id),  # First join Teacher to Class
            (College, College.id == Teacher.college_id) # Then join College to Teacher
        ],
        attributes={"classes": ["id", "Cname"]},
        filters=[College.id == college_id]  # Ensure filters are in a list
    )

class setEnrollment(BaseModel):
    student_id: int
    class_id: int

@college_route.post("/enroll/")
def set_Enrollment(STD: setEnrollment, db: Session = Depends(get_db)):
    # Check if the enrollment already exists
    existing_enrollment = db.query(Enrollment).filter_by(
        student_id=STD.student_id, class_id=STD.class_id
    ).first()

    if existing_enrollment:
        raise HTTPException(status_code=400, detail="Student already enrolled in this class.")

    # Insert new enrollment (id will auto-increment)
    new_enrollment = Enrollment(student_id=STD.student_id, class_id=STD.class_id)
    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)

    return {"message": "Enrollment Added Successfully", "enrollment_id": new_enrollment.id}


@college_route.get("/{College_id}/student_list/")
def get_student(College_id:int ,db: Session = Depends(get_db)):
    return CRUD.universal_query(
    db=db,
    base_model=Student,
    joins=[(College, College.id == Student.college_id)],
    filters=[College.id == College_id]  # Ensure filters are in a list
)


@college_route.get("/{college_id}/search_student/{student_id}")
def search_student(College_id:int,student_id:int,db: Session = Depends(get_db)):
    return CRUD.universal_query(
    db=db,
    base_model=Student,
    joins=[(College, College.id == Student.college_id)],
    filters=[College.id == College_id,
             Student.id == student_id]  # Ensure filters are in a list
)

@college_route.get("/{college_id}/search_teacher/{Teacher_id}")
def search_teacher(College_id:int,Teacher_id:int,db: Session = Depends(get_db)):
    return CRUD.universal_query(
    db=db,
    base_model=Teacher,
    joins=[(College, College.id == Teacher.college_id)],
    filters=[College.id == College_id,
            Teacher.id == Teacher_id]  # Ensure filters are in a list
)

class _SIGNUP_(BaseModel):
    id : int
    Colname: str
    password: str
    Cemail: str
    Ccontact: str

@college_route.post("/signup")
def signup(sign_up_data: _SIGNUP_ ,db: Session = Depends(get_db)):
    try:
        data = {
        "id": sign_up_data.id,
        "Colname": sign_up_data.Colname,
        "password": sign_up_data.password,
        "Cemail": sign_up_data.Cemail,
        "Ccontact": sign_up_data.Ccontact
        }
        new_submission = CRUD.add_item(db, College, **data)
        return {"message": "Successful Signup!", "id": sign_up_data.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


class UpdatePassword(BaseModel):
    id: int
    new_password: str

@college_route.patch("/update-password")
def update_college_password(payload: UpdatePassword, db: Session = Depends(get_db)):
    college = db.query(College).filter(College.id == payload.id).first()
    if not college:
        raise HTTPException(status_code=404, detail="College not found")

    college.password = payload.new_password
    db.commit()
    db.refresh(college)

    return {"message": "Password updated successfully"}