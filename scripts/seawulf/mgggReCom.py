import pandas as pd
from gerrychain import (Partition, Graph, MarkovChain,
                        updaters, constraints, accept,
                        Election, GeographicPartition)
from gerrychain.constraints import (single_flip_contiguous,
                                    within_percent_of_ideal_population,
                                    contiguity)
from gerrychain.graph import (intersections_with_neighbors,
                              geo, adjacency)
from gerrychain.tree import (recursive_tree_part, bipartition_tree,
                             bipartition_tree_random)
from gerrychain.proposals import propose_random_flip
from gerrychain.accept import always_accept
from gerrychain.updaters import Tally, cut_edges
from gerrychain.proposals import recom
from gerrychain.constraints import contiguous, contiguous_bfs
from functools import partial
import matplotlib.pyplot as plt
from scripts.preprocessing.box_and_whiskers import *
from multiprocessing import Pool
import networkx as nx
import pandas
from pprint import pprint
import geopandas as gpd
import random
from itertools import combinations, groupby
from typing import List, Union, Optional, Dict
import os
from multiprocessing.pool import Pool
from multiprocessing import Process
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import concurrent.futures
import math
import time

from networkx import number_connected_components

# from new_seeds import recrsive_tree_part


# Set seed for Reproducibility
random.seed(123)

### CONSTANTS ###
NUM_OF_PROCESSORS: int = 4

NV_ELECTIONS: List[Election] = [
    Election('PRE20', {'Dem': 'PRE20D', 'Rep': 'PRE20R'}),
    Election('USS', {'Dem': 'USS22D', 'Rep': 'USS22R'})
]
MS_ELECTIONS: List[Election] = [
    Election('PRE20', {'Dem': 'PRE20D', 'Rep': 'PRE20R'}),
    Election('USS', {'Dem': 'USS20D', 'Rep': 'USS20R'})
]

DIR = 'outputs/'


### FUNCTIONS ###

def connect_graph(G):
    components = dict(enumerate((G.subgraph(c).copy() for c in nx.connected_components(G))))
    components_combs = combinations(components.keys(), r=2)
    for _, node_edges in groupby(components_combs, key=lambda x: x[0]):
        node_edges = list(node_edges)
        print(node_edges)
        random_comps = random.choice(node_edges)
        source = random.choice(list(components[random_comps[0]]))
        target = random.choice(list(components[random_comps[1]]))
        G.add_edge(source, target)


def make_contiguous(G):
    """Make a graph contiguous by adding edges between connected components."""

    # Get connected components as subgraphs
    components = (G.subgraph(c).copy() for c in nx.connected_components(G))

    # Connect the components
    for component in components:
        first_component = component
        if first_component is None:
            first_component = component
            print('Inside')
            continue
        print(component)
        # Connect each component to the first component
        node1 = min(component.nodes())  # Pick any node from component
        node2 = min(first_component.nodes())  # Pick any node from first component
        G.add_edge(node1, node2)

    return G


def find_precinct_neighbors(graph):
    for k, v in graph.adjacency():
        print(k, v)


def create_initial_seed(graph: Graph,
                        number_districts: int,
                        ideal_population: Union[int, float],
                        population_column: str,
                        epsilon: float,
                        repeats: int = 1,
                        new_method: Optional[partial] = partial(
                            bipartition_tree,
                            max_attempts=10000
                        )
                        ) -> Dict:
    new_plan_seed = recursive_tree_part(
        graph,
        parts=range(number_districts),
        pop_target=ideal_population,
        pop_col=population_column,
        epsilon=epsilon,
        node_repeats=repeats,
        method=new_method
    )
    return new_plan_seed


def create_updaters(data: pd.DataFrame, election_updaters: Dict):
    my_updaters = {
        "population": updaters.Tally("vap", alias="population"),
        "cut_edges": updaters.cut_edges
    }
    for col in data.columns:
        my_updaters[col] = updaters.Tally(col, alias=col)

    my_updaters.update(election_updaters)
    return my_updaters


def create_initial_partition(graph: Graph,
                             seed: Union[str, Dict],
                             updaters
                             ) -> Partition:
    initial_partition = Partition(
        graph,
        assignment=seed,
        updaters=updaters
    )
    return initial_partition


