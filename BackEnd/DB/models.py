from sqlalchemy import Column, Integer, String, ForeignKey, DateTime,Text
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class Admin(Base):
    __tablename__ = "admins"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)

class College(Base):
    __tablename__ = "colleges"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)

class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    college_id = Column(Integer, ForeignKey("colleges.id"))
    
    college = relationship("College", back_populates="teachers")

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    college_id = Column(Integer, ForeignKey("colleges.id"))

    college = relationship("College", back_populates="students")

class Class(Base):
    __tablename__ = "classes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    teacher_id = Column(Integer, ForeignKey("teachers.id"))

    teacher = relationship("Teacher", back_populates="classes")

class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    cloudinary_url = Column(String, nullable=False)  # Storing Cloudinary URL
    due_date = Column(DateTime, nullable=False)  # Due date for submission
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    class_id = Column(Integer, ForeignKey("classes.id"))

    teacher = relationship("Teacher", back_populates="assignments")
    class_ = relationship("Class", back_populates="assignments")


class Submission(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    cloudinary_url = Column(String, nullable=False)  # Storing Cloudinary URL
    grade = Column(Integer, nullable=True)  # Grade given to the student
    feedback = Column(Text, nullable=True)  # Teacher's feedback
    submitted_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))

    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("Student", back_populates="submissions")

class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    class_id = Column(Integer, ForeignKey("classes.id"))
