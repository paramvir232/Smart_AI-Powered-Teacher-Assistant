from fastapi import FastAPI
import uvicorn
from DB import engine, Base  # Import from __init__.py
from dotenv import load_dotenv
import os
from Routes import *
import cloudinary
import cloudinary.uploader
from fastapi.middleware.cors import CORSMiddleware
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


load_dotenv()

app = FastAPI(debug=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],   # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],   # Allow all headers
)

cloudinary.config(
  cloud_name = os.getenv('Cloud_name'),
  api_key = os.getenv('API_key'),
  api_secret = os.getenv('API_secret')
)

# Create tables in the database
# Base.metadata.create_all(bind=engine)

# app.include_router(router)
app.include_router(college_route)
app.include_router(teacher_route)
app.include_router(student_route)




# app.include_router(assignment_router)


@app.get("/test")
def test():
    return {"message": "API is running 🚀"}


@app.get("/")
def home():
    logger.info("Home endpoint accessed")
    return {"message": "Production ready!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)