import json
import random
import os
from datetime import datetime

def load_json(filename):
    with open(filename, 'r') as file:
        return json.load(file)

def save_json(filename, data):
    with open(filename, 'w') as file:
        json.dump(data, file, indent=4)

def generate_contribution(profile_ids, account_ids, net_amount, transaction_date):
    contribution = {
        "contributorProfileId": random.choice(profile_ids),
        "gross": net_amount,
        "fees": 0,
        "net": net_amount,
        "accounts": [],
        "transactionDate": transaction_date,
        "type": random.choice(["cash", "check"]),
        "notes": ["Generated contribution"]
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

def generate_unassigned_contribution(general_fund_account_id, deposit_amount, transaction_date):
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
        "transactionDate": transaction_date,
        "type": random.choice(["cash", "check"]),
        "notes": ["Generated unassigned contribution"]
    }

def process_deposits(deposit_files, profiles_file, accounts_file):
    profiles = load_json(profiles_file)
    accounts = load_json(accounts_file)

    profile_ids = [profile["_id"] for profile in profiles]
    account_ids = [account["_id"] for account in accounts]
    general_fund_account_id = next(account["_id"] for account in accounts if account.get("name") == "General Fund")

    for deposit_file in deposit_files:
        deposits = load_json(deposit_file)

        for deposit in deposits:
            contributions = []
            deposit_amount = deposit["amount"]
            transaction_date = deposit["depositDate"]
            transaction_date_obj = datetime.strptime(transaction_date, "%Y-%m-%dT%H:%M:%SZ")
            year_month = transaction_date_obj.strftime("%Y-%m")
            output_dir = os.path.join("..", year_month)

            os.makedirs(output_dir, exist_ok=True)

            if 'wednesday' in deposit_file:
                num_contributions = random.randint(25, 50)
            elif 'sunday' in deposit_file:
                num_contributions = random.randint(200, 300)
            else:
                num_contributions = random.randint(10, 20)  # Default case for other days if any

            for _ in range(num_contributions):
                net_amount = random.randint(500, 5000)
                contributions.append(generate_contribution(profile_ids, account_ids, net_amount, transaction_date))

            contributions.append(generate_unassigned_contribution(general_fund_account_id, deposit_amount, transaction_date))

            output_filename = os.path.join(output_dir, f'contributions-{transaction_date[:10]}.json')
            save_json(output_filename, contributions)

if __name__ == "__main__":
    deposit_files = ["deposits-sunday.json", "deposits-wednesday.json"]
    profiles_file = "../profiles.json"
    accounts_file = "../accounts.json"

    process_deposits(deposit_files, profiles_file, accounts_file)
