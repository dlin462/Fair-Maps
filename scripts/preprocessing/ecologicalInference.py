import pandas as pd
import numpy as np
# import pymc as pm

from pyei.data import Datasets
from pyei.two_by_two import TwoByTwoEI
from pyei.r_by_c import RowByColumnEI

from pyei.plot_utils import tomography_plot
from pyei.plot_utils import plot_precinct_scatterplot

from pprint import pprint
import os

def read_data(data) -> pd.DataFrame:
    # Load the data
    data = data.load_data('test_data')

    return data

def fit_two_by_two_EI(group_fraction_2by2: pd.DataFrame,
                      votes_fraction_2by2,
                      precinct_pops,
                      demographic_group_name_2by2,
                      candidate_name_2by2,
                      precinct_names,
                      ei_2by2) -> None:
    # Fit the model
    ei_2by2.fit(group_fraction_2by2, 
       votes_fraction_2by2, 
       precinct_pops, 
       demographic_group_name=demographic_group_name_2by2, 
       candidate_name=candidate_name_2by2, 
       precinct_names=precinct_names, 
    )

    # Print the results
    print(ei_2by2.results)

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

def kdes_plots(data):
    pass
    # Create the EI object
    # ei = plot_kdes(data)

    # Plot the KDEs
    # ei.plot_kdes()

    # return ei
    

def main():
    # Load the data
    nv_precinct_data = pd.read_csv('nv_eco_infer.csv')

    # Create a TwobyTwoEI object
    ei_2by2 = TwoByTwoEI(model_name="king99_pareto_modification", pareto_scale=8, pareto_shape=2)

    group_fraction_2by2 = np.array(nv_precinct_data["pct_asn"])
    votes_fraction_2by2 = np.array(nv_precinct_data["pct_dem"])
    demographic_group_name_2by2 = "Asian"
    candidate_name_2by2 = "Democratic"

    # Data we'll use in both 2x2 and rbyc
    precinct_pops = np.array(nv_precinct_data["total2"])
    precinct_names = nv_precinct_data['precinct']

    fit_two_by_two_EI(group_fraction_2by2,
                      votes_fraction_2by2,
                      precinct_pops,
                      demographic_group_name_2by2,
                      candidate_name_2by2,
                      precinct_names,
                      ei_2by2)
    
    ei_2by2.plot() # Summary plot 

if __name__ == '__main__':
    current_directory = os.getcwd()
    new_path = os.chdir(os.path.join(os.path.join(current_directory, 'client'), 'public'))
    pprint(os.getcwd())

    main()

    # Create a RowByColumnEI object
    # ei_rbyc = RowByColumnEI(model_name='multinomial-dirichlet-modified', pareto_shape=100, pareto_scale=100)


    # Print the results

    # Plot the results


    # GUI 19 - Select Election + Select Race
    # 3 Elections?? -> 12 Plots

    # TwoByTwoEI - POLARIZED ecological inference
    # Compare 2020 Presidential Election results of Preclearance and Non-Preclearance states
    # Race/Complement vs Candidate/Complement

    # plot_kdes - KDE plot
    # All races vs All Candidates

    # plot_polarization_kde - Polarized KDEs

    # precinct_level_plot - Precinct level plot 