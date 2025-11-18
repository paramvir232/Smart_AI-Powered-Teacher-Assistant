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
import pandas as pd
import requests
from io import BytesIO

load_dotenv()

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

student_route = APIRouter(prefix="/student", tags=["STUDENT"])


def gemini_response(prompt: str):
    try:
        # 1️⃣ Send prompt to Gemini
        response = client.models.generate_content(
            model='gemini-2.0-flash-thinking-exp',
            contents=prompt,
        )
        response_text = response.text.strip()

        # 2️⃣ Try to locate either JSON array [ ... ] or full object { ... }
        array_start = response_text.find('[')
        array_end = response_text.rfind(']')
        object_start = response_text.find('{')
        object_end = response_text.rfind('}')

        if array_start != -1 and array_end != -1:
            json_string = response_text[array_start:array_end + 1]
        elif object_start != -1 and object_end != -1:
            json_string = response_text[object_start:object_end + 1]
        else:
            raise ValueError("No valid JSON found in Gemini output.")

        # 3️⃣ Replace single quotes with double quotes (fallback sanitization)
        json_string = re.sub(r"(?<=\{|,)\s*'([^']+)'\s*:", r'"\1":', json_string)  # fix keys
        json_string = re.sub(r":\s*'([^']+)'", r': "\1"', json_string)             # fix values
        json_string = json_string.replace("'", '"')  # final sweep

        # 4️⃣ Parse the cleaned string
        parsed = json.loads(json_string)

        # 5️⃣ If it's a dictionary with 'quiz', return just the quiz
        if isinstance(parsed, dict) and "quiz" in parsed:
            return parsed["quiz"]

        # 6️⃣ If it's a direct list, return it
        if isinstance(parsed, list):
            return parsed

        raise ValueError("Unexpected JSON format returned by Gemini.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini response parsing failed: {str(e)}")



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
    ### 📝 Assignment Evaluation + Plagiarism Detection (Teacher Mode)
    
    You are a **strict but fair teacher** evaluating a student's assignment.
    The assignment text was extracted using **PyMuPDF**, so ignore formatting or layout issues.  
    Focus ONLY on the meaning and correctness of the answers.
    
    ---
    
    ### 🔹 Your Tasks
    
    1️⃣ **Identify each question and its answer** from the student's submission.  
    2️⃣ **Evaluate correctness, clarity, depth, and relevance** of each answer.  
    3️⃣ **Give an overall grade (out of 10)** based on quality.  
    4️⃣ **Provide detailed, constructive feedback** for improvement.  
    
    ---
    
    ### 🔍 Additional Requirement — Plagiarism Check
    
    You must also perform plagiarism analysis:
    
    - Compare the student's text with general academic knowledge and common publicly available answers.  
    - Detect if any part appears copied, overly generic, or not-original.  
    - Provide a **Plagiarism Percentage (0–100%)**, where:  
      - **0% = fully original**  
      - **100% = completely copied**  
    - Provide a **Plagiarism Summary** explaining:  
      - Which parts seem copied  
      - Why they appear non-original  
      - Any suspicious patterns
    
    ---
    
    ### 📜 Extracted Assignment Submission
    {extracted_text}
    
    ---
    
    ### 📝 Output Format (STRICT JSON ONLY)
    
    Return output **EXACTLY** in this JSON format:
    
    {{
        "Grade": int,
        "Feedback": str,
        "PlagiarismPercentage": int,
        "PlagiarismSummary": str
    }}
    
    No additional text.  
    No formatting outside JSON.  
    No explanations outside JSON.
    """


    # client = genai.Client(api_key="AIzaSyB1TFZV2Hc2YWuWz5LfUU7AvaEkDWds-rc")
    response = client.models.generate_content(
        model='gemini-2.5-flash',
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
    id = url[0]["sub_id"]
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
@student_route.get("/FeedBack/{subm_id}/{language}")
def get_feedback_language(language: str,subm_id : int,db: Session = Depends(get_db)):
        data = CRUD.universal_query(
        db=db,
        base_model=Submission,  # Start from Student
        filters=[
            Submission.sub_id == subm_id
        ],
        attributes={
            "submissions": ["feedback"]
        }
        )
        prompt = f"Convert {data} in {language} language and keep the same format."

        return gemini_response(prompt)
        
    


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
            "submissions": ["assignment_id","sub_id","cloudinary_url","submitted_at","grade","feedback"]
        }  # Get assignment details
    )

@student_route.get("/{student_id}/details")
def detail(student_id:int ,db: Session = Depends(get_db)):

    return CRUD.get_item(db,Student,student_id)

class UpdatePassword(BaseModel):
    id: int
    new_password: str

@student_route.patch("/update-password")
def update_student_password(payload: UpdatePassword, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == payload.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student.Spass = payload.new_password
    db.commit()
    db.refresh(student)

    return {"message": "Password updated successfully"}

class QUERY(BaseModel):
    query_text: str

@student_route.post("/chatbot")
def Chatbot_feedback(query: QUERY, db: Session = Depends(get_db)):
    prompt= f"""
You are a helpful AI assistant for both Student and teachers in college management system so always give best and detailed information for their queries.

