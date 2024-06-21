import json
import random
import os
from datetime import datetime, timedelta
from bson import ObjectId

# Function to generate a list of deposit records
def generate_deposits(num_deposits, min_amount, max_amount, profile_id, start_date, target_weekday):
    deposits = []
    current_date = start_date
    while len(deposits) < num_deposits:
        # Ensure the date is the target weekday
        while current_date.weekday() != target_weekday:
            current_date += timedelta(days=1)
        
        deposit_date_str = current_date.strftime("%Y-%m-%d")
        deposit_date_obj = datetime.strptime(deposit_date_str, "%Y-%m-%d")
        
        deposit = {
            "_id":{ "$oid": str(ObjectId())},
            "amount": random.randint(min_amount, max_amount),
            "responsiblePartyProfileId": profile_id,
            "depositDate": deposit_date_str,
            "currentStatus": "unallocated",
            "statusDate": deposit_date_str,
            "history": [
                {
                    "status": "undeposited",
                    "date": deposit_date_obj,
                    "responsiblePartyProfileId": profile_id
                },
                {
                    "status": "unallocated",
                    "date": deposit_date_obj,
                    "responsiblePartyProfileId": profile_id
                }
            ]
        }
        deposits.append(deposit)
        current_date += timedelta(days=7)  # Move to the next target weekday
    return deposits

# Parameters
num_deposits = 52
min_amount_sunday = 800000
max_amount_sunday = 1500000
min_amount_wednesday = 200000
max_amount_wednesday = 500000
profile_id = "6658aac2692d5194441b6897"

# Calculate the most recent past Sunday
today = datetime.now()
last_sunday = today - timedelta(days=(today.weekday() + 1) % 7)
start_date_sunday = last_sunday - timedelta(weeks=num_deposits - 1)  # Adjusted to include the desired range

# Calculate the most recent past Wednesday
last_wednesday = today - timedelta(days=(today.weekday() - 2) % 7)
start_date_wednesday = last_wednesday - timedelta(weeks=num_deposits - 1)  # Adjusted to include the desired range

# Generate Sunday deposits
deposits_sunday = generate_deposits(num_deposits, min_amount_sunday, max_amount_sunday, profile_id, start_date_sunday, 6)

# Generate Wednesday deposits
deposits_wednesday = generate_deposits(num_deposits, min_amount_wednesday, max_amount_wednesday, profile_id, start_date_wednesday, 2)

script_dir = os.path.dirname(__file__)

# Save Sunday deposits to folders
for deposit in deposits_sunday:
    deposit_date = deposit["depositDate"]
    folder_name = datetime.strptime(deposit_date, "%Y-%m-%d").strftime("%Y-%m")
    folder_path = os.path.join(os.path.dirname(script_dir), folder_name)
    
    # Create the folder if it does not exist
    os.makedirs(folder_path, exist_ok=True)
    
    # Define the output file path
    output_file_name = f"{deposit_date}-dep-sun.json"
    output_file_path = os.path.join(folder_path, output_file_name)    

    # Save the deposit to the file
    with open(output_file_path, "w") as f:
        json.dump(deposit, f, indent=4, default=str)

# Save Wednesday deposits to folders
for deposit in deposits_wednesday:
    deposit_date = deposit["depositDate"]
    folder_name = datetime.strptime(deposit_date, "%Y-%m-%d").strftime("%Y-%m")
    folder_path = os.path.join(os.path.dirname(script_dir), folder_name)
    
    # Create the folder if it does not exist
    os.makedirs(folder_path, exist_ok=True)
    
    # Define the output file path
    output_file_name = f"{deposit_date}-dep-wed.json"
    output_file_path = os.path.join(folder_path, output_file_name)    

    # Save the deposit to the file
    with open(output_file_path, "w") as f:
        json.dump(deposit, f, indent=4, default=str)

print("Deposits saved to respective folders.")
