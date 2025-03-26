from .database import engine, Base, SessionLocal
from .models import Admin,College, Teacher, Student, Class, Assignment, Submission
from .crud import CRUD
