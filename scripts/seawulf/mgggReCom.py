from gerrychain import (Partition, Graph, MarkovChain,
                        updaters, constraints, accept,
                        Election, GeographicPartition)
from gerrychain.constraints import single_flip_contiguous
from gerrychain.graph import intersections_with_neighbors
from gerrychain.proposals import propose_random_flip
from gerrychain.accept import always_accept
from gerrychain.updaters import Tally, cut_edges
from gerrychain.proposals import recom
from gerrychain.constraints import contiguous, contiguous_bfs
from gerrychain.tree import recursive_tree_part, bipartition_tree
from functools import partial
import matplotlib.pyplot as plt
from multiprocessing import Pool
import networkx as nx
import pandas
from pprint import pprint
import geopandas as gpd
import random
from itertools import combinations, groupby
from typing import List
import os

from networkx import number_connected_components

# from new_seeds import recrsive_tree_part


# Set seed for Reproducibility
random.seed(123)

### CONSTANTS ###
NUM_OF_PROCESSORS: int = 4

# NV_ELECTIONS: List[Election] = [
#     Election('PRE20', {'Dem': 'PRE20D', 'Rep': 'PRE20R'}),
#     Election('USS', {'Dem': 'USS22D', 'Rep': 'USS22R'})
# ]
# MS_ELECTIONS: List[Election] = [
#     Election(),
#     Election()
# ]

### FUNCTIONS ###

def run_nv_chain(chain):
    pass


def run_ms_chain(chain):
    pass

if __name__ == "__main__":
    current_directory = os.getcwd()
    move_up = os.path.dirname(os.path.dirname(current_directory))
    data_dir = os.path.join(move_up, 'Data')
    new_path = os.chdir(data_dir)

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

    # nv_graph = Graph.from_file("NV/nv_precinct_final_data.shp")
    # nv_precinct = gpd.read_file("NV/nv_precinct_final_data.shp")
    # nv_graph_1 = Graph.from_file('NV Data/nv_vest_20/nv_vest_20.shp')

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

    # pprint(number_connected_components(dummy_graph))
    # pprint(len(ms_graph))
    # pprint(number_connected_components(ms_graph))
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

    connect_graph(dummy_graph)

    partition_ms = GeographicPartition(
        graph=dummy_graph,
        assignment='distrctNum',
        updaters={
            "population": Tally("vap", alias="population")
        }
    )
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

    ideal_pop_ms = sum(initial_partition_ms["population"].values()) / len(initial_partition_ms)
    # pprint(ideal_pop_ms)
    # pprint(initial_partition_ms)
    # print(contiguous(initial_partition_ms))


    ms_proposal = partial(
        recom,
        pop_col="vap",
        pop_target=ideal_pop_ms,
        epsilon=0.01,
        node_repeats=2,
        # region_surcharge={"muni": 1.0},
        method=partial(
            bipartition_tree,
            cut_choice=random.choice,
        )
    )
    # initial_partition_ms.plot()
    # plt.show()
    # pprint(contiguous_bfs(initial_partition_ms))
    #
    # ms_recom_chain = MarkovChain(
    #     proposal=ms_proposal,
    #     constraints=[single_flip_contiguous],
    #     accept=accept.always_accept,
    #     initial_state=initial_partition_ms,
    #     total_steps=1000
    # )