def create_proposal(
        ideal_population: Union[int, float],
        epsilon: Optional[float] = 0.01,
) -> partial:
    proposal = partial(
        recom,
        pop_col='vap',
        pop_target=ideal_population,
        epsilon=epsilon,
        node_repeats=2,
        method=bipartition_tree_random
    )

    # neutral_proposal = partial(
    #     recom,
    #     pop_col="vap",
    #     pop_target=nv_ideal_population,
    #     epsilon=0.01,
    #     node_repeats=1,
    #     method=partial(
    #         bipartition_tree,
    #         cut_choice=random.choice,
    #         allow_pair_reselection=True
    #     )
    # )
    return proposal


def create_constraints(partition,
                       epsilon: Optional[float] = 0.01,
                       ):
    constraints = []
    pop_constraint = within_percent_of_ideal_population(partition, epsilon)

    constraints.append(pop_constraint)
    constraints.append(single_flip_contiguous)
    return constraints


def number_of_opportunity_districts(partition: Partition):
    opportunity_districts = 0
    for district, population in partition['vap'].items():
        pass


def run_markov_chain(data: gpd.GeoDataFrame,
                     steps: Optional[int] = 250, ):
    start_time_total = time.time()

    graph = Graph.from_geodataframe(data)
    initial_partition = Partition(
        graph=graph,
        assignment='districtNum',
        updaters={
            "population": updaters.Tally("vap", alias="population"),
        }
    )

    ideal_population = (sum(initial_partition["population"].values())
                        / len(initial_partition["population"]))
    pprint(ideal_population)

    state_name = data['state'][0]
    race_vaps = ['wvap', 'asianvap', 'bvap', 'hvap']

    method = partial(
        bipartition_tree_random,
        max_attempts=10000
    )
    elections = NV_ELECTIONS
    epsilon = 0.02
    repeats = 1
    if state_name == 'Mississippi':
        elections = MS_ELECTIONS
        epsilon = 0.1
        repeats = 6
        method = partial(
            bipartition_tree_random,
            max_attempts=20000
        )
    balanced_pop_seed = create_initial_seed(graph,
                                            len(initial_partition.parts),
                                            ideal_population,
                                            population_column='vap',
                                            epsilon=epsilon,
                                            repeats=repeats,
                                            new_method=method)
    election_updaters = {election.name: election for election in elections}
    my_updaters = create_updaters(data[race_vaps],
                                  election_updaters)
    neutral_partition = create_initial_partition(graph,
                                                 balanced_pop_seed,
                                                 my_updaters)
    recom_proposal = create_proposal(ideal_population,
                                     epsilon)
    chain_constraints = create_constraints(neutral_partition,
                                           epsilon)

    recom_chain = MarkovChain(
        proposal=recom_proposal,
        constraints=chain_constraints,
        accept=accept.always_accept,
        initial_state=neutral_partition,
        total_steps=steps
    )

    district_plans = pd.DataFrame(columns=[''])

    thresholds = [.37, .5, .6]
    asian_box, white_box, black_box, hispanic_box = [], [], [], []
    pop_ensembles, asian_pops, white_pops = [], [], []
    black_pops, hisp_pops = [], []
    # asian_
    pres_dem, pres_rep = [], []

    for idx, partition in enumerate(recom_chain.with_progress_bar()):
        # Box & Whisker Data
        asian_box.append(sorted(partition['asianvap'].values()))
        white_box.append(sorted(partition['wvap'].values()))
        black_box.append(sorted(partition['bvap'].values()))
        hispanic_box.append(sorted(partition['hvap'].values()))

        # Opportunity Districts Data
        pop_ensembles.append([value for _, value in sorted(partition['population'].items())])
        asian_pops.append([value for _, value in sorted(partition['asianvap'].items())])
        white_pops.append([value for _, value in sorted(partition['wvap'].items())])
        black_pops.append([value for _, value in sorted(partition['bvap'].items())])
        hisp_pops.append([value for _, value in sorted(partition['hvap'].items())])

        # Election Winners
        # print(f'Dem: {partition["PRE20"].totals}')
        pres_dem.append(partition['PRE20'].wins('Dem'))
        pres_rep.append(partition['PRE20'].wins('Rep'))

        if idx % 50 == 0 and idx:
            # print(partition['PRE20'].wins('Rep'))
            # print(partition['PRE20'].wins('Dem'))
            # print(partition['PRE20'].percent('Dem'))

            # Saving Current Ensemble Map
            data["plot" + str(idx)] = data.index.map(partition.assignment)
            data.plot(column="plot" + str(idx), cmap="tab20")
            plt.savefig(PLOTDIR + f"{state_name}plot{idx}" + ".png")
            plt.close()

        if idx % 200 == 0 and idx:
            # Saving Current Ensemble Map
            data["plot" + str(idx)] = data.index.map(partition.assignment)
            data.plot(column="plot" + str(idx), cmap="tab20")
            plt.savefig(PLOTDIR + f"{state_name}plotLargeSample{idx}" + ".png")
            plt.close()

    # Box and Whisker
    group_pop_data = [asian_box, white_box, black_box, hispanic_box]
    box_whiskers_groups = ensemble_box_and_whiskers(group_pop_data,
                                                    initial_partition,
                                                    state_name)

    # Calculate Opportunity Districts
    ensemble_group_pops = [asian_pops, white_pops, black_pops, hispanic_box]
    opportunity_districts_groups = calculate_opportunity_districts(ensemble_group_pops,
                                    pop_ensembles,
                                    state_name,
                                    initial_partition,)


    print("--- %s TOTAL seconds ---" % (time.time() - start_time_total))
    return opportunity_districts_groups, box_whiskers_groups