User Query: "{query.query_text}

 ---

        ### **📝 Expected Output from You (Teacher)**
        Provide a JSON response strictly in this format:
        {{
            "FeedBack": str
        }}
        The output should **ONLY** be valid JSON, with no additional text."""
    response = client.models.generate_content(
        model='gemini-2.5-flash',
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


@student_route.get("/{student_id}/{class_id}/mst1-result")
def get_internal_exam_urls(student_id: int,class_id: int, db: Session = Depends(get_db)):

    data = CRUD.universal_query(
    db=db,
    base_model=Student,  # Start from Student
    joins=[
        (Enrollment, Enrollment.student_id == Student.id),   # Student → Enrollment
        (Class, Class.id == Enrollment.class_id),            # Enrollment → Class
    ],
    filters=[
        Student.id == student_id
    ],
    attributes={
        "classes": ["Cname","mst1_url"]
    }
    )
    # Replace with your actual Excel file link
    excel_url = data[0]["mst1_url"]

    # Step 1: Download the Excel file from URL
    response = requests.get(excel_url)
    response.raise_for_status()  # Raise error if download fails

    # Step 2: Load Excel content into pandas DataFrame
    excel_data = pd.read_excel(BytesIO(response.content))

    # Step 3: Convert to JSON
    records = excel_data.to_json(orient="records")

    # (Optional) Print or return JSON
    # result = json.loads(json_data)
    parsed_records = json.loads(records)

    filtered = [record for record in parsed_records if record.get("stu_id") == student_id]

    return filtered


@student_route.get("/{student_id}/mst2-result")
def get_internal_exam_urls(student_id: int, db: Session = Depends(get_db)):

    data = CRUD.universal_query(
    db=db,
    base_model=Student,  # Start from Student
    joins=[
        (Enrollment, Enrollment.student_id == Student.id),   # Student → Enrollment
        (Class, Class.id == Enrollment.class_id),            # Enrollment → Class
    ],
    filters=[
        Student.id == student_id
    ],
    attributes={
        "classes": ["mst2_url"]
    }
    )
    # Replace with your actual Excel file link
    excel_url = data[0]["mst2_url"]

    # Step 1: Download the Excel file from URL
    response = requests.get(excel_url)
    response.raise_for_status()  # Raise error if download fails

    # Step 2: Load Excel content into pandas DataFrame
    excel_data = pd.read_excel(BytesIO(response.content))

    # Step 3: Convert to JSON
    records = excel_data.to_json(orient="records")

    # (Optional) Print or return JSON
    # result = json.loads(json_data)
    parsed_records = json.loads(records)

    filtered = [record for record in parsed_records if record.get("stu_id") == student_id]

    return filtered

@student_route.get("/{student_id}/teachers") 
def get_assigned_teachers(student_id: int, db: Session = Depends(get_db)): 
    return CRUD.universal_query( 
        db=db, 
        base_model=Student, 
        joins=[ (Enrollment, Enrollment.student_id == Student.id), (Class, Class.id == Enrollment.class_id), (Teacher, Teacher.id == Class.teacher_id) ], 
        filters=[ Student.id == student_id ], 
        attributes={ "teachers": ["id", "Tname", "Temail"] } )



@student_route.get("/{student_id}/get_quiz/{language}") 
def get_quiz(language: str,student_id: int, db: Session = Depends(get_db)): 
    quiz=CRUD.universal_query( 
        db=db, 
        base_model=Student, 
        joins=[ (Enrollment, Enrollment.student_id == Student.id), (Class, Class.id == Enrollment.class_id)], 
        filters=[ Student.id == student_id ], 
        attributes={ "classes": ["quiz"] } )
    
    if language.lower() == "english":
        return quiz
    
    prompt = f"Convert {quiz} in {language} language and keep the same format."
    return gemini_response(prompt)

    


@student_route.patch("/{student_id}/post_quiz/{quiz_marks}") 
def send_quiz_marks(quiz_marks: int,student_id: int, db: Session = Depends(get_db)):
    stu_obj = db.query(Student).filter(Student.id == student_id).first()
    if not stu_obj:
        raise HTTPException(status_code=404, detail="Class not found")
    try:
        stu_obj.quiz_marks = quiz_marks
        db.commit()
        db.refresh(stu_obj)
        return {"Message":"Successfully Inserted"}
    except:
        raise HTTPException(status_code=404, detail="Error Has Occured !")
        

@student_route.post("/resource_generator")
def resource_generator(query: QUERY, db: Session = Depends(get_db)):  
    prompt = f"""
    🎓 You are an intelligent academic assistant designed to help students find the most useful and credible study resources online.

    ---

    📘 STUDENT QUERY (TOPIC):  
    "{query}"

    ---

    🎯 OBJECTIVE:  
    Based on the topic above, provide a curated list of **web resources**, **YouTube videos**, and **study websites** that will help a student understand and explore the topic effectively.

    ---

    💡 INSTRUCTIONS:

    1. Return at least 8–12 high-quality links across various platforms.
    2. Group them into 3 categories:
    - 📘 Study Articles & Websites
    - 🎥 YouTube Videos (links only)
    - 📚 Free Learning Platforms / Tools
    3. Prefer resources that are:
    - Beginner to intermediate friendly
    - Recently published or updated
    - Ad-free or free to use
    - Aligned with academic understanding (NOT blog rants or Reddit threads)
    4. Avoid general search results or random unverified blog posts.

    ---

    📤 RESPONSE FORMAT (STRICT JSON ONLY):

    {{
    "topic": "student_topic",
    "resources": {{
        "study_articles": [
        {{"title": "Title", "url": "https://example.com"}}
        ],
        "youtube_videos": [
        {{"title": "Video Title", "url": "https://youtube.com/watch?v=..."}}
        ],
        "learning_platforms": [
        {{"name": "Platform Name", "url": "https://platform.com"}}
        ]
    }}
    }}

    ---

    🎯 You are acting from a student’s perspective. Your suggestions should feel genuinely helpful, not overwhelming, and easy to click and learn from right away.

    ❗ Do not return markdown, explanations, summaries or commentary. ONLY return valid JSON as per the format above.
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
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
