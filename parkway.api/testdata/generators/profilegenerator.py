import os
from faker import Faker
import random
import json
from datetime import datetime, timedelta
from bson import ObjectId

# Initialize Faker
fake = Faker()

# Organization ID
organization_id = "6650f2ed692d5194441b687a"

# Gender distribution based on current ratio in the US
# Assuming approximately 50.8% female and 49.2% male
gender_distribution = ['female'] * 254 + ['male'] * 246

# Cities, ZIP codes, and area codes within 75 miles of Corbin, KY
nearby_cities_zipcodes = [
    ("Corbin", "40701", "606"),
    ("London", "40741", "606"),
    ("Williamsburg", "40769", "606"),
    ("Barbourville", "40906", "606"),
    ("Pineville", "40977", "606"),
    ("Somerset", "42501", "606"),
    ("Mount Vernon", "40456", "606"),
    ("Manchester", "40962", "606"),
    ("Harlan", "40831", "606"),
    ("Whitley City", "42653", "606"),
    ("Lexington", "40502", "859"),
    ("Richmond", "40475", "859"),
    ("Danville", "40422", "859"),
    ("Harrogate", "37752", "423"),
    ("Middlesboro", "40965", "606"),
    ("Winchester", "40391", "859"),
    ("Berea", "40403", "859"),
    ("Stanford", "40484", "606"),
    ("Nicholasville", "40356", "859"),
    ("Cynthiana", "41031", "859")
]

# Age distribution for ages 18 to 90
def generate_date_of_birth(min_age, max_age):
    today = datetime.today()
    start_date = today - timedelta(days=max_age*365)
    end_date = today - timedelta(days=min_age*365)
    return fake.date_between(start_date=start_date, end_date=end_date)

def generate_phone_number(area_code):
    # Generate a 7-digit number and combine it with the area code to make a 10-digit phone number
    return f"{area_code}{random.randint(1000000, 9999999)}"

profiles = []

for _ in range(1500):
    gender = random.choice(gender_distribution)
    first_name = fake.first_name_male() if gender == 'male' else fake.first_name_female()
    last_name = fake.last_name()
    middle_initial = fake.random_letter().upper()
    nickname = fake.first_name()
    date_of_birth = generate_date_of_birth(18, 90)
    age = (datetime.today().date() - date_of_birth).days // 365
    email = f"{first_name.lower()}.{last_name.lower()}@example.com"
    
    city, zip_code, area_code = random.choice(nearby_cities_zipcodes)
    mobile_phone = generate_phone_number(area_code)
    home_phone = generate_phone_number(area_code) if age > 65 else ""
    
    address = {
        "streetAddress1": fake.street_address(),
        "streetAddress2": fake.secondary_address() if random.random() < 0.25 else "",
        "city": city,
        "state": "KY",
        "zip": zip_code,
        "country": "US"
    }
    
    profile = {
        "_id": str(ObjectId()),  # Generate a MongoDB ObjectId
        "user": "",  # Empty user account
        "firstName": first_name,
        "lastName": last_name,
        "middleInitial": middle_initial,
        "nickname": nickname,
        "dateOfBirth": datetime.combine(date_of_birth, datetime.min.time()).isoformat() + 'Z',
        "gender": gender,
        "email": email,
        "mobilePhone": mobile_phone,
        "homePhone": home_phone,
        "address": address,
        "member": random.random() < 0.5,  # 50% chance of being a member
        "teams": [],
        "family": None,
        "preferences": None,
        "organizations": [
            {
                "organizationId": organization_id,
                "isDefault": True,
                "isActive": True
            }
        ]
    }
    
    profiles.append(profile)

# Get the directory of the script
script_dir = os.path.dirname(os.path.abspath(__file__))
output_file = os.path.join(script_dir, 'profiles.json')

# Save profiles to a JSON file in the same directory as the script
with open(output_file, 'w') as f:
    json.dump(profiles, f, indent=4)

print(f"Generated {len(profiles)} profiles and saved to {output_file}.")
