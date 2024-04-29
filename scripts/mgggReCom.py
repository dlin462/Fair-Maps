import matplotlib.pyplot as plt
from gerrychain import (Partition, Graph, MarkovChain,
                        updaters, constraints, accept,
                        Election)
from gerrychain.proposals import recom
from gerrychain.constraints import contiguous
from gerrychain.tree import recursive_tree_part, bipartition_tree
from functools import partial
import multiprocessing
import pandas
import random
from typing import List, int

# Set seed for Reproducibility
random.seed(123)

### CONSTANTS ###

NV_ELECTIONS: List[Election] = [
    Election('USH21', {'Democratic': 'USH_1_D_21', 'Republican': 'USH_1_R_21'}),
    Election('USH21', {'Democratic': 'USH_2_D_21', 'Republican': 'USH_2_R_21'})
]
MS_ELECTIONS: List[Election] = [
    Election(),
    Election()
]

NUM_OF_PROCESSORS: int = 4

# NEVADA

nv_graph = Graph.from_file("NV/nv_graph.shp")

initial_partition_nv = Partition(
    nv_graph,
    updaters={
    "population": updaters.Tally("TOTPOP", alias="population"),
    "cut_edges": updaters.cut_edges
    }
)

ideal_pop_nv = [node['TOTPOP'] for node in nv_graph.nodes].mean()

nv_proposal = partial(
    recom,
    pop_col="TOTPOP",
    pop_target=ideal_pop_nv,
    epsilon=0.01,
    node_repeats=1,
    method=partial(
        bipartition_tree,
        max_attempts=100
    )
)

ms_graph = Graph.from_file("MS/ms_graph.shp")
ideal_pop_ms = [ms_graph.nodes[node]['TOTPOP'] for node in ms_graph.nodes].mean()

if __name__ == "__main__":
    """
    ReCom on MGGG's MS shapefile
    """
    nv_recom_chain = MarkovChain(
        proposal=nv_proposal,
        constraints=[contiguous],
        accept=accept.always_accept,
        initial_state=initial_partition_nv,
        total_steps=100
    )

    def run_nv_chain(chain):
        pass

    
    with multiprocessing.Pool(NUM_OF_PROCESSORS) as pool:
        results = pool.map(run_nv_chain, [nv_recom_chain])

    """
    ReCom on MGGG's NV shapefile
    """

    def run_ms_chain(chain):
        pass

    with multiprocessing.Pool(NUM_OF_PROCESSORS) as pool:
        results = pool.map(run_ms_chain, [ms_recom_chain])