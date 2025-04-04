from dotenv import load_dotenv
from twilio.rest import Client
import os
load_dotenv()

# Your Twilio account SID and Auth Token
account_sid = os.getenv('TWILIO_SID')
auth_token = os.getenv('TWILIO_TOKEN')

from_whatsapp_number = 'whatsapp:+14155238886'  # Twilio sandbox number
to_whatsapp_number = 'whatsapp:+917009095231'  # Student's number

def send_assignment_whatsapp(student_name, assignment_title):
    client = Client(account_sid, auth_token)
    message = client.messages.create(
        from_=from_whatsapp_number,
        body=f"Hello {student_name}, you've been assigned: {assignment_title}. Please check the portal.",
        to=to_whatsapp_number
    )
    print("Message SID:", message.sid)

send_assignment_whatsapp("student.name", "assignment.title")