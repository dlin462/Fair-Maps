# Imports
# import sqlalchemy as sal
# import pymongo
# from asyncio import sleep
import time
from pymongo import MongoClient, GEOSPHERE
from pprint import pprint
from shapely import wkt
from shapely.geometry import shape, mapping
from pymongo.errors import BulkWriteError
import geopandas as gpd
import numpy as np
import os
from typing import Dict

def main():
    cluster = MongoClient("mongodb+srv://aaronlin2:sW3VK2ypQJnOqA02@cse416-redistricting.8uy1r4c.mongodb.net/?retryWrites=true&w=majority&appName=CSE416-Redistricting")
    db = cluster['CSE416-Redistricting']
    testing_df = gpd.read_file('nv_precinct_geometry.geojson')
    # testing_df = gpd.read_file('ms_State_Assembly_2022.geojson')
    fixed_crs = fix_crs(testing_df)
    simplified_geom = simplify_geometry(fixed_crs)
    textified_data = geometry_to_wkt(simplified_geom)
    nv_geom_dict = df_to_dict(textified_data)

    # time.sleep(2)
    # send_one('nv_precincts', nv_geom_dict, db)
    send_many('nv_precincts', nv_geom_dict, db, is_geometry=True)
    # send_many('ms_state_assembly', nv_geom_dict, db, is_geometry=True)

def fix_crs(geometry_data):
    geometry_data.to_crs(epsg=4326, inplace=True)
    # pprint(geometry_data.crs)
    return geometry_data

def simplify_geometry(geometry_data):
    geometry_data['geometry'] = geometry_data['geometry'].simplify(0.001)
    return geometry_data

def geometry_to_wkt(geometry_data):
    try:
        # geometry_data['geometry'] = geometry_data['geometry'].apply(lambda geom: wkt.loads(geom))
        # pprint(geometry_data['geometry'].head())

        # geometry_data['geometry'] = wkt.dumps(geometry_data['geometry'])
        geometry_data['coordinates'] = gpd.array.to_wkt(geometry_data['geometry'].values)
        geometry_data.drop(columns=['geometry'], inplace=True, axis=1)
        pprint(geometry_data.head())
        # geometry_data['geometry'] = [geom for geom in geometry_data['geometry']]
        # geometry_data['geometry'] = geometry_data['geometry'].apply(lambda x: x.wkt)

    except Exception as e:
        pprint(e)
    # geometry_data['geometry'] = geometry_data.geometry.apply(lambda x: x.wkt)
    return geometry_data

def df_to_dict(data):
    # pprint(data.to_dict(orient='records'))
    # for index, row in data.iterrows():
    #     # pprint(row['geometry'])
    #     row['geometry'] = [row['geometry']]
    return data.to_dict(orient='records')

def send_one(collection_name, data, database) -> None:
    collection = database[collection_name]
    collection.insert_one(data)


def send_many(collection_name, data, database, is_geometry=False) -> None:
    # print(f"Sending {len(data)} documents to {collection_name} collection")
    collection = database[collection_name]
    # if is_geometry:
    #     collection.create_index([("geometry")])
        
    try:
        collection.insert_many(data)
    except BulkWriteError as bwe:
        pprint(bwe.details)

if __name__ == '__main__':

    # Get the current working directory
    # pprint(os.getcwd())
    current_directory = os.getcwd()
    new_path = os.chdir(os.path.join(os.path.join(current_directory, 'client'), 'public'))
    pprint(os.getcwd())

    main()