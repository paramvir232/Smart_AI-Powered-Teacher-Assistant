from fastapi import FastAPI
import uvicorn
from DB import engine, Base  # Import from __init__.py
from dotenv import load_dotenv
import os
from Routes import *
import cloudinary
import cloudinary.uploader
load_dotenv()

app = FastAPI(debug=True)

cloudinary.config(
  cloud_name = os.getenv('Cloud_name'),
  api_key = os.getenv('API_key'),
  api_secret = os.getenv('API_secret')
)

# Create tables in the database
# Base.metadata.create_all(bind=engine)

app.include_router(router)
app.include_router(college_route)
app.include_router(teacher_route)


# app.include_router(assignment_router)


@app.get("/")
def home():
    return {"message": "API is running 🚀"}
