from sklearn.metrics import r2_score, mean_squared_error
from shapely.geometry import shape, mapping
from pymongo.errors import BulkWriteError
from scipy.optimize import curve_fit
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


def calculate_statewide_measures(dataframe: pd.DataFrame, statewide_measures: list) -> pd.DataFrame:
    """
    Computes to total VAP, % Republicans and % Democratic vote shares,
    and data with regards to each Demographic group
    Parameters
    ----------
    dataframe - Data containing statewide measures on a precinct level
    statewide_measures - Columns to be considered for statewide measures.

    Returns
    -------
    Dataframe of Statewide Measures
    """
    statewide_df = pd.DataFrame([{measure: dataframe[measure].sum() for measure in statewide_measures}])

    if dataframe['state'][0] == 'Nevada':
        statewide_df['partyControl'] = 'Democrat'
        statewide_df['state'] = 'Nevada'
    if dataframe['state'][0] == 'Mississippi':
        statewide_df['partyControl'] = 'Republican'
        statewide_df['state'] = 'Mississippi'

    statewide_df['pct_dem'] = (statewide_df['PRE20R'] / (statewide_df['PRE20R'] + statewide_df['PRE20D'])).astype(float)
    statewide_df['pct_rep'] = (statewide_df['PRE20D'] / (statewide_df['PRE20R'] + statewide_df['PRE20D'])).astype(float)
    statewide_df['pct_wvap'] = (statewide_df['wvap'] / statewide_df['vap']).astype(float)
    statewide_df['pct_bvap'] = (statewide_df['bvap'] / statewide_df['vap']).astype(float)
    statewide_df['pct_hvap'] = (statewide_df['hvap'] / statewide_df['vap']).astype(float)
    statewide_df['pct_asianvap'] = (statewide_df['asianvap'] / statewide_df['vap']).astype(float)

    new_column_names = {
        'PRE20D': 'democrat',
        'PRE20R': 'republican',
    }
    rename_columns(statewide_df, new_column_names)

    return statewide_df


def assembly_race_distribution(dataframe: pd.DataFrame) -> pd.DataFrame:
    return dataframe['Race'].value_counts()


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


# Define different nonlinear model functions
def exponential_model(x, a, b, c):
    return a * np.exp(-b * x) + c


def logistic_model(x, a, b, c):
    return c / (1 + np.exp(-a * (x - b)))


def power_law_model(x, a, b):
    return a * np.power(x, b)


# Define a function for fitting a model and calculating metrics
def fit_model_and_calculate_metrics(model, x_data, y_data_noisy):
    popt, _ = curve_fit(model, x_data, y_data_noisy)
    y_fit = model(x_data, *popt)
    r_squared = r2_score(y_data_noisy, y_fit)
    mse = mean_squared_error(y_data_noisy, y_fit)
    return popt, y_fit, r_squared, mse


if __name__ == "__main__":
    # Get the current working directory
    current_directory = os.getcwd()
    move_up = os.path.dirname(os.path.dirname(os.path.dirname(current_directory)))
    data_dir = os.path.join(move_up, 'Data')
    new_path = os.chdir(data_dir)

    # nv_precinct_data = gpd.read_file('NV/nv_precinct_final_data.geojson')
    nv_simplified_geom = gpd.read_file('nv_precinct_final_data.geojson')
    # nv_district_data = gpd.read_file('NV/nv_district_final_data.shp')
    pprint(nv_simplified_geom)

    pprint(nv_simplified_geom.isna().sum())

    # State Assembly Data
    # Precinct Data - Geometry, Vote Results + % (How many elections?), Demographics + %
    # District Data - Geometry, Vote Results, Representative