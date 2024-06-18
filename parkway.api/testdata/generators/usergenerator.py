import json
import os
import random
from bson import ObjectId
from datetime import datetime
from hashlib import sha256

def generate_object_id():
    return str(ObjectId())

def generate_password(email):
    username = email.split('@')[0]
    return sha256(username.encode()).hexdigest()

def create_user_with_profile(profile):
    return {
        "_id": {"$oid": generate_object_id()},
        "testData": "true",
        "email": profile["email"],
        "password": generate_password(profile["email"]),
        "applicationClaims": [
            {
                "name": "role",
                "value": "user"
            }
        ],
        "createdAt": {"$date": datetime.utcnow().isoformat() + "Z"},
        "updatedAt": {"$date": datetime.utcnow().isoformat() + "Z"},
        "__v": 0,
        "profile": profile["_id"],
        "organizations": [
            {
                "isActive": "true",
                "isDefault": "true",
                "organizationId": generate_object_id()
            }
        ]
    }

def create_user_without_profile():
    return {
        "_id": {"$oid": generate_object_id()},
        "email": "user" + generate_object_id() + "@example.com",
        "password": generate_password("user" + generate_object_id() + "@example.com"),
        "applicationClaims": [
            {
                "name": "role",
                "value": "user"
            }
        ],
        "createdAt": {"$date": datetime.utcnow().isoformat() + "Z"},
        "updatedAt": {"$date": datetime.utcnow().isoformat() + "Z"},
        "__v": 0,
        "profile": "",
        "organizations": [
            {
                "isActive": "true",
                "isDefault": "true",
                "organizationId": generate_object_id()
            }
        ]
    }

def main():
    # Load profiles from the JSON file
    file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'profiles.json')
    with open(file_path, 'r') as file:
        profiles = json.load(file)

    # Select 500 profiles at random
    selected_profiles = random.sample(profiles, 500)
    
    # Create users with profiles
    users_with_profiles = [create_user_with_profile(profile) for profile in selected_profiles]

    # Create 1000 users without profiles
    users_without_profiles = [create_user_without_profile() for _ in range(1000)]

    # Combine both lists of users
    all_users = users_with_profiles + users_without_profiles

    # Save the users to a JSON file in the same directory as profiles.json
    output_file_path = os.path.join(os.path.dirname(file_path), 'users.json')
    with open(output_file_path, 'w') as outfile:
        json.dump(all_users, outfile, indent=4)

if __name__ == "__main__":
    main()
