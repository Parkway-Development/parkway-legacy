import json
import random
import os
from datetime import datetime
import logging
import glob
from bson import ObjectId

# Configuration
RESPONSIBLE_PARTY_PROFILE_ID = "6658aac2692d5194441b6897"
SCRIPT_DIR = os.path.dirname(__file__)
PROFILES_FILE = os.path.join(SCRIPT_DIR, "..", "profiles.json")
ACCOUNTS_FILE = os.path.join(SCRIPT_DIR, "..", "accounts.json")

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

def generate_contribution(profile_ids, account_ids, net_amount, transaction_date, deposit_id, order):
    contribution = {
        "order": order,
        "contributorProfileId": random.choice(profile_ids),
        "gross": net_amount,
        "fees": 0,
        "net": net_amount,
        "accounts": [
            {
                "accountId": random.choice(account_ids),
                "amount": net_amount
            }
        ],
        "depositId": deposit_id,
        "transactionDate": transaction_date,
        "monetaryInstrument": random.choice(["cash", "check"]),
        "notes": ["Generated contribution"],
        "responsiblePartyProfileId": RESPONSIBLE_PARTY_PROFILE_ID
    }

    return contribution

def generate_unassigned_contribution(general_fund_account_id, unassigned_amount, transaction_date, deposit_id, order):
    return {
        "order": order,
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
        "depositId": deposit_id,
        "transactionDate": transaction_date,
        "monetaryInstrument": random.choice(["cash", "check"]),
        "notes": ["Generated unassigned contribution"],
        "responsiblePartyProfileId": RESPONSIBLE_PARTY_PROFILE_ID
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
    deposit_files = glob.glob(os.path.join(SCRIPT_DIR, "..", "**", "*-dep-*.json"), recursive=True)
    logging.info(f"Found {len(deposit_files)} deposit files")

    # Delete old contribution files
    delete_old_contribution_files(os.path.join(SCRIPT_DIR, ".."))

    for deposit_file in deposit_files:
        deposit = load_json(deposit_file)
        if deposit is None:
            logging.error(f"Failed to load deposit from {deposit_file}")
            continue

        logging.info(f"Processing {deposit_file}")
        logging.info(f"Deposit Amount: {deposit['amount']}")

        contributions = []
        try:
            deposit_amount = deposit["amount"]
            transaction_date = deposit["depositDate"]
            deposit_id = deposit["_id"]["$oid"]
        except KeyError as e:
            logging.error(f"Missing expected key {e} in deposit: {deposit}")
            continue

        transaction_date_obj = datetime.strptime(transaction_date, "%Y-%m-%d")
        year_month = transaction_date_obj.strftime("%Y-%m")

        output_dir = os.path.join(SCRIPT_DIR, "..", year_month)

        os.makedirs(output_dir, exist_ok=True)

        remaining_amount = deposit_amount
        order = 1
        contribution_amount = random.randint(1000, 3000)

        while remaining_amount > 5000:
            if remaining_amount - contribution_amount <= 5000:
                break
            logging.info(f"Creating contribution {order} with amount {contribution_amount}")
            contributions.append(generate_contribution(profile_ids, account_ids, contribution_amount, transaction_date, deposit_id, order))
            remaining_amount -= contribution_amount
            contribution_amount += random.randint(1000, 3000)
            order += 1
            logging.info(f"Remaining amount: {remaining_amount}")

        # Generate the last unassigned contribution with the remaining amount
        if remaining_amount > 0:
            logging.info(f"Creating final unassigned contribution {order} with amount {remaining_amount}")
            contributions.append(generate_unassigned_contribution(general_fund_account_id, remaining_amount, transaction_date, deposit_id, order))

        # Write contributions to files in chunks of 100
        for i in range(0, len(contributions), 100):
            chunk = contributions[i:i+100]
            chunk_number = (i // 100) + 1
            contribution_filename = f"{transaction_date}-con-{chunk_number:03d}.json"
            output_filename = os.path.join(output_dir, contribution_filename)
            save_json(output_filename, chunk)
            logging.info(f"Saved contributions to {output_filename}")

if __name__ == "__main__":
    process_deposits(PROFILES_FILE, ACCOUNTS_FILE)
