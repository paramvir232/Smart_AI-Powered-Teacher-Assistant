import pandas as pd
import requests
from io import BytesIO

# Replace with your actual Excel file link
excel_url = "https://res.cloudinary.com/ddi6jn0b4/raw/upload/v1743998384/efdbpbkg9fsmyifcqrv1.xlsx"

# Step 1: Download the Excel file from URL
response = requests.get(excel_url)
response.raise_for_status()  # Raise error if download fails

# Step 2: Load Excel content into pandas DataFrame
excel_data = pd.read_excel(BytesIO(response.content))

# Step 3: Convert to JSON
json_data = excel_data.to_json(orient="records")

# (Optional) Print or return JSON
print(json_data)
