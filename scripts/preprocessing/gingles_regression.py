from typing import List

from sklearn.metrics import r2_score, mean_squared_error
from sklearn.ensemble import RandomForestRegressor
from sklearn.datasets import make_regression
from scipy.optimize import curve_fit, least_squares
import matplotlib.pyplot as plt
from pprint import pprint
import geopandas as gpd
from multiprocessing import Pool
import pandas as pd
import numpy as np
import re
import os

NUM_OF_COEFFICIENTS = 2

### --------- MODELS --------- ###


def exponential_model(x, a, b, c):
    return a * np.exp(-b * x) + c


def logistic_model(x, a, b, c):
    return c / (1 + np.exp(-a * (x - b)))


def power_law_model(x, a, b):
    return a * np.power(x, b)


# Logarithmic model function
def logarithmic_model(x, a, b):
    return a * np.log(x) + b


# Model function for nth-order root
def nth_root_model(x, a, b, n) -> np.array:
    return a * np.power(x, 1 / n) + b


def sigmoid(x, a, b) -> np.array:
    return 1 / (1 + np.exp(-a * (x - b)))


# Model function for nth-order polynomial
def nth_order_polynomial(x, *coefficients):
    degree = len(coefficients) - 1
    y = np.zeros_like(x)
    for i in range(degree + 1):
        y += coefficients[i] * np.power(x, degree - i)
    return y

### --------- MODEL FITTING --------- ###

def fit_model_and_calculate_metrics(model, x_data, y_data_noisy):
    popt, _ = curve_fit(model, x_data, y_data_noisy, maxfev=5000)
    y_fit = model(x_data, *popt)
    r_squared = r2_score(y_data_noisy, y_fit)
    return popt, y_fit, r_squared


def fit_nonlinear_model(data, elections) -> pd.DataFrame:
    fit_lines_df = pd.DataFrame(columns=['uniqueId', 'race', 'state', 'xFitData',
                                         'fitLineDem', 'fitLineRep', 'electionType',
                                         'xData', 'yDataDem', 'yDataRep'])
    pct_races = ['pct_wvap', 'pct_bvap', 'pct_asianvap', 'pct_hvap']
    row_counter = 0
    election_counter = 0
    for election in elections:
        democrat = election[0]
        republican = election[1]
        for idx, pct_race in enumerate(pct_races):
            race_vap = re.sub(r'pct_', '', pct_race)
            if race_vap == 'wvap':
                fit_lines_df.loc[row_counter, ['race']] = 'White'
            if race_vap == 'bvap':
                fit_lines_df.loc[row_counter, ['race']] = 'Black'
            if race_vap == 'hvap':
                fit_lines_df.loc[row_counter, ['race']] = 'Hispanic'
            if race_vap == 'asianvap':
                fit_lines_df.loc[row_counter, ['race']] = 'Asian'

            if data['state'][0] == 'Nevada' or (race_vap == 'asianvap'):
                is_race = data[pct_race] != 0.0
                is_democrat = data[democrat] != 0.0
                is_republican = data[republican] != 0.0
            else:
                is_race = data[pct_race] >= 0.01
                is_democrat = data[democrat] >= 0.01
                is_republican = data[republican] >= 0.01

            # Define Model Type
            nonlinear_model = nth_root_model
            if ((data['state'][0] == 'Nevada') and
                    (race_vap == 'wvap') or (race_vap == 'bvap')):
                nonlinear_model = sigmoid

            nonzero_data = data[is_race & is_democrat & is_republican]
            race_pct = nonzero_data[pct_race]
            y_noise_dem, y_noise_rep = nonzero_data[democrat], nonzero_data[republican]
            popt_dem, y_fit_dem, r_squared_dem = fit_model_and_calculate_metrics(
                                                        nonlinear_model, race_pct, y_noise_dem)
            popt_rep, y_fit_rep, r_squared_rep = fit_model_and_calculate_metrics(
                                                        nonlinear_model, race_pct, y_noise_rep)

            fit_data_variables = ['xFitData', 'fitLineDem', 'fitLineRep']
            real_data_variables = ['xData', 'yDataDem', 'yDataRep']
            election_type = 'President'
            if election_counter:
                election_type = 'USS'

            x_fit = np.linspace(0, 1, len(race_pct))
            fit_rep_y = nonlinear_model(x_fit, *popt_rep)
            fit_dem_y = nonlinear_model(x_fit, *popt_dem)
            fit_lines_df.loc[row_counter, ['electionType']] = election_type
            fit_lines_df.loc[row_counter, real_data_variables] = \
                [race_pct.to_list(), y_noise_dem.to_list(), y_noise_rep.to_list()]
            fit_lines_df.loc[row_counter, fit_data_variables] = \
                [x_fit.tolist(), fit_dem_y.tolist(), fit_rep_y.tolist()]
            fit_lines_df.loc[row_counter, 'uniqueId'] = nonzero_data['uniqueId'].to_list()

            row_counter += 1
        #     plt.subplot(2, 2, idx + 1)
        #     plt.scatter(race_pct, y_noise_dem, color='b')
        #     plt.scatter(race_pct, y_noise_rep, color='r')
        #     plt.plot(x_fit, fit_dem_y, '-', label='fitLineDem')
        #     plt.plot(x_fit, fit_rep_y, '-', label='fitLineRep')
        #     plt.xlabel(pct_race)
        #     if race_vap == 'asianvap':
        #         plt.xlim(-0.01, 0.20)
        #     plt.ylim(-0.05, 1.05)
        #     plt.suptitle(election_type + data['state'][0])
        # plt.tight_layout()
        # plt.show()

        election_counter += 1
    fit_lines_df['state'] = data['state'][0]
    return fit_lines_df