if __name__ == "__main__":
    current_directory = os.getcwd()
    move_up = os.path.dirname(os.path.dirname(os.path.dirname(current_directory)))
    data_dir = os.path.join(move_up, 'Data')
    new_path = os.chdir(data_dir)
    print(os.getcwd())

    # with concurrent.futures.ProcessPoolExecutor() as executor:
    #     for number, prime in zip(PRIMES, executor.map(is_prime, PRIMES)):
    #         print('%d is prime: %s' % (number, prime))
    """
    ReCom on MGGG's MS shapefile
    """
    # nv_recom_chain = MarkovChain(
    #     proposal=nv_proposal,
    #     constraints=[contiguous],
    #     accept=accept.always_accept,
    #     initial_state=initial_partition_nv,
    #     total_steps=100
    # )

    # NEVADA

    nv_graph = Graph.from_file("NV/nv_precinct_final_data.shp")
    nv_precinct = gpd.read_file("NV/nv_precinct_final_data.shp")
    ms_precinct = gpd.read_file("MS/ms_precinct_final_data.shp")
    # nv_graph_1 = Graph.from_file('NV Data/nv_vest_20/nv_vest_20.shp')
    # pprint(nv_precinct.columns)

    ### Nevada ###
    nv_precinct.rename(columns={'districtNu': 'districtNum'}, inplace=True)
    # Small Ensemble
    run_markov_chain(nv_precinct,
                     steps=250)
    # Large Ensemble
    # run_markov_chain(nv_precinct,
    #                  steps=5000)

    ### Mississippi ###
    # Small Ensemble
    # run_markov_chain(nv_precinct,
    #                  steps=250)
    # Large Ensemble
    # run_markov_chain(nv_precinct,
    #                  steps=5000)
    # print(geo.explain_validity(nv_precinct.geometry))
    # info = geo.explain_validity(nv_precinct.geometry)
    # for idx, info in enumerate(info):
    #     if info == 'Invalid Geometry':
    #         print(idx, info)
    # pprint(nv_graph.islands)

    # for item in intersections_with_neighbors(nv_precinct.geometry):
    #     pprint(item)
    # number_districts = 18
    # population_column = "vap"
    # tolerance = .01
    # new_seed = recursive_tree_part(graph, number_districts, population_column, tolerance, 1)
    # df["new_seed"] = df[id_col].map(new_seed)
    # print(df.groupby(["new_seed"])[population_column].agg(’sum’))

    # nv_diff_graph = Graph.from_file('nv_hole.shp')
    initial_assignment_nv = "INITIAL DISTRICT PLAN"

    # initial_partition_nv = Partition(
    #     graph=,
    #     updaters={
    #         "population": updaters.Tally("TOTPOP", alias="population"),
    #         "cut_edges": updaters.cut_edges
    #     },
    #     assignment={}
    # )
    # for node, adj in nv_graph.nodes:
    #     print(node, adj)

    # initial_partition_nv = Partition(
    #     graph=nv_graph,
    #     assignment='districtNu',
    #     updaters={
    #         "population": Tally("vap", alias="population"),
    #         "cut_edges": cut_edges
    #     }
    # )

    # initial_partition_nv.plot()
    # plt.show()

    # print(contiguous(initial_partition_nv))

    # This should be 8 since each district has 1 person in it.
    # Note that the key "population" corresponds to the population updater
    # that we defined above and not with the population column in the json file.
    # ideal_pop_nv = sum(initial_partition_nv["population"].values()) / len(initial_partition_nv)
    # pprint(ideal_pop_nv)
    #
    # nv_proposal = partial(
    #     recom,
    #     pop_col="vap",
    #     pop_target=ideal_pop_nv,
    #     epsilon=0.01,
    #     node_repeats=2,
    #     # region_surcharge={"muni": 1.0},
    #     method=partial(
    #         bipartition_tree,
    #         cut_choice=random.choice,
    #     )
    # )

    # nv_recom_chain = MarkovChain(
    #     proposal=nv_proposal,
    #     constraints=[single_flip_contiguous],
    #     accept=always_accept,
    #     initial_state=initial_partition_nv,
    #     total_steps=1000
    # )

    # for idx in range(initial_partition_nv.graph.number_of_nodes()):
    #     pprint(initial_partition_nv.graph.nodes[idx])
    #
    # for district, pop in initial_partition_nv["population"].items():
    #     print(f"District {district}: {pop}")
    # ideal_pop_nv = [node['TOTPOP'] for node in nv_graph.nodes].mean()
    #
    # nv_proposal = partial(
    #     recom,
    #     pop_col="TOTPOP",
    #     pop_target=ideal_pop_nv,
    #     epsilon=0.01,
    #     node_repeats=1,
    #     method=partial(
    #         bipartition_tree,
    #         max_attempts=100
    #     )
    # )

    # ms_graph = Graph.from_file("MS/ms_graph.shp")
    # ideal_pop_ms = [ms_graph.nodes[node]['TOTPOP'] for node in ms_graph.nodes].mean()

    """
    ReCom on MGGG NV
    """
    #
    # with multiprocessing.Pool(NUM_OF_PROCESSORS) as pool:
    #     results = pool.map(run_nv_chain, [nv_recom_chain])

    """
    ReCom on MGGG MS
    """
    ms_graph = Graph.from_file("MS/ms_precinct_final_data.shp")
    dummy_graph = Graph.from_file("MS/ms_precinct_final_data.shp")
    # for i in dummy_graph:
    #     pprint(i)
    # pprint(number_connected_components(dummy_graph))
    # pprint(len(ms_graph))
    # pprint(number_connected_components(ms_graph))

    connect_graph(dummy_graph)

    partition_ms = Partition(
        graph=dummy_graph,
        assignment='distrctNum',
        updaters={
            "population": Tally("vap", alias="population"),
        }
    )

    # for node in partition_ms.graph.nodes():
    #     for k, v in partition_ms.assignment.items():
    #         print(k, v)
    # pprint(partition_ms.graph.)

    pprint(contiguous(partition_ms))

    initial_partition_ms = GeographicPartition(
        graph=ms_graph,
        assignment='distrctNum',
        updaters={
            "population": Tally("vap", alias="population")
        }
    )

    # for part in initial_partition_ms.parts:
    #     number_of_nodes = len(initial_partition_ms.parts[part])
    #     print(f"Part {part} has {number_of_nodes} nodes")
    # popbound = within_percent_of_ideal_population(initial_partition_ms, 0.1)
    ideal_pop_ms = sum(initial_partition_ms["population"].values()) / len(initial_partition_ms)
    # pprint(ideal_pop_ms)
    # pprint(initial_partition_ms)
    # print(contiguous(initial_partition_ms))

    # ms_proposal = partial(
    #     recom,
    #     pop_col="vap",
    #     pop_target=ideal_pop_ms,
    #     epsilon=0.01,
    #     node_repeats=2,
    #     # region_surcharge={"muni": 1.0},
    #     method=partial(
    #         bipartition_tree,
    #         cut_choice=random.choice,
    #     )
    # )
    # contiguity.number_of_contiguous_parts()
    # initial_partition_ms.plot()
    # plt.show()
    # pprint(contiguous_bfs(initial_partition_ms))
    # pprint(ms_graph.islands)
    # ms_recom_chain = MarkovChain(
    #     proposal=ms_proposal,
    #     constraints=[contiguous],
    #     accept=accept.always_accept,
    #     initial_state=initial_partition_ms,
    #     total_steps=1000
    # )
