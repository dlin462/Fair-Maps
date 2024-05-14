from shapely.geometry import shape, mapping
from typing import Dict, Tuple, List
import matplotlib.pyplot as plt
from pymongo import MongoClient
from shapely.wkt import dumps
from data_processing import *
from gingles_regression import *
from ecologicalInference import *
from scripts.seawulf.mgggReCom import *
from multiprocessing import Pool
from pprint import pprint
import geopandas as gpd
import pandas as pd
import numpy as np
import os


## TRANSFORM FUNCTIONS ##

def geometry_to_wkt(geometry_data):
    """Convert a GeoDataFrame geometries to WKT format"""
    try:
        geometry_data['geometry'] = gpd.array.to_wkt(geometry_data['geometry'].values)
        geometry_data.drop(columns=['geometry'], inplace=True, axis=1)
    except Exception as e:
        pprint(e)

    return geometry_data


def wkt_to_geometry_data(geometry_data):
    """Convert a WKT geometries to GeoDataFrame geometries"""
    try:
        geometry_data['geometry'] = gpd.GeoSeries.from_wkt(geometry_data['geometry'])
    except Exception as e:
        pprint(e)

    return geometry_data


def aggr_elections_to_dict(dataframe: pd.DataFrame) -> Tuple[Dict, Dict]:
    pres_elections = [col for col in dataframe.columns if 'PRE' in col]
    uss_elections = [col for col in dataframe.columns if 'USS' in col]

    pres_elections_dict = dataframe[pres_elections].to_dict('records')
    uss_elections_dict = dataframe[uss_elections].to_dict('records')
    dataframe.drop((pres_elections + uss_elections), axis=1, inplace=True)

    return pres_elections_dict, uss_elections_dict

def aggr_demographic_to_dict(dataframe: pd.DataFrame) -> Dict:
    demographics = ['vap', 'wvap', 'bvap', 'asianvap', 'hvap']
    demographic_columns = [col for col in dataframe.columns
                           if any(demographic in col
                                  for demographic in demographics)]
    demographic_dict = dataframe[demographic_columns].to_dict('records')
    dataframe.drop(demographic_columns, axis=1, inplace=True)

    return demographic_dict

def df_to_dict(main_dataframe: pd.DataFrame,
               dict_items: Dict,
               is_precinct: bool = False) -> List[Dict]:
    """Convert a GeoDataFrame to a dictionary of records"""
    final_dict = main_dataframe.to_dict(orient='records')
    for name, docs in dict_items.items():
        print('Are we here?')
        for final_doc, nested_doc in zip(final_dict, docs):
            new_doc = {}
            if 'Election' in name:
                for party in nested_doc:
                    if party.endswith('D'):
                        party_name = 'democratic'
                        new_doc[party_name] = nested_doc.get(party)
                    if party.endswith('R'):
                        party_name = 'republican'
                        new_doc[party_name] = nested_doc.get(party)

            else:
                new_doc = nested_doc.copy()
            final_doc[name] = new_doc
    # pprint(final_dict)
    return final_dict


def read_geometry_file(file_path: str, state: str) -> Dict:
    """Read a GeoJSON file and convert it to a dictionary of WKT geometries"""
    geom_df = gpd.read_file(f"{file_path}.geojson")
    lon_lat_df = to_world_crs(geom_df)
    simplified_geom = simplify_geometry(lon_lat_df)
    textified_data = geometry_to_wkt(simplified_geom)
    geom_dict = df_to_dict(textified_data)
    return geom_dict


# Database Methods
def send_one(collection_name, data) -> None:
    """Send a single document to a MongoDB collection"""
    cluster = MongoClient(
        "mongodb+srv://aaronlin2:sW3VK2ypQJnOqA02@cse416-redistricting.8uy1r4c.mongodb.net/?retryWrites=true&w=majority&appName=CSE416-Redistricting")
    database = cluster['CSE416-Redistricting']
    collection = database[collection_name]
    try:
        collection.insert_one(data)
    except BulkWriteError as bwe:
        pprint(bwe.details)


def send_many(collection_name, data) -> None:
    """Send many documents to a MongoDB collection"""
    cluster = MongoClient(
        "mongodb+srv://aaronlin2:sW3VK2ypQJnOqA02@cse416-redistricting.8uy1r4c.mongodb.net/?retryWrites=true&w=majority&appName=CSE416-Redistricting")
    database = cluster['CSE416-Redistricting']
    collection = database[collection_name]
    try:
        collection.insert_many(data)
    except BulkWriteError as bwe:
        pprint(bwe.details)


