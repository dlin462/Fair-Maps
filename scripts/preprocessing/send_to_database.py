from shapely.geometry import shape, mapping
from pymongo.errors import BulkWriteError
import matplotlib.pyplot as plt
from pymongo import MongoClient
from shapely.wkt import dumps
import multiprocessing as mp
import scripts.preprocessing.data_processing as dc
from pprint import pprint
from typing import Dict
import geopandas as gpd
from shapely import wkt
import pandas as pd
import numpy as np
import os
import folium
import maup

## TRANSFORM FUNCTIONS ##

def geometry_to_wkt(geometry_data):
    """Convert a GeoDataFrame geometries to WKT format"""
    try:
        geometry_data['coordinates'] = gpd.array.to_wkt(geometry_data['geometry'].values)
        geometry_data.drop(columns=['geometry'], inplace=True, axis=1)
    except Exception as e:
        pprint(e)

    return geometry_data

def df_to_dict(data):
    """Convert a GeoDataFrame to a dictionary of records"""
    return data.to_dict(orient='records')

def read_geometry_file(file_name: str) -> Dict:
    """Read a GeoJSON file and convert it to a dictionary of WKT geometries"""
    geom_df = gpd.read_file(f"{file_name}.geojson")
    lon_lat_df = to_world_crs(geom_df)
    simplified_geom = simplify_geometry(lon_lat_df)
    textified_data = geometry_to_wkt(simplified_geom)
    geom_dict = df_to_dict(textified_data)
    return geom_dict

def send_one(collection_name, data, database) -> None:
    """Send a single document to a MongoDB collection"""
    collection = database[collection_name]
    collection.insert_one(data)


def send_many(collection_name, data, database, is_geometry=False) -> None:
    """Send many documents to a MongoDB collection"""
    collection = database[collection_name]
    # if is_geometry:
    #     collection.create_index([("geometry")])
        
    try:
        collection.insert_many(data)
    except BulkWriteError as bwe:
        pprint(bwe.details)



# if __name__ == '__main__':
#     current_directory = os.getcwd()
#     new_path = os.chdir(os.path.join(os.path.join(current_directory, 'client'), 'public'))
#     pprint(os.getcwd())

#     cluster = MongoClient("mongodb+srv://aaronlin2:sW3VK2ypQJnOqA02@cse416-redistricting.8uy1r4c.mongodb.net/?retryWrites=true&w=majority&appName=CSE416-Redistricting")
#     db = cluster['CSE416-Redistricting']
    
#     ### Mississippi Precinct Boundaries ###
    

#     ### Nevada Precinct Boundaries ###
#     # nv_precinct_dict = read_geometry_file('nv_precinct_geometry')
#     # send_many('nv_precincts', nv_precinct_dict, db, is_geometry=True)

#     ### Mississippi State Assembly Districts ###
#     # ms_district_dict = gpd.read_file('ms_State_Assembly_2022.geojson')
#     # send_many('ms_state_assembly', ms_district_dict, db, is_geometry=True)

#     #### Nevada State Assembly Districts ###
#     # nv_district_dict = read_geometry_file('nv_state_district_2022')
#     # send_many(collection_name='districts', data=nv_district_dict, database=db, is_geometry=True)   