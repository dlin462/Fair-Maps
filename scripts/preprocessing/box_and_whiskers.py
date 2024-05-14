from typing import List, Tuple, Dict

import matplotlib.pyplot as plt
import pandas as pd
from pprint import pprint
from gerrychain import Partition
import numpy as np
import os

# from scripts.preprocessing.send_to_database import *

PLOTDIR = 'plots/'


def ensemble_box_and_whiskers(race_data: List[List],
                              initial_partition: Partition,
                              state: str,
                              ) -> List[List[Dict]]:
    list_race_df = []
    groups = ['Asian', 'White', 'Black', 'Hispanic']
    partition_pop_attr = ['asianvap', 'wvap', 'bvap', 'hvap']
    race_jsons = []
    for race in race_data:
        print(np.array(race))
        list_race_df.append(pd.DataFrame(race))

    for group, pop_attr, df in zip(groups, partition_pop_attr, list_race_df):
        initial_plan = sorted(initial_partition[pop_attr].values())

        result_data = []
        for col in df.columns:
            district_info = {
                'districtId': col,
                'data': df[col].tolist(),
                'state': state,
                'race': group,
                'enacted': initial_plan[col],
            }
            result_data.append(district_info)

        race_jsons.append(result_data)

        # ax = df.boxplot(positions=range(len(df.columns)))
        # plt.plot(df.iloc[0], "ro")
        # plt.title(f'Box & Whiskers Analysis for {group} in {state}', fontsize=28)
        # plt.ylabel('Population', fontsize=24)
        # plt.xlabel('Districts', fontsize=24)
        # plt.show()
        # plt.savefig(PLOTDIR + "BoxWhisker" + group + ".png")
        # plt.close()
    print(len(race_jsons))
    for jsons in race_jsons:
        group, state = '', ''
        plot_data = [json['data'] for json in jsons]
        plt.figure(figsize=(16, 12))
        boxplot = plt.boxplot(plot_data)
        for i, json in enumerate(jsons):
            group = json['race']
            state = json['state']
            plt.plot(i + 1, json['enacted'], 'ro')

        plt.title(f'Box & Whiskers Analysis for {group} in {state}', fontsize=24)
        plt.ylabel('Population', fontsize=16)
        plt.xlabel('Districts', fontsize=16)
        plt.show()

    return race_jsons


