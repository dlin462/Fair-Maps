from pymongo import MongoClient
from pprint import pprint
import pandas as pd
from typing import Dict
import os

def read_state_table_csv(table_name: str) -> Dict:
    # Load the data
    table = pd.read_csv(f"{table_name}.csv")

    # Format the data
    if 'ms' in table_name:
        table.drop(table.index[122:], inplace=True)
        table['State'] = 'Mississippi'
    if 'nv' in table_name:
        table['State'] = 'Nevada'
        table.drop(table.index[42:], inplace=True)

    dict_table = table.to_dict(orient='records')
    return dict_table
    

if __name__ == "__main__":
    # Change directory
    current_directory = os.getcwd()
    new_path = os.chdir(os.path.join(os.path.join(current_directory, 'client'), 'public'))
    pprint(os.getcwd())

    # Connect to the database
    cluster = MongoClient("mongodb+srv://aaronlin2:sW3VK2ypQJnOqA02@cse416-redistricting.8uy1r4c.mongodb.net/?retryWrites=true&w=majority&appName=CSE416-Redistricting")
    db = cluster['CSE416-Redistricting']
    table_collection = db['state_assembly']

    # Load the data
    # ms_reps = pd.read_csv("ms reps - Mississippi.csv")
    # ms_reps.drop(ms_reps.index[122:], inplace=True)
    # print(ms_reps)
    ms_reps_dict = read_state_table_csv('ms reps - Mississippi')
    nv_reps_dict = read_state_table_csv('nv reps - Nevada')

    table_collection.insert_many(ms_reps_dict)
    table_collection.insert_many(nv_reps_dict)