import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit
from sklearn.ensemble import RandomForestRegressor
from sklearn.datasets import make_regression

def fit_nonlinear_regression() -> RandomForestRegressor:
    # Generate the data
    X, y = make_regression(n_features=4, n_informative=2,
                           random_state=0, shuffle=False)
    
    # Fit the model
    regr = RandomForestRegressor(max_depth=2, random_state=0)
    regr.fit(X, y)
    
    return regr

def precinct_analysis():
    # Load the data
    precinct_data = pd.read_csv('precinct_data.csv')
    
    # Fit the model
    regr = fit_nonlinear_regression()
    
    # Predict the data
    precinct_data['predicted_votes'] = regr.predict(precinct_data[['population', 'median_income', 'percent_white', 'percent_black']])
    
    return precinct_data

if __name__ == "__main__":
    X, y = make_regression(n_features=4, n_informative=2,
                        random_state=0, shuffle=False)
    
    regr = RandomForestRegressor(max_depth=2, random_state=0)
    regr.fit(X, y)
    print(regr.predict([[0, 0, 0, 0]]))