def calculate_opportunity_districts(race_pop_ensembles: List[List],
                                    pop_data: List,
                                    state: str,
                                    initial_partition: Partition,
                                    ) -> List[Dict]:
    '''
    Finds the Number of Opportunity Districts for each group in each Ensemble
    group_ensembles - (Ensembles)-by-(District)-by-(Group)
    Returns
    -------

    '''
    pop_matrix = np.array(pop_data)
    # print(f'pop_matrix: {pop_matrix}\n Shape: {pop_matrix.shape}')
    ideal_pop = (sum(initial_partition["population"].values())
                 / len(initial_partition["population"]))
    thresholds = [.37, .5, .6]
    groups = ['Asian', 'White', 'Black', 'Hispanic']
    partition_pop_attr = ['asianvap', 'wvap', 'bvap', 'hvap']
    threshold_names = ['firstThreshold', 'secondThreshold', 'thirdThreshold']
    opportunity_districts_data = []

    group_locations = np.arange(len(groups))
    bar_width = 0.2  # Width of the bars
    fig, ax = plt.subplots()

    for i, (group, race, pop_attr) in enumerate(zip(groups, race_pop_ensembles, partition_pop_attr)):
        ensemble_data = {}
        initial_plan_by_race = np.asarray(
            [value for _, value in sorted(initial_partition[pop_attr].items())])
        cur_opportunity_districts = initial_plan_by_race / ideal_pop
        cur_total_opp_districts = np.sum(cur_opportunity_districts)
        ensemble_data['state'] = state
        ensemble_data['race'] = group
        ensemble_data['racePop'] = np.sum(initial_plan_by_race).astype(float)
        ensemble_data['idealPop'] = ideal_pop
        ensemble_data['enactedOpp'] = cur_total_opp_districts

        ax.bar(group_locations[i] - bar_width/2, cur_total_opp_districts, bar_width, label='Enacted' if i == 0 else "")

        race_matrix = np.array(race)
        pct_pop = race_matrix / pop_matrix

        for j, (name, threshold) in enumerate(zip(threshold_names, thresholds)):
            threshold_data = {}
            opportunity_district_by_threshold = np.sum(pct_pop > threshold, axis=1)
            # print(f'opportunity_district_by_threshold {threshold}: '
            #       f'{opportunity_district_by_threshold}\nShape: '
            #       f'{opportunity_district_by_threshold.shape}')
            # plt.hist(opportunity_district_by_threshold, bins=50, color='blue')
            opp_avg = opportunity_district_by_threshold.mean()
            opp_max = opportunity_district_by_threshold.max()

            ax.bar(group_locations[i] + j * bar_width + bar_width / 2, opp_avg.astype(float), bar_width,
                   label=name if i == 0 else "")

            threshold_data['ensembleOpp'] = opportunity_district_by_threshold.tolist()
            threshold_data['ensembleAvg'] = opp_avg.astype(float)
            threshold_data['ensembleMax'] = opp_max.astype(float)
            ensemble_data[name] = threshold_data
        opportunity_districts_data.append(ensemble_data)

    ax.set_xlabel('Race')
    ax.set_ylabel('Opportunity Districts')
    ax.set_title(f'Opportunity Districts by Race in {state}', fontsize=16)
    ax.set_xticks(group_locations + bar_width)
    ax.set_xticklabels(groups)
    ax.legend()
    plt.show()

    print(opportunity_districts_data)
    return opportunity_districts_data


def calculate_cur_opportunity_districts(orig_data: pd.DataFrame) -> pd.DataFrame:
    '''
    Determine all opportunity districts in the current plan for each race
    Returns
    -------
    DataFrame of the Number of Opportunity Districts in the Enacted District Plan
    '''
    cur_opportunity_districts = pd.DataFrame(columns=['whiteOpp', 'asianOpp',
                                                      'blackOpp', 'hispanicOpp', ])

    cur_opportunity_districts.loc[0, 'whiteOpp'] = (orig_data['pct_wvap'] > 0.5).sum()
    cur_opportunity_districts.loc[0, 'asianOpp'] = (orig_data['pct_asianvap'] > 0.5).sum()
    cur_opportunity_districts.loc[0, 'blackOpp'] = (orig_data['pct_bvap'] > 0.5).sum()
    cur_opportunity_districts.loc[0, 'hispanicOpp'] = (orig_data['pct_hvap'] > 0.5).sum()

    return cur_opportunity_districts


def calculate_max_opportunitiy_districts(group_pop, ideal_district_pop) -> pd.DataFrame:
    '''
    Determines the Maximum possible opprtunity districts for each race by dividing
    the total population for each race by the ideal district population multiplied by
    twice the number of opportunity districts for each race.
    Parameters
    ----------
    group_pop
    ideal_district_pop

    Returns
    -------

    '''
    opportunity_districts = group_pop // ideal_district_pop
    opportunity_districts *= 2
    max_opportunity_districts = pd.DataFrame(opportunity_districts,
                                             columns=[])
    return max_opportunity_districts


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
                                            'districtOrder', 'ensemblesClustered'])
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


if __name__ == '__main__':
    current_directory = os.getcwd()
    move_up = os.path.dirname(os.path.dirname(os.path.dirname(current_directory)))
    data_dir = os.path.join(move_up, 'Data')
    new_path = os.chdir(data_dir)
    nv_district_df = pd.read_csv('NV/nv_district_final_data.csv')
    calculate_cur_opportunity_districts(nv_district_df)
    ms_district_df = pd.read_csv('MS/ms_district_final_data.csv')
    pprint(nv_district_df.columns)
    # data = ensemble_box_and_whiskers(pd.DataFrame(), nv_district_df)
    # pprint(data.columns)