def get_race_pct_vote():
    return


if __name__ == "__main__":
    current_directory = os.getcwd()
    move_up = os.path.dirname(os.path.dirname(os.path.dirname(current_directory)))
    data_dir = os.path.join(move_up, 'Data')
    new_path = os.chdir(data_dir)

    ### NEVADA ###
    nv_precinct_data = pd.read_csv('NV/nv_precinct_final_data.csv')
    nv_elections = [['pct_bid', 'pct_tru'], ['pct_cor', 'pct_lax']]
    gingles_df = fit_nonlinear_model(nv_precinct_data, nv_elections)

    ms_precinct_df = pd.read_csv('MS/ms_precinct_final_data.csv')
    ms_elections = [['pct_bid', 'pct_tru'], ['pct_hyd', 'pct_esp']]
    data = fit_nonlinear_model(ms_precinct_df, ms_elections)
    pprint(gingles_df.columns)


    # gingles_ms = fit_nonlinear_model(ms_precinct_df, ms_precinct_df.index)
    # pprint(gingles_df.columns)
    # for idx, row in gingles_df.iterrows():
    #     plt.scatter(row['xData'], row['yDataDem'], color='g')
    #     plt.scatter(row['xData'], row['yDataRep'], color='k')
    #     plt.plot(row['xData'], row['fitLineDem'], color='b')
    #     plt.plot(row['xData'], row['fitLineRep'], color='r')
    #     plt.xlabel(row['race'])
    #     plt.suptitle(row['electionType'] + ' ' + row['state'])
    #     plt.show()
    # for idx, row in gingles_df.iterrows():
    #     pprint(row['race'])
    #     pprint(row['state'])
    #     pprint(row['electionType'])
    #     pprint(row['fitLineDem'][:10])
    #     pprint(row['fitLineRep'][:10])
    # pprint(len(row['xData']))
    # pprint(len(row['yDataDem']))
    # pprint(len(row['yDataRep']))
    # pprint(len(row['fitLineDem']))
    # pprint(len(row['fitLineRep']))
    # X, y = make_regression(n_features=4, n_informative=2,
    #                     random_state=0, shuffle=False)
    #
    # regr = RandomForestRegressor(max_depth=2, random_state=0)
    # regr.fit(X, y)
    # print(regr.predict([[0, 0, 0, 0]]))

    # Data: State, y (Dem Vote, Rep Vote), x (Ethnicity), Dem Reg, Rep Reg
    # nv_race_vote_pcts = pd.read_csv('nv_gingles_data.csv')

    # pprint(nv_precinct_data.columns)
    # pprint(nv_precinct_data.dtypes)
    # optimizer1 = [-0.59156397,  0.86693974,  1.20820169]
    # optimizer2 = [0.59156321, 0.13306132, 1.20819709]
    # # optimized = [-0.58685524,  0.75255525,  1.97932333]
    # x_data = np.linspace(0, 1, 1000)
    # y_data1 = nth_root_model(x_data, *optimizer1)
    # y_data2 = nth_root_model(x_data, *optimizer2)

    ### MISSISSIPPI ###
