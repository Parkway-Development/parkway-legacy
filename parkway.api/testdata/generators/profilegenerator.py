import os
from faker import Faker
import random
import json
from datetime import datetime, timedelta
from bson import ObjectId
import decimal
import math

# Initialize Faker
fake = Faker()

# Organization ID
organization_id = "6650f2ed692d5194441b687a"

# Gender distribution based on current ratio in the US
# Assuming approximately 50.8% female and 49.2% male
gender_distribution = ['female'] * 254 + ['male'] * 246

# Cities, ZIP codes, area codes, and coordinates within 75 miles of Corbin, KY
nearby_cities = [
    ("Corbin","KY", "40701", "606", 36.9487, -84.0963),
    ("London", "KY", "40741", "606", 37.128977, -84.083264),
    ("Williamsburg", "KY", "40769", "606", 36.7434, -84.1594),
    ("Barbourville", "KY", "40906", "606", 36.8668, -83.8888),
    ("Pineville", "KY", "40977", "606", 36.7620, -83.6941),
    ("Somerset", "KY", "42501", "606", 37.0920, -84.6041),
    ("Mount Vernon", "KY", "40456", "606", 37.3529, -84.3405),
    ("Manchester", "KY", "40962", "606", 37.1523, -83.7610),
    ("Harlan", "KY", "40831", "606", 36.8434, -83.3187),
    ("Whitley City", "KY", "42653", "606", 36.7248, -84.4747),
    ("Lexington", "KY", "40502", "859", 38.0293, -84.4906),
    ("Richmond", "KY", "40475", "859", 37.7479, -84.2947),
    ("Danville", "KY", "40422", "859", 37.6456, -84.7722),
    ("Harrogate", "TN", "37752", "423", 36.5820, -83.6569),
    ("Middlesboro", "KY", "40965", "606", 36.6087, -83.7163),
    ("Winchester", "KY", "40391", "859", 37.9901, -84.1790),
    ("Berea", "KY", "40403", "859", 37.5689, -84.2963),
    ("Stanford", "KY", "40484", "606", 37.5304, -84.6613),
    ("Nicholasville", "KY", "40356", "859", 37.8806, -84.5729),
    ("Cynthiana", "KY", "41031", "859", 38.3901, -84.2941)
]

# Radius of the Earth in miles
EARTH_RADIUS_MILES = 3959

# Function to generate a random point within a specified radius
def generate_random_point(lat, lon, radius_miles):
    # Convert miles to degrees
    radius_in_degrees = radius_miles / EARTH_RADIUS_MILES
    
    # Generate random distance and angle
    distance = radius_in_degrees * math.sqrt(random.random())
    angle = random.random() * 2 * math.pi
    
    # Calculate delta lat and delta lon
    delta_lat = distance * math.cos(angle)
    delta_lon = distance * math.sin(angle) / math.cos(math.radians(lat))
    
    # Calculate new lat and lon
    new_lat = lat + delta_lat
    new_lon = lon + delta_lon
    
    return new_lat, new_lon

# Age distribution for ages 18 to 90
def generate_date_of_birth(min_age, max_age):
    today = datetime.today()
    start_date = today - timedelta(days=max_age*365)
    end_date = today - timedelta(days=min_age*365)
    return fake.date_between(start_date=start_date, end_date=end_date)

def generate_phone_number(area_code):
    # Generate a 7-digit number and combine it with the area code to make a 10-digit phone number
    return f"{area_code}{random.randint(1000000, 9999999)}"

# Function to convert objects to JSON serializable format
def json_serial(obj):
    if isinstance(obj, ObjectId):
        return {"$oid": str(obj)}
    if isinstance(obj, (datetime, timedelta)):
        return obj.isoformat()
    if isinstance(obj, decimal.Decimal):
        return float(obj)
    raise TypeError(f"Type {type(obj)} not serializable")

addresses = []
profiles = []

for _ in range(500):
    gender = random.choice(gender_distribution)
    first_name = fake.first_name_male() if gender == 'male' else fake.first_name_female()
    last_name = fake.last_name()
    middle_initial = fake.random_letter().upper()
    date_of_birth = generate_date_of_birth(18, 90)
    age = (datetime.today().date() - date_of_birth).days // 365
    email = f"{first_name.lower()}.{last_name.lower()}@example.com"
    
    city, state, zip_code, area_code, city_lat, city_lon = random.choice(nearby_cities)
    street = fake.street_address()
    mobile_phone = generate_phone_number(area_code)
    home_phone = generate_phone_number(area_code) if age > 65 else ""
    
    address_id = ObjectId()
    coordinates = generate_random_point(city_lat, city_lon, 10)
    address = {
        "_id": {"$oid": str(address_id)},  # Generate a MongoDB ObjectId for the address
        "testData": True,  # Add testData property
        "location": "Point",
        "coordinates": [coordinates[0], coordinates[1]],  # [latitude, longitude]
        "formattedAddress": f"{street}, {city}, {state} {zip_code}",
        "street": street,
        "city": city,
        "state": state,
        "zipcode": zip_code,
        "country": "US"
    }
    
    addresses.append(address)
    
    profile = {
        "_id": {"$oid": str(ObjectId())},  # Generate a MongoDB ObjectId
        "testData": True,  # Add testData property
        "user": None,  # Empty user account
        "organizationId": {"$oid": str(ObjectId(organization_id))},
        "firstName": first_name,
        "lastName": last_name,
        "middleInitial": middle_initial,
        "dateOfBirth": datetime.combine(date_of_birth, datetime.min.time()).isoformat() + 'Z',
        "gender": gender,
        "email": email,
        "mobilePhone": mobile_phone,
        "homePhone": home_phone,
        "address": {"$oid": str(address_id)},  # Reference the address ObjectId
        "member": random.random() < 0.5,  # 50% chance of being a member
        "teams": [],
        "preferences": None
    }
    
    profiles.append(profile)

# Get the directory of the script
script_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(script_dir)
output_file_profiles = os.path.join(parent_dir, 'profiles.json')
output_file_addresses = os.path.join(parent_dir, 'addresses.json')

# Save profiles to a JSON file in the parent directory of the script
with open(output_file_profiles, 'w') as f:
    json.dump(profiles, f, indent=4, default=json_serial)

# Save addresses to a separate JSON file in the parent directory of the script
with open(output_file_addresses, 'w') as f:
    json.dump(addresses, f, indent=4, default=json_serial)

print(f"Generated {len(profiles)} profiles and saved to {output_file_profiles}.")
print(f"Generated {len(addresses)} addresses and saved to {output_file_addresses}.")