if __name__ == '__main__':
    current_directory = os.getcwd()
    move_up = os.path.dirname(os.path.dirname(os.path.dirname(current_directory)))
    data_dir = os.path.join(move_up, 'Data')
    new_path = os.chdir(data_dir)
    print(os.getcwd())
    # pprint(os.listdir())


    nv_district_df = pd.read_csv('NV/nv_district_final_data.csv')
    nv_precinct_df = pd.read_csv('NV/nv_precinct_final_data.csv')
    nv_precinct_graph_data = gpd.read_file('NV/nv_precinct_cont_data.shp')
    nv_precinct_graph_data.rename(columns={'districtNu': 'districtNum'}, inplace=True)

    ms_district_df = pd.read_csv('MS/ms_district_final_data.csv')
    ms_precinct_df = pd.read_csv('MS/ms_precinct_final_data.csv')
    ms_precinct_graph_data = gpd.read_file('MS/ms_precinct_cont_data.shp')
    ms_precinct_graph_data.rename(columns={'distrctNum': 'districtNum'}, inplace=True)
    # pprint(nv_precinct_graph_data.columns)
    # pprint(ms_precinct_graph_data.columns)

    ### Nevada Districts Data ### COMPLETED
    # pres_dict, uss_dict = aggr_elections_to_dict(nv_district_df)
    # demo_dict = aggr_demographic_to_dict(nv_district_df)
    # documents = {'presElection': pres_dict, 'ussElection': uss_dict, 'demographicData': demo_dict}
    # nv_district_df.drop(labels=['pct_rep', 'pct_dem'], axis=1, inplace=True)
    # nv_district_dict = df_to_dict(nv_district_df, documents)
    # send_many(collection_name='districts', data=nv_district_dict)

    ### Nevada Precinct Data ### COMPLETED
    # pres_dict, uss_dict = aggr_elections_to_dict(nv_precinct_df)
    # demo_dict = aggr_demographic_to_dict(nv_precinct_df)
    # documents = {'presElection': pres_dict, 'ussElection': uss_dict, 'demographicData': demo_dict}
    # nv_precinct_df.drop(labels=['pct_bid', 'pct_tru', 'pct_cor', 'pct_lax'], axis=1, inplace=True)
    # nv_precinct_dict = df_to_dict(nv_precinct_df, documents)
    # send_many(collection_name='precincts', data=nv_precinct_dict)

    ### Nevada Statewide Measures ### COMPLETED
    # statewide_info = ['PRE20D', 'PRE20R', 'vap', 'wvap', 'bvap', 'asianvap', 'hvap']
    # nv_statewide_data = calculate_statewide_measures(nv_district_df, statewide_info)
    # nv_state_demo_dict = aggr_demographic_to_dict(nv_statewide_data)
    # documents = {'demographicData': nv_state_demo_dict}
    # nv_statewide_dict = df_to_dict(nv_statewide_data, documents)
    # send_many(collection_name='state', data=nv_statewide_dict)

    ### Nevada State Assembly Districts ### COMPLETED
    # nv_district_dict = read_geometry_file('NV/nv_state_district_2022')
    # send_many(collection_name='districts', data=nv_district_dict)

    ### Nevada Nonlinear Regression ### COMPLETED
    # nv_elections = [['pct_bid', 'pct_tru'], ['pct_cor', 'pct_lax']]
    # nv_nonlinear_df = fit_nonlinear_model(nv_precinct_df, nv_elections)
    # nv_nonlinear_dict = nv_nonlinear_df.to_dict(orient='records')
    # pprint(nv_nonlinear_dict)
    # send_many(collection_name='non_linear', data=nv_nonlinear_dict)


    ### Nevada Ecological Inference ### COMPLETED
    # wkt_to_geometry_data(nv_precinct_df)
    # nv_precinct_geodataframe = gpd.GeoDataFrame(nv_precinct_df, geometry='geometry')
    # nv_ecological_inference_df = run_ecological_inference(nv_precinct_geodataframe)
    # nv_eco_infer_dict = nv_ecological_inference_df.to_dict(orient='records')
    # send_many(collection_name='eco_infer', data=nv_eco_infer_dict)

    ### Nevada Opportunity Districts ###
    # nv_opportunity_districts_data, nv_box_whisker_data_grouped = run_markov_chain(nv_precinct_graph_data, 5000)
    # for box_whisker in nv_box_whisker_data_grouped:
    #     send_many(collection_name='box_whisker', data=box_whisker)
    # send_many(collection_name='opportunity_districts', data=nv_opportunity_districts_data)


    ### Nevada GerryChain ###
    # nv_precinct_df.rename(columns={'districtNum': 'districtNu'}, inplace=True)
    # send_many(collection_name='eco_infer', data=nv_eco_infer_dict)




    ### Mississippi Districts Data ### COMPLETED
    # pres_dict, uss_dict = aggr_elections_to_dict(ms_district_df)
    # demo_dict = aggr_demographic_to_dict(ms_district_df)
    # ms_district_df.drop(labels=['Unnamed: 0', 'pct_rep', 'pct_dem'], inplace=True, axis=1)
    # documents = {'presElection': pres_dict, 'ussElection': uss_dict, 'demographicData': demo_dict}
    # ms_district_dict = df_to_dict(ms_district_df, documents)
    # send_many(collection_name='districts', data=ms_district_dict)

    ### Mississippi Precinct Boundaries ### COMPLETED
    # ms_precinct_df.drop(labels=['Unnamed: 0', 'index', 'pct_bid', 'pct_tru', 'pct_hyd', 'pct_esp'], axis=1, inplace=True)
    # pres_dict, uss_dict = aggr_elections_to_dict(ms_precinct_df)
    # demo_dict = aggr_demographic_to_dict(ms_precinct_df)
    # documents = {'presElection': pres_dict, 'ussElection': uss_dict, 'demographicData': demo_dict}
    # ms_precinct_dict = df_to_dict(ms_precinct_df, documents)
    # send_many(collection_name='precincts', data=ms_precinct_dict)

    ### Mississippi Statewide Measures ### COMPLETED
    # statewide_info = ['PRE20D', 'PRE20R', 'vap', 'wvap', 'bvap', 'asianvap', 'hvap']
    # ms_statewide_data = calculate_statewide_measures(ms_district_df, statewide_info)
    # ms_state_demo_dict = aggr_demographic_to_dict(ms_statewide_data)
    # documents = {'demographicData': ms_state_demo_dict}
    # ms_statewide_dict = df_to_dict(ms_statewide_data, documents)
    # send_many(collection_name='state', data=ms_statewide_dict)

    ### Mississippi State Assembly Districts ### COMPLETED
    # ms_district_dict = gpd.read_file('ms_State_Assembly_2022.geojson')
    # send_many('ms_state_assembly', ms_district_dict, db)

    ### Mississippi Nonlinear Regression ### COMPLETED
    # ms_elections = [['pct_bid', 'pct_tru'], ['pct_esp', 'pct_hyd']]
    # ms_nonlinear_df = fit_nonlinear_model(ms_precinct_df, ms_elections)
    # ms_nonlinear_dict = ms_nonlinear_df.to_dict(orient='records')
    # send_many(collection_name='non_linear', data=ms_nonlinear_dict)

    ### Mississippi Ecological Inference ### COMPLETED
    # wkt_to_geometry_data(ms_precinct_df)
    # ms_precinct_geodataframe = gpd.GeoDataFrame(ms_precinct_df, geometry='geometry')
    # ms_ecological_inference_df = run_ecological_inference(ms_precinct_geodataframe)
    # ms_eco_infer_dict = ms_ecological_inference_df.to_dict(orient='records')
    # send_many(collection_name='eco_infer', data=ms_eco_infer_dict)

    ### Mississippi Opportunity Districts ###
    # ms_opportunity_districts_data, ms_box_whisker_data_grouped = run_markov_chain(ms_precinct_graph_data, 5000)

    # for box_whisker in ms_box_whisker_data_grouped:
    #     send_many(collection_name='box_whisker', data=box_whisker)
    # send_many(collection_name='opportunity_districts', data=ms_opportunity_districts_data)


    ### Mississippi GerryChain ###
    # ms_precinct_df.rename(columns={'distrctNum': 'districtNu'}, inplace=True)
    # send_many(collection_name='opportunity_districts', data=ms_opportunity_data)
