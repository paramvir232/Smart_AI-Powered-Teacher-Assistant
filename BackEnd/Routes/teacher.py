from fastapi import APIRouter, Depends,FastAPI, HTTPException,UploadFile, File, Form
from sqlalchemy.orm.session import Session
from DB.database import get_db  # Import database connection
from DB import *  # Import User model
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import cloudinary
import cloudinary.uploader
from sqlalchemy.sql.functions import func
import requests
import os
import smtplib
from dotenv import load_dotenv
from email.mime.text import MIMEText

load_dotenv()


teacher_route = APIRouter(prefix="/teacher", tags=["TEACHER"])

@teacher_route.get("/{Tid}/classes")
def classes(Tid:int,db: Session = Depends(get_db)):
    return CRUD.universal_query(
    db=db,
    base_model=Class,   
    joins=[(Teacher, Teacher.id == Class.teacher_id)],
    filters=[Class.teacher_id == Tid]  # Ensure filters are in a list
)

@teacher_route.get("/{Tid}/detail")
def Detail(Tid:int,db: Session = Depends(get_db)):
    return CRUD.get_item(db,Teacher,Tid)

@teacher_route.post("/add_assignment/")
async def add_assignment(
    title: str = Form(...),
    due_date: str = Form(...),
    teacher_id: int = Form(...),
    class_id: int = Form(...),
    file: UploadFile = File(...),  #   Accept file upload
    db: Session = Depends(get_db)
):
    try:
        #   Upload file to Cloudinary
        upload_result = cloudinary.uploader.upload(file.file)
        file_url = upload_result.get("secure_url")  #   Get file URL

        #   Insert Assignment into the database
        assignment_data = {
            "title": title,
            "cloudinary_url": file_url,  #   Save URL to DB
            "due_date": due_date,
            "teacher_id": teacher_id,
            "class_id": class_id
        }

        new_assignment = CRUD.add_item(db, Assignment, **assignment_data)

        return {"message": "Assignment added successfully!", "assignment": new_assignment}
        # return file_url
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@teacher_route.get("/upload_form", response_class=HTMLResponse)
def upload_form():
    return """
    <html>
        <body>
            <h2>Upload Assignment</h2>
            <form action="/teacher/add_assignment/" method="post" enctype="multipart/form-data">
                <label>Title:</label>
                <input type="text" name="title" required><br><br>
                
                <label>Due Date:</label>
                <input type="date" name="due_date" required><br><br>
                
                <label>Teacher ID:</label>
                <input type="number" name="teacher_id" required><br><br>
                
                <label>Class ID:</label>
                <input type="number" name="class_id" required><br><br>
                
                <label>Upload File:</label>
                <input type="file" name="file" required><br><br>
                
                <input type="submit" value="Upload">
            </form>
        </body>
    </html>
    """

@teacher_route.get('/viewstudents/{class_id}')
def view_student(class_id: int, db: Session = Depends(get_db)):
    # Query for students enrolled in the class
    students = (
        db.query(Student.id, Student.Sname, Student.college_id)
        .join(Enrollment, Enrollment.student_id == Student.id)
        .filter(Enrollment.class_id == class_id)
        .all()
    )

    # Query for submissions made by students in the class
    submissions = (
        db.query(
            Student.id,
            Assignment.title.label("assignment_title"),
            func.coalesce(Submission.grade, 0).label("grade"),
            Submission.cloudinary_url.label("url"),
            Submission.submitted_at

        )
        .join(Enrollment, Enrollment.student_id == Student.id)
        .join(Class, Class.id == Enrollment.class_id)
        .join(Assignment, Assignment.class_id == Class.id)
        .outerjoin(Submission, (Submission.assignment_id == Assignment.id) & (Submission.student_id == Student.id))
        .filter(Enrollment.class_id == class_id)
        .all()
    )

    # Convert to dictionaries for easy manipulation
    student_dict = {s.id: {"id": s.id, "Sname": s.Sname, "college_id": s.college_id, "assignments": []} for s in students}

    # Add assignment details to the respective students
    for row in submissions:
        student_dict[row.id]["assignments"].append({
            "title": row.assignment_title,
            "grade": row.grade,
            "url":row.url,
            "Submitted_At":row.submitted_at
        })

    # Convert to a list format for the response
    return list(student_dict.values())

class LOGIN(BaseModel):
    id:int
    password: str  # Example attributes for a teacher


@teacher_route.post("/login/")
def login(data: LOGIN, db: Session = Depends(get_db)):
    #   Get college data using CRUD
    teacher_data = CRUD.get_item(db, Teacher, data.id)

    if not teacher_data:
        raise HTTPException(status_code=404, detail="Teacher not found")

    #   Check if password matches
    if data.password == teacher_data.Tpass:
        return {"Message":"Success Login","ID": data.id}

    #   Proper failure response
    raise HTTPException(status_code=401, detail="Invalid password")


class UpdatePassword(BaseModel):
    id: int
    new_password: str

@teacher_route.patch("/update-password")
def update_teacher_password(payload: UpdatePassword, db: Session = Depends(get_db)):
    teacher = db.query(Teacher).filter(Teacher.id == payload.id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    teacher.Tpass = payload.new_password
    db.commit()
    db.refresh(teacher)

    return {"message": "Password updated successfully"}

class EMAIL(BaseModel):
    email: str
    msg: str

@teacher_route.post("/send_Mail")
def send_email(data: EMAIL, db: Session = Depends(get_db)):
    my_google_email = os.getenv('my_google_email')
    google_password = os.getenv('google_password')
    to_email = data.email

    if not my_google_email or not google_password:
        raise HTTPException(status_code=500, detail="Email credentials not set in environment variables.")

    try:
        message = MIMEText(data.msg)
        message['Subject'] = 'Teacher Message !!'
        message['From'] = my_google_email
        message['To'] = to_email

        with smtplib.SMTP('smtp.gmail.com', 587) as connection:
            connection.starttls()
            connection.login(user=my_google_email, password=google_password)
            connection.send_message(message)

        return {"Status": "Message Sent"}   

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email sending failed: {str(e)}")
    
@teacher_route.post("/upload-mst1/{class_id}")
def upload_MST1_exam(class_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        # Upload file to Cloudinary
        result = cloudinary.uploader.upload(file.file, resource_type="raw")
        file_url = result.get("secure_url")

        class_data = db.query(Class).filter(Class.id == class_id).first()
        if not class_data:
            raise HTTPException(status_code=404, detail="Class not found")

        class_data.mst1_url = file_url
        db.commit()

        return {"message": "File uploaded and URL saved", "url": file_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@teacher_route.post("/upload-mst2/{class_id}")
def upload_MST2_exam(class_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        # Upload file to Cloudinary
        result = cloudinary.uploader.upload(file.file, resource_type="raw")
        file_url = result.get("secure_url")

        class_data = db.query(Class).filter(Class.id == class_id).first()
        if not class_data:
            raise HTTPException(status_code=404, detail="Class not found")

        class_data.mst2_url = file_url
        db.commit()

        return {"message": "File uploaded and URL saved", "url": file_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
