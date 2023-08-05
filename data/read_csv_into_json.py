#!/usr/bin/env python3

import csv
import json
import datetime


def process_row(row):
    row["Price"] = int(row["Price"])
    return row


data = []
filename = "data_from_notion.csv"
with open(filename) as csvfile:
    reader = csv.DictReader(csvfile)
    data = [process_row(row) for row in reader]

with open("choices.json", "w") as jsonfile:
    json.dump(
        {"last_updated": datetime.date.today().isoformat(), "choices": data},
        jsonfile,
        indent=2,
    )
