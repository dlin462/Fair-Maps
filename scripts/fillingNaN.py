import geopandas as gpd
from pprint import pprint
import numpy as np
import os

def main():
    # nv_precinct_data = gpd.read_file('NV/nv_shapefile/NV_final.shp')
    # nv_precinct_data.to_file('NV/nv_precinct_demographic.geojson', driver='GeoJSON')
    nv_precinct_data = gpd.read_file('nv_precinct_demographic.geojson')
    pprint(nv_precinct_data.columns)


if __name__ == '__main__':
    os.chdir(os.path.join(os.path.join(os.getcwd(), 'client'), 'public'))
    main()