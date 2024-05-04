from shapely.geometry import shape, mapping
from pymongo.errors import BulkWriteError
import matplotlib.pyplot as plt
import multiprocessing as mp
from pprint import pprint
from typing import Dict
import geopandas as gpd
from shapely import wkt
import pandas as pd
import numpy as np
import os
import folium
import maup

# Demographic Heat Map of Precincts
# + Election Results (Pres, Sen, Gov, etc.)
def block_to_precinct(block_data: gpd.GeoDataFrame,
                      precinct_data: gpd.GeoDataFrame,
                      aggr_vars: list,
                      ):

    nv_block_prec_assigns = maup.assign(block_data.geometry, precinct_data.geometry)
    return nv_block_prec_assigns

def variable_grouping(assignment_data,
                      block_data,
                      precinct_data,
                      variables: list):
    # precinct_data[nv_variables] = block_data[nv_variables].groupby(nv_block_prec_assigns).sum()
    pass

### Demographic Heat Map of Districts ###
def precinct_to_district():
    pass


def find_precinct_neighbors(precinct_data: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    '''Find the neighbors of each precinct in the precinct data and add it to the dataframe'''
    neighbors = maup.adjacencies(precinct_data)
    precinct_data['neighbors'] = neighbors
    return precinct_data

def rename_columns(dataframe: pd.DataFrame, columns_map: Dict) -> None:
    dataframe.rename(columns=columns_map, inplace=True)

def fill_missing_pop_w_normal_dist(dataframe: pd.DataFrame,
                                  name: str,
                                  column: pd.Series
                                  ) -> pd.Series:
    mean = column.mean()
    std = column.std()
    adj_std = np.clip(std / 1000, 0, std)
    adj_mean = np.clip(mean - std, 0, mean)
    is_null = column.isna()
    num_missing = is_null.sum()
    maximum_acceptable_pop = dataframe[name].max()
    # pprint(mean, std, maximum_acceptable_pop)
    
    if num_missing > 0:
        fill_values = np.random.default_rng().gamma(adj_mean, adj_std, num_missing)        
        column[is_null] = np.clip(fill_values, 0, maximum_acceptable_pop)
        pprint('---')
    return column

def calculate_state_wide_stats(dataframe: pd.DataFrame, columns: list) -> pd.DataFrame:
    pass

def combine_election_results(block_df: pd.DataFrame, precinct_df: pd.DataFrame) -> pd.DataFrame:
    block_precinct_assign = maup.assign(block_df, precinct_df)
    columns = []
    aggregated_election_results = block_df.groupby(block_precinct_assign).sum()
    return aggregated_election_results

### TRANSFORM FUNCTIONS ###

def to_math_crs(geometry_data):
    geometry_data.to_crs(epsg=32030, inplace=True)
    return geometry_data

def to_world_crs(geometry_data):
    geometry_data.to_crs(epsg=4326, inplace=True)
    return geometry_data

def simplify_geometry(geometry_data):
    geometry_data['geometry'] = geometry_data['geometry'].simplify(0.001)
    return geometry_data

### Data Observation Functions ###
def common_columns(precinct_data: gpd.GeoDataFrame, block_data: gpd.GeoDataFrame) -> None:
    pprint(precinct_data.columns.intersection(block_data.columns))

def missing_data(precinct_data: gpd.GeoDataFrame) -> None:
    pprint(precinct_data.isna().sum())

def print_columns(precinct_data: gpd.GeoDataFrame) -> None:
    pprint(precinct_data.columns)

def print_df(precinct_data: gpd.GeoDataFrame) -> None:
    pprint(precinct_data.head())

def print_spacer() -> None:
    pprint('------------')

def print_crs(data: gpd.GeoDataFrame) -> None:
    pprint(data.crs)

if __name__ == "__main__":
    # Get the current working directory
    current_directory = os.getcwd()
    client_dir = os.path.join(current_directory, 'client')
    public_dir = os.path.join(client_dir, 'public')
    new_path = os.chdir(public_dir)
    print(os.getcwd())


    # State Assembly Data
    # Precinct Data - Geometry, Vote Results + % (How many elections?), Demographics + %
    # District Data - Geometry, Vote Results, Representative
    # 

    
    nv_block_df = gpd.read_file('NV/districtr_nv_blockDemo/export-2657.shp')

    nv_pres_results_prec = gpd.read_file('NV/nv_vest_20/nv_vest_20.shp')

    # Preprocessing Presidential Election Data
    nv_pres_results_prec = gpd.read_file('NV/nv_vest_20/nv_vest_20.shp')
    nv_pres_results_prec['UNIQUE_ID'] = nv_pres_results_prec['COUNTY'] + '-' + nv_pres_results_prec['VTDST'].str.lstrip('0')
    nv_pres_results_prec = nv_pres_results_prec[nv_pres_results_prec['NAME'] != 'Voting Districts Not Defined']

    # https://redistrictingdatahub.org/dataset/nevada-2022-general-election-precinct-level-results/
    nv_atg_gov_vote_2022 = gpd.read_file('NV/nv_2022_gen_prec/nv_2022_gen_prec.csv')

    ## Preprocessing Gubernational and Attorney General Data
    nv_atg_gov_vote_2022 = nv_atg_gov_vote_2022.iloc[:, :16]
    nv_atg_gov_vote_2022['PREC'] = nv_atg_gov_vote_2022['PREC'].str.extract('(\d+)').astype(float)
    nv_atg_gov_vote_2022.dropna(inplace=True)
    nv_atg_gov_vote_2022['PREC'] = nv_atg_gov_vote_2022['PREC'].fillna(0).astype(int)
    nv_atg_gov_vote_2022['UNIQUE_ID'] = nv_atg_gov_vote_2022['COUNTYFP'] + '-' + nv_atg_gov_vote_2022['PREC'].astype(str)



    print_df(nv_block_df)
    print_df(nv_pres_results_prec)
    print_columns(nv_block_df)

    print_crs(nv_block_df)
    # print_crs(nv_atg_gov_vote_2022)
    print_crs(nv_pres_results_prec)

    # Changing CRS
    to_math_crs(nv_block_df)
    to_math_crs(nv_pres_results_prec)

    # maup.doctor(nv_block_df)
    # print_spacer()
    # maup.doctor(nv_pres_results_prec)
    # print_spacer()
    # maup.doctor(nv_atg_gov_vote_2022)

    

    # blocks_to_pres_assignments = combine_election_results(nv_block_df, nv_pres_results_prec)
    # blocks_to_atg_gov_assignments = combine_election_results(nv_block_df, nv_atg_gov_results_prec)