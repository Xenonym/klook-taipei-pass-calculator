#!/usr/bin/env python3

import csv
import json

data = []


def process_row(row):
    row['Price'] = int(row['Price'])
    return row


filename = 'data_from_notion.csv'
with open(filename) as csvfile:
    reader = csv.DictReader(csvfile)
    data = [process_row(row) for row in reader]

with open('choices.json', 'w') as jsonfile:
    json.dump(data, jsonfile, indent=2)
