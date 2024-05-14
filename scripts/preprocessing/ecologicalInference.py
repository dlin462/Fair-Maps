from typing import Tuple

import matplotlib.pyplot as plt
from pyei.plot_utils import plot_precinct_scatterplot
from pyei.plot_utils import tomography_plot
from pyei.two_by_two import TwoByTwoEI
from pyei.r_by_c import RowByColumnEI
from pyei.data import Datasets
from pprint import pprint
# import pymc as pm
import pandas as pd
import numpy as np
import re
import os


PLOTDIR = 'plots/ecologicalInference/'

def read_data(data) -> pd.DataFrame:
    # Load the data
    data = data.load_data('test_data')

    return data


def fit_two_by_two_EI(group_fraction_2by2: np.ndarray,
                      votes_fraction_2by2: np.ndarray,
                      precinct_pops: np.ndarray,
                      demographic_group_name_2by2: str,
                      candidate_name_2by2: str,
                      precinct_names: np.ndarray,
                      ) -> TwoByTwoEI:
    ei_2by2 = TwoByTwoEI(model_name="king99_pareto_modification", pareto_scale=8, pareto_shape=2)

    # Fit the model
    ei_2by2.fit(group_fraction_2by2,
                votes_fraction_2by2,
                precinct_pops,
                demographic_group_name=demographic_group_name_2by2,
                candidate_name=candidate_name_2by2,
                precinct_names=precinct_names,
                )

    return ei_2by2


def precinct_level_posterior(posterior_matrices: list) -> list:
    '''
    Provides the Posterior distribution on the precinct level, used for Choropleth
    Map
    Returns
    -------
    List of Posterior Mean for each precinct for given group
    '''
    posterior_means = []
    for precinct_matrix in posterior_matrices:
        posterior_means.append(precinct_matrix[0][0])
    return posterior_means


def calculate_ei_kdes_data(
        target_group_behavior: np.ndarray,
        complement_group_behavior: np.ndarray
) -> Tuple[np.ndarray, list]:
    polarization = target_group_behavior - complement_group_behavior
    confidence_intervals = [
        np.percentile(polarization, 5),
        np.percentile(polarization, 95)
    ]
    return polarization, confidence_intervals


def save_precinct_choropleth_map(orig_data: pd.DataFrame,
                                 precinct_level_posterior: list,
                                 state: str,
                                 candidate: str,
                                 race: str) -> None:
    color_map = ''
    if candidate in ['Biden', 'Cortez', 'Espy']:
        color_map = 'GnBu'
    if candidate in ['Trump', 'Laxalt', 'Hyde']:
        color_map = 'OrRd'
    orig_data[f'{race}_support_{candidate}'] = precinct_level_posterior
    ax = orig_data.plot(
        column=f'{race}_support_{candidate}',
        scheme="JenksCaspall",
        k=5,
        legend=True,
        cmap=color_map,
        figsize=(12, 8),
        edgecolor="black",
        linewidth=0.4,
        categorical=True,
        legend_kwds={
            "loc": "lower left",
            "fmt": '{:.4f}',
            "fontsize": 11,
        },
    )
    ax.set_axis_off()
    ax.set_title(f'{race} Support for {candidate}', fontweight="bold")
    plt.savefig(PLOTDIR + f'choropleth_{state}_{race}_{candidate}.png')



def run_ecological_inference(data) -> pd.DataFrame:
    '''

    Parameters
    ----------
    data

    Returns
    -------
    Dataframe containing ecological inference results for all combinations of
    candidate and demographic using the ei_2by2 model from PYEI

    Columns - 'State', 'Election', 'Race', 'Precinct Names', 'Candidate', 'Race
    Samples', 'Complement Samples', 'Precinct Demographic Group labels for
    Choropleth Map'
    '''
    state_name = data['state'][0]
    eco_infer_df = pd.DataFrame(columns=['state', 'electionType', 'race', 'uniqueId',
                                         'candidate', 'raceData', 'complementData',
                                         'precinctChoropleth', 'kdePolar',
                                         'confidInterval'])

    candidates = ['Biden', 'Trump']
    if state_name == 'Nevada':
        candidates += ['Cortez', 'Laxalt']
    if state_name == 'Mississippi':
        candidates += ['Espy', 'Hyde']

    demographic_groups = ['White', 'Asian', 'Black', 'Hispanic']
    pct_races = ['pct_wvap', 'pct_bvap', 'pct_asianvap', 'pct_hvap']
    row_counter = 0
    for candidate in candidates:
        for race_pct in pct_races:
            race_vap = re.sub(r'pct_', '', race_pct)
            candidate_col_data = f'pct_{candidate[:3].lower()}'
            race: str = race_vap
            election_type: str
            if race_vap == 'wvap':
                race = 'White'
                eco_infer_df.loc[row_counter, ['race']] = race
            if race_vap == 'bvap':
                race = 'Black'
                eco_infer_df.loc[row_counter, ['race']] = race
            if race_vap == 'hvap':
                race = 'Hispanic'
                eco_infer_df.loc[row_counter, ['race']] = race
            if race_vap == 'asianvap':
                race = 'Asian'
                eco_infer_df.loc[row_counter, ['race']] = race

            if candidate == 'Biden' or candidate == 'Trump':
                election_type = 'President'
            else:
                election_type = 'USS'

            # Fit EI Data
            group_frac = np.array(data[race_pct])
            votes_frac = np.array(data[candidate_col_data])
            demographic_group_name = race

            # Data we'll use in both 2x2
            precinct_pops = np.array(data["vap"])
            precinct_names = np.array(data['uniqueId'])

            ei_model_2by2 = fit_two_by_two_EI(
                group_fraction_2by2=group_frac,
                votes_fraction_2by2=votes_frac,
                precinct_pops=precinct_pops,
                demographic_group_name_2by2=demographic_group_name,
                candidate_name_2by2=candidate,
                precinct_names=precinct_names,
            )

            ei_model_2by2.calculate_sampled_voting_prefs()
            target_group_behavior, complement_group_behavior = (
                ei_model_2by2.sampled_voting_prefs)
            precinct_posterior_matrices, _ = ei_model_2by2.precinct_level_estimates()
            precinct_posteriors_list = precinct_level_posterior(
                precinct_posterior_matrices
            )
            polarization, confidence_intervals = calculate_ei_kdes_data(
                target_group_behavior,
                complement_group_behavior
            )


            list_variables = ['uniqueId', 'raceData',
                              'complementData', 'precinctChoropleth']
            metadata_variables = ['electionType', 'race', 'candidate']
            kde_variables = ['kdePolar', 'confidInterval']

            eco_infer_df.loc[row_counter, list_variables] = [
                precinct_names.tolist(),
                list(target_group_behavior),
                list(complement_group_behavior),
                list(precinct_posteriors_list)
            ]
            eco_infer_df.loc[row_counter, metadata_variables] = [
                election_type,
                race,
                candidate
            ]

            eco_infer_df.loc[row_counter, kde_variables] = [
                polarization.tolist(),
                confidence_intervals
            ]

            save_precinct_choropleth_map(data,
                                         precinct_posteriors_list,
                                         state_name,
                                         candidate,
                                         race)

            row_counter += 1
            print('Loading... ')
            print(f'{row_counter}/{len(candidates) * len(pct_races)} Ecological Inference\'s Completed')

    eco_infer_df['state'] = state_name
    return eco_infer_df


