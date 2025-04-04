import requests

ACCESS_TOKEN = "EAAOLLkQx0AsBO1TwjX3qVnSFm4NvAosHNsLVoZAqiIwekFFkJ1kV6aTYp5aVCfZAiE5VeHNlmdvQ27A7ypzWmz3EbVmjpgm8KJIKuqhi3BFZAzgCVC4YVipNAkjBLQT2D28r6rZCrCcyiFu1f3rc6swOulMhZAcMTRxQvhJUigSLGEuaC0UbuxoEH161gSoxa8VRZA3eGYmMIvfRIFspo9WTlLTalJ3u8JKzAZD"
PHONE_NUMBER_ID = "623489157512901"
TO_NUMBER = "917009095231"  # with country code, no '+' sign

def send_whatsapp_message():
    url = f"https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "messaging_product": "whatsapp",
        "to": TO_NUMBER,
        "type": "text",
        "text": {
            "body": "📚 Hello! You've got a new assignment. Please check your dashboard for details. 😊"
        }
    }

    response = requests.post(url, headers=headers, json=data)
    print(response.status_code)
    print(response.json())

send_whatsapp_message()
