from dotenv import load_dotenv
from twilio.rest import Client
import os
load_dotenv()

# Your Twilio account SID and Auth Token
account_sid = os.getenv('TWILIO_SID')
auth_token = os.getenv('TWILIO_TOKEN')

client = Client(account_sid, auth_token)


message = client.messages.create(
    body='Hey! This is a test message from my Python script via WhatsApp 😄',
    from_='whatsapp:+14155238886',       # Twilio sandbox number
    to='whatsapp:+917009095231'          # Your phone number with country code
)

print('Message SID:', message.sid)

# import smtplib
# my_google_email = 'pythonmail887@gmail.com'
# to_email = 'coder4614@gmail.com'
# google_password = 'mlphuwrgqylhbqgn'

# with smtplib.SMTP('smtp.gmail.com') as connection:
#             connection.starttls()
#             connection.login(user=my_google_email, password=google_password)
#             connection.sendmail(from_addr=my_google_email, to_addrs=to_email,
#                                 msg=f'Subject:ISS ALERT !!\n\n LOOK UP ISS IS THERE !!')
