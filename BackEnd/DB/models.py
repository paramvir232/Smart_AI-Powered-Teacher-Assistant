from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text,UniqueConstraint
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
    Colname = Column(String, nullable=False)
    password= Column(String, nullable=False)
    Cemail = Column(String, nullable=False)
    Ccontact = Column(String, nullable=False)


    # College has multiple teachers and students
    teachers = relationship("Teacher", back_populates="college")  
    students = relationship("Student", back_populates="college")  

class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, index=True)
    Tname = Column(String, nullable=False)
    Tpass = Column(String, nullable=False)
    college_id = Column(Integer, ForeignKey("colleges.id"))
    Temail = Column(String, nullable=False)
    Tcontact = Column(String, nullable=False)
    

    college = relationship("College", back_populates="teachers")  # ✅ Fixed relationship
    classes = relationship("Class", back_populates="teacher")  # ✅ Added missing relationship
    assignments = relationship("Assignment", back_populates="teacher")  # ✅ Added missing relationship

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    Sname = Column(String, nullable=False)
    Spass = Column(String, nullable=False)
    Semail = Column(String, nullable=False)
    Scontact = Column(String, nullable=False)
    college_id = Column(Integer, ForeignKey("colleges.id"))

    college = relationship("College", back_populates="students")  # ✅ Fixed relationship
    submissions = relationship("Submission", back_populates="student")  # ✅ Added missing relationship

class Class(Base):
    __tablename__ = "classes"
    id = Column(Integer, primary_key=True, index=True)
    Cname = Column(String, nullable=False)
    teacher_id = Column(Integer, ForeignKey("teachers.id"))

    teacher = relationship("Teacher", back_populates="classes")  # ✅ Fixed relationship
    assignments = relationship("Assignment", back_populates="class_")  # ✅ Added missing relationship

class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(Integer, primary_key=True, index=True,autoincrement=True)
    title = Column(String, nullable=False)
    cloudinary_url = Column(String, nullable=False)  # Storing Cloudinary URL
    due_date = Column(DateTime, nullable=False)  # Due date for submission
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    class_id = Column(Integer, ForeignKey("classes.id"))

    teacher = relationship("Teacher", back_populates="assignments")  # ✅ Fixed relationship
    class_ = relationship("Class", back_populates="assignments")  # ✅ Fixed relationship
    submissions = relationship("Submission", back_populates="assignment")  # ✅ Added missing relationship

class Submission(Base):
    __tablename__ = "submissions"
    sub_id = Column(Integer, primary_key=True, index=True,autoincrement=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    cloudinary_url = Column(String, nullable=False)  # Storing Cloudinary URL
    grade = Column(Integer, nullable=True)  # Grade given to the student
    feedback = Column(Text, nullable=True)  # Teacher's feedback
    submitted_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))

    assignment = relationship("Assignment", back_populates="submissions")  # ✅ Fixed relationship
    student = relationship("Student", back_populates="submissions")  # ✅ Fixed relationship

class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(Integer, primary_key=True, index=True,autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    class_id = Column(Integer, ForeignKey("classes.id"))

    __table_args__ = (UniqueConstraint("student_id", "class_id", name="unique_enrollment"),)