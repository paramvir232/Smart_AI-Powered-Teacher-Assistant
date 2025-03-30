from fastapi import APIRouter, Depends,FastAPI, HTTPException,UploadFile, File, Form
from sqlalchemy.orm.session import Session
from DB.database import get_db  # Import database connection
from DB import *  # Import User model
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import cloudinary
import cloudinary.uploader
import requests
import fitz  # PyMuPDF
from io import BytesIO
import os
import re
from google import genai
import json 
# from google.genai import types
from dotenv import load_dotenv
load_dotenv()

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

student_route = APIRouter(prefix="/student", tags=["STUDENT"])

class LOGIN(BaseModel):
    id:int
    password: str 

@student_route.post("/login/")
def login(data: LOGIN, db: Session = Depends(get_db)):
    #   Get college data using CRUD
    student_data = CRUD.get_item(db, Student, data.id)

    if not student_data:
        raise HTTPException(status_code=404, detail="Student not found")

    #   Check if password matches
    if data.password == student_data.Spass:
        return {"Message":"Success Login","ID": data.id}

    #   Proper failure response
    raise HTTPException(status_code=401, detail="Invalid password")

from datetime import datetime, timezone

@student_route.post("/submit_assignment/")
async def submit_assignment(
    assignment_id: int = Form(...),  
    student_id: int = Form(...),  
    file: UploadFile = File(...),  
    db: Session = Depends(get_db)
):
    try:
        #   Upload file to Cloudinary
        upload_result = cloudinary.uploader.upload(file.file)
        file_url = upload_result.get("secure_url")  #   Get file URL

        #   Insert Submission into the database
        submission_data = {
            "assignment_id": assignment_id,
            "student_id": student_id,
            "cloudinary_url": file_url,  #   Save URL to DB
            "submitted_at": datetime.now(timezone.utc),  #   Use UTC time
            "grade": None,  # No grade at submission time
            "feedback": None  # No feedback initially
        }

        new_submission = CRUD.add_item(db, Submission, **submission_data)

        return {"message": "Assignment submitted successfully!", "submission": new_submission}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")



@student_route.get("/submission_form", response_class=HTMLResponse)
def submission_form():
    return """
    <html>
        <body>
            <h2>Submit Assignment</h2>
            <form action="/student/submit_assignment/" method="post" enctype="multipart/form-data">
                <label>Assignment ID:</label>
                <input type="number" name="assignment_id" required><br><br>

                <label>Student ID:</label>
                <input type="number" name="student_id" required><br><br>

                <label>Upload File:</label>
                <input type="file" name="file" required><br><br>

                <input type="submit" value="Submit">
            </form>
        </body>
    </html>
    """

@student_route.get("/assignments/{student_id}")
def get_assignments(student_id: int, db: Session = Depends(get_db)):
    return CRUD.universal_query(
        db=db,
        base_model=Student,  #  Start from Student since we filter by student_id
        joins=[
            (Enrollment, Enrollment.student_id == Student.id),  # Join Student → Enrollment
            (Class, Class.id == Enrollment.class_id),           # Join Enrollment → Class
            (Assignment, Assignment.class_id == Class.id)       # Join Class → Assignment
        ],
        filters=[
            Student.id == student_id  # Filter by student_id
        ],
        attributes={
            "assignments": ["id","title", "cloudinary_url", "due_date"],
            "classes":["Cname"]
        }  # Get assignment details
    )



# @student_route.get("/test")
def to_gemini(text):
    
    extracted_text=f""""{text}"""
    prompt = f"""
        ### **📝 Assignment Evaluation by Teacher (You)**
        You are a **strict but fair teacher** evaluating a student's assignment.  
        This assignment was extracted using **PyMuPDF**, so there may be formatting issues.  
        Ignore any formatting errors and focus **only on the answers** provided by the student.

        ---

        ### **🔹 Your Task as a Teacher:**
        1️⃣ **Identify each question and its corresponding answer** from the text.  
        2️⃣ **Evaluate the correctness and clarity** of each answer.  
        3️⃣ **Assign a grade (out of 10)** for each response based on accuracy and depth.  
        4️⃣ **Provide constructive feedback** on how the student can improve their answer.  

        ---

        ### **📜 Extracted Assignment Submission:**
        {extracted_text}

        ---

        ### **📝 Expected Output from You (Teacher)**
        Provide a JSON response strictly in this format:
        {{
            "Grade": int,
            "FeedBack": str
        }}
        The output should **ONLY** be valid JSON, with no additional text.
        """

    # client = genai.Client(api_key="AIzaSyB1TFZV2Hc2YWuWz5LfUU7AvaEkDWds-rc")
    response = client.models.generate_content(
        model='gemini-2.0-flash-thinking-exp',
        contents=prompt,
    )
    response_text=response.text
    start_index = response_text.find('{')
    end_index = response_text.rfind('}')

    # Extract the JSON substring
    if start_index != -1 and end_index != -1:
        json_string = response_text[start_index:end_index+1]  # Include the closing brace
        print(json_string)
    else:
        print("No valid JSON found.")

    return json.loads(json_string)

#------GET FEEDBACK-------
@student_route.get("/FeedBack/{student_id}/{ass_id}/{subm_id}")
def get_feedback(student_id : int,ass_id : int,subm_id : int,db: Session = Depends(get_db)):
    url = CRUD.universal_query(
        db=db,
        base_model=Submission,  #  Start from Student since we filter by student_id
        
        filters=[
            Submission.student_id == student_id,
            Submission.assignment_id == ass_id
               # Filter by student_id
        ],
        attributes={
            "submissions": ["sub_id","cloudinary_url","submitted_at"]
        }  # Get assignment details
    )
    id = url[0]["id"]
    submit_at = url[0]["submitted_at"]
    url = url[0]["cloudinary_url"]

    # url = "https://res.cloudinary.com/ddi6jn0b4/image/upload/v1743061709/egc3rcwvge4y8mlrurbe.pdf"
    
    # Fetch the PDF as a stream
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception("Failed to fetch PDF from Cloudinary")

    pdf_stream = BytesIO(response.content)  # Convert to stream

    text = ""
    with fitz.open(stream=pdf_stream, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text("text") + "\n"  #   Use `get_text()`
    
    gemini_feedback = to_gemini(text)

    submission_data = {
            "assignment_id": ass_id,
            "student_id": student_id,
            "cloudinary_url": url,  #   Save URL to DB
            "submitted_at": submit_at,  #   Use UTC time
            "grade": gemini_feedback["Grade"],  # No grade at submission time
            "feedback": gemini_feedback["FeedBack"]  # No feedback initially
        }
    
    CRUD.update_item(db,Submission,subm_id,**submission_data)

    return gemini_feedback

    # return url[0]["cloudinary_url"]

@student_route.get("/submissions/{student_id}")
def get_submissions(student_id: int, db: Session = Depends(get_db)):
    return  CRUD.universal_query(
        db=db,
        base_model=Submission,  #  Start from Student since we filter by student_id
        
        filters=[
            Submission.student_id == student_id
               # Filter by student_id
        ],
        attributes={
            "submissions": ["sub_id","cloudinary_url","submitted_at","grade","feedback"]
        }  # Get assignment details
    )