import json
import random
import os
from datetime import datetime, timedelta
from bson import ObjectId

# Function to generate a list of deposit records
def generate_deposits(num_deposits, min_amount, max_amount, profile_id, start_date):
    deposits = []
    current_date = start_date
    while len(deposits) < num_deposits:
        # Ensure the date is a Wednesday
        while current_date.weekday() != 2:
            current_date += timedelta(days=1)
        
        deposit_date_str = current_date.strftime("%Y-%m-%d")
        deposit_date = datetime.strptime(deposit_date_str, "%Y-%m-%d")
        
        deposit = {
            "amount": random.randint(min_amount, max_amount),
            "responsiblePartyProfileId": profile_id,
            "depositDate": deposit_date_str,
            "depositId": str(ObjectId()),
            "currentStatus": "unallocated",
            "statusDate": deposit_date_str,
            "history": [
                {
                    "status": "undeposited",
                    "date": deposit_date,
                    "responsiblePartyProfileId": profile_id
                },
                {
                    "status": "unallocated",
                    "date": deposit_date,
                    "responsiblePartyProfileId": profile_id
                }
            ]
        }
        deposits.append(deposit)
        current_date += timedelta(days=7)  # Move to the next Wednesday
    return deposits

# Parameters
num_deposits = 52
min_amount = 200000
max_amount = 500000
profile_id = "6658aac2692d5194441b6897"

# Calculate the most recent past Wednesday
today = datetime.now()
last_wednesday = today - timedelta(days=(today.weekday() - 2) % 7)
start_date = last_wednesday - timedelta(weeks=num_deposits)

# Generate deposits
deposits = generate_deposits(num_deposits, min_amount, max_amount, profile_id, start_date)

# Save to folders
for deposit in deposits:
    deposit_date = deposit["depositDate"]
    folder_name = datetime.strptime(deposit_date, "%Y-%m-%d").strftime("%Y-%m")
    folder_path = os.path.join("..", folder_name)
    
    # Create the folder if it does not exist
    os.makedirs(folder_path, exist_ok=True)
    
    # Define the output file path
    output_file_name = f"{deposit_date}-dep-wed.json"
    output_file_path = os.path.join(folder_path, output_file_name)    

    # Save the deposit to the file
    with open(output_file_path, "w") as f:
        json.dump(deposit, f, indent=4, default=str)  # Ensure dates are serializable

print("Deposits saved to respective folders.")
