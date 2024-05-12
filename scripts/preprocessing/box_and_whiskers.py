import pandas as pd
from pprint import pprint
import numpy as np
import os
def current_district_plot(data: pd.DataFrame) -> pd.DataFrame:
    # pct_races = ['pct_wvap', 'pct_bvap', 'pct_asianvap', 'pct_hvap']
    # meta_data = ['districtNum', 'state']
    # current_plan = data[meta_data + pct_races]
    # pprint(current_plan)
    # # current_plan['state'] = data['state'][0]
    # return current_plan
    races = ['White', 'Black', 'Asian', 'Hispanic']
    row_counter = 0
    current_plan_df = pd.DataFrame(columns=['race', 'state', 'currentPlan',
                                            'districtOrder','ensemblesClustered'])
    for race in races:
        y_pct = []

        if race == 'White':
            # y_pct = np.sort(data['pct_wvap'].to_numpy())
            y_pct = data['pct_wvap'].to_list()
        if race == 'Black':
            # y_pct = np.sort(data['pct_bvap'].to_numpy())
            y_pct = data['pct_bvap'].to_list()
        if race == 'Asian':
            # y_pct = np.sort(data['pct_asianvap'].to_numpy())
            y_pct = data['pct_asianvap'].to_list()
        if race == 'Hispanic':
            # y_pct = np.sort(data['pct_hvap'].to_numpy())
            y_pct = data['pct_hvap'].to_list()

        data_dict = dict(zip(data['districtNum'], y_pct))
        sorted_data = sorted(data_dict.items(), key=lambda x: x[1])
        currentList, orderList = map(list, zip(*sorted_data))

        current_plan_df.loc[row_counter, 'race'] = race
        current_plan_df.loc[row_counter, ['currentPlan', 'districtOrder']] \
            = currentList, orderList

        row_counter += 1
    current_plan_df['state'] = data['state'][0]
    return current_plan_df
def ensemble_box_and_whiskers(current_district_plan: pd.DataFrame,
                              original_df: pd.DataFrame) -> pd.DataFrame:
    box_and_whiskers_df = current_district_plot(original_df)
    if current_district_plan.empty:
        pass

    return box_and_whiskers_df

current_directory = os.getcwd()
move_up = os.path.dirname(os.path.dirname(os.path.dirname(current_directory)))
data_dir = os.path.join(move_up, 'Data')
new_path = os.chdir(data_dir)
nv_district_df = pd.read_csv('NV/nv_district_final_data.csv')

ms_district_df = pd.read_csv('MS/ms_district_final_data.csv')

pprint(nv_district_df.columns)
data = ensemble_box_and_whiskers(pd.DataFrame(), nv_district_df)
pprint(data.columns)