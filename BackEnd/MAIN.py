from fastapi import FastAPI
import uvicorn
from DB import engine, Base  # Import from __init__.py
from dotenv import load_dotenv
import os
load_dotenv()

app = FastAPI()

# Create tables in the database
Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "API is running 🚀"}
