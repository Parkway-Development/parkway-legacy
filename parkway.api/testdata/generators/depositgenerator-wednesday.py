import json
import random
from datetime import datetime, timedelta

# Function to generate a list of deposit records
def generate_deposits(num_deposits, min_amount, max_amount, profile_id, start_date):
    deposits = []
    current_date = start_date
    while len(deposits) < num_deposits:
        # Ensure the date is a Wednesday
        while current_date.weekday() != 2:
            current_date += timedelta(days=1)
        
        deposit = {
            "amount": random.randint(min_amount, max_amount),
            "responsiblePartyProfileId": profile_id,
            "depositDate": current_date.strftime("%Y-%m-%d")
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

# Save to file
output_file = "deposits-wednesday.json"
with open(output_file, "w") as f:
    json.dump(deposits, f, indent=4)

print(f"Deposits saved to {output_file}")
