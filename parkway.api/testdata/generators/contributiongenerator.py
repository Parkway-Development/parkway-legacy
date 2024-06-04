import json
import random
import os
from datetime import datetime
import logging
import glob

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def load_json(filename):
    try:
        with open(filename, 'r') as file:
            logging.info(f"Loading JSON from {filename}")
            return json.load(file)
    except Exception as e:
        logging.error(f"Error loading JSON from {filename}: {e}")
        return None

def save_json(filename, data):
    try:
        with open(filename, 'w') as file:
            json.dump(data, file, indent=4)
            logging.info(f"Saved JSON to {filename}")
    except Exception as e:
        logging.error(f"Error saving JSON to {filename}: {e}")

def generate_contribution(profile_ids, account_ids, net_amount, transaction_date, deposit_id):
    contribution = {
        "contributorProfileId": random.choice(profile_ids),
        "gross": net_amount,
        "fees": 0,
        "net": net_amount,
        "accounts": [],
        "deposit_id": deposit_id,
        "transactionDate": transaction_date,
        "type": random.choice(["cash", "check"]),
        "notes": ["Generated contribution"],
        "responsiblePartyProfileId": "6658aac2692d5194441b6897"
    }

    remaining_amount = net_amount
    if random.random() > 0.5:  # 50% chance to split across multiple accounts
        while remaining_amount > 500:
            amount = random.randint(500, min(remaining_amount, 5000))
            contribution["accounts"].append({
                "accountId": random.choice(account_ids),
                "amount": amount
            })
            remaining_amount -= amount
        if remaining_amount > 0:
            contribution["accounts"].append({
                "accountId": random.choice(account_ids),
                "amount": remaining_amount
            })
    else:
        contribution["accounts"].append({
            "accountId": random.choice(account_ids),
            "amount": net_amount
        })

    return contribution

def generate_unassigned_contribution(general_fund_account_id, deposit_amount, transaction_date, deposit_id):
    unassigned_amount = random.randint(500, int(deposit_amount * 0.25))
    return {
        "contributorProfileId": None,
        "gross": unassigned_amount,
        "fees": 0,
        "net": unassigned_amount,
        "accounts": [
            {
                "accountId": general_fund_account_id,
                "amount": unassigned_amount
            }
        ],
        "deposit_id": deposit_id,
        "transactionDate": transaction_date,
        "type": random.choice(["cash", "check"]),
        "notes": ["Generated unassigned contribution"]
    }

def delete_old_contribution_files(base_dir):
    pattern = os.path.join(base_dir, "**", "*-con-*.json")
    old_files = glob.glob(pattern, recursive=True)
    for old_file in old_files:
        logging.info(f"Deleting old contribution file: {old_file}")
        os.remove(old_file)

def process_deposits(profiles_file, accounts_file):
    profiles = load_json(profiles_file)
    accounts = load_json(accounts_file)

    if profiles is None or accounts is None:
        logging.error("Failed to load profiles or accounts.")
        return

    profile_ids = [profile["_id"]["$oid"] for profile in profiles]
    account_ids = [account["_id"] for account in accounts]
    general_fund_account_id = next((account["_id"] for account in accounts if account.get("name") == "General Fund"), None)

    if general_fund_account_id is None:
        logging.error("General Fund account not found.")
        return

    # Locate all deposit files matching the new pattern
    deposit_files = glob.glob("../**/**-dep-*.json", recursive=True)
    logging.info(f"Found {len(deposit_files)} deposit files")

    # Delete old contribution files
    delete_old_contribution_files("..")

    for deposit_file in deposit_files:
        deposit = load_json(deposit_file)
        if deposit is None:
            logging.error(f"Failed to load deposit from {deposit_file}")
            continue

        logging.info(f"Processing {deposit_file}")

        contributions = []
        try:
            deposit_amount = deposit["amount"]
            transaction_date = deposit["depositDate"]
            deposit_id = deposit["depositId"]
        except KeyError as e:
            logging.error(f"Missing expected key {e} in deposit: {deposit}")
            continue

        transaction_date_obj = datetime.strptime(transaction_date, "%Y-%m-%d")
        year_month = transaction_date_obj.strftime("%Y-%m")
        output_dir = os.path.join("..", year_month)

        os.makedirs(output_dir, exist_ok=True)

        if '-dep-wed.json' in deposit_file:
            num_contributions = random.randint(25, 50)
        elif '-dep-sun.json' in deposit_file:
            num_contributions = random.randint(200, 300)
        else:
            num_contributions = random.randint(10, 20)  # Default case for other days if any

        logging.info(f"Generating {num_contributions} contributions")

        for _ in range(num_contributions):
            net_amount = random.randint(500, 5000)
            contributions.append(generate_contribution(profile_ids, account_ids, net_amount, transaction_date, deposit_id))

        contributions.append(generate_unassigned_contribution(general_fund_account_id, deposit_amount, transaction_date, deposit_id))

        # Set the filename of the contributions to match the deposit filename, replacing "dep" with "con"
        contribution_filename = deposit_file.replace("-dep-", "-con-")
        output_filename = os.path.join(output_dir, os.path.basename(contribution_filename))
        
        save_json(output_filename, contributions)
        logging.info(f"Saved contributions to {output_filename}")

if __name__ == "__main__":
    profiles_file = "../profiles.json"
    accounts_file = "../accounts.json"

    process_deposits(profiles_file, accounts_file)