def fit_row_by_column_EI(group_fractions_rbyc: pd.DataFrame,
                         votes_fractions_rbyc,
                         precinct_pops,
                         demographic_group_names_rbyc,
                         candidate_names_rbyc,
                         ei_rbyc) -> None:
    # Fit the model
    ei_rbyc.fit(group_fractions_rbyc,
                votes_fractions_rbyc,
                precinct_pops,
                demographic_group_names=demographic_group_names_rbyc,
                candidate_names=candidate_names_rbyc,
                # precinct_names=precinct_names,
                )


def run_ei_rbyc():
    # Example rxc data (here r=c=3)
    group_fractions_rbyc = np.array(
        santa_clara_data[['pct_ind_vote', 'pct_e_asian_vote', 'pct_non_asian_vote']]).T
    votes_fractions_rbyc = np.array(
        santa_clara_data[['pct_for_hardy2', 'pct_for_kolstad2', 'pct_for_nadeem2']]).T

    candidate_names_rbyc = ["Hardy", "Kolstad", "Nadeem"]
    demographic_group_names_rbyc = ["ind", "e_asian", "non_asian"]


if __name__ == '__main__':
    current_directory = os.getcwd()
    move_up = os.path.dirname(os.path.dirname(os.path.dirname(current_directory)))
    data_dir = os.path.join(move_up, 'Data')
    new_path = os.chdir(data_dir)

    nv_precinct_df = pd.read_csv('NV/nv_precinct_final_data.csv')
    ms_precinct_df = pd.read_csv('MS/ms_precinct_final_data.csv')

    # # Load the data
    # nv_precinct_data = pd.read_csv('NV Data/nv_eco_infer.csv')

    # Create a TwobyTwoEI object
    ei_2by2 = TwoByTwoEI(model_name="king99_pareto_modification", pareto_scale=8, pareto_shape=2)
    # pprint(nv_precinct_data.columns)
    pprint(nv_precinct_df.columns)
    pprint(ms_precinct_df.columns)

    group_fraction_2by2 = np.array(nv_precinct_df["pct_asianvap"])
    votes_fraction_2by2 = np.array(nv_precinct_df["pct_bid"])
    demographic_group_name_2by2 = "Asian"
    candidate_name_2by2 = "Biden"

    # Data we'll use in both 2x2 and rbyc
    precinct_pops = np.array(nv_precinct_df["vap"])
    precinct_names = nv_precinct_df['uniqueId']
    #
    # fit_two_by_two_EI(group_fraction_2by2=group_fraction_2by2,
    #                   votes_fraction_2by2=votes_fraction_2by2,
    #                   precinct_pops=precinct_pops,
    #                   demographic_group_name_2by2=demographic_group_name_2by2,
    #                   candidate_name_2by2=candidate_name_2by2,
    #                   precinct_names=precinct_names,
    #                   ei_2by2=ei_2by2)

    # ei_2by2.plot()  # Summary plot
    #
    # ei_2by2.precinct_level_plot()
    # pprint(ei_2by2.summary())
    # pprint(ei_2by2._voting_prefs_array())

    races = ['White', 'Black', 'Hispanic', 'Asian']
    nv_candidates = ['Biden', 'Trump', 'Laxalt', 'Cortez']
    ms_candidates = ['Biden', 'Trump', 'Espy', 'Hyde']

    # run_ecological_inference(nv_precinct_df)

    # Create a RowByColumnEI object
    # ei_rbyc = RowByColumnEI(model_name='multinomial-dirichlet-modified', pareto_shape=100, pareto_scale=100)

    # GUI 19 - Select Election + Select Race
    # 3 Elections?? -> 12 Plots

    # TwoByTwoEI - POLARIZED ecological inference
    # Compare 2020 Presidential Election results of Preclearance and Non-Preclearance states
    # Race/Complement vs Candidate/Complement

    # plot_kdes - KDE plot
    # All races vs All Candidates

    # plot_polarization_kde - Polarized KDEs

    # precinct_level_plot - Precinct level plot
