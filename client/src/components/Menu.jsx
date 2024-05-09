import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import PieChartComponent from './PieChart';
import LineGraphComponent from './LineGraph';
import BarGraphComponent from './BarGraph';
import PopulationPieChartComponent from './PopulationPieChart';
import { Navigate, useNavigate } from 'react-router-dom';

function MapMenu({
    anchorEl,
    anchorE1HeatmapDistricts,
    anchorE1HeatmapPrecincts,
    handleClose,
    handleCloseHeatMap,
    handleGoBack,
    handleStateChange,
    handleStateTable,
    handleClickHeatMapDistricts,
    handleClickHeatMapPrecincts,
    handleEthnicityOptionClickDistricts,
    handleEthnicityOptionClickPrecincts,
    handleClickPieChartAssembly,
    handleClickPieChartPopulation,
    handleClickLineGraph,
    handleClickBarGraph,
    showPieChartAssembly,
    showLineGraph,
    showBarGraph,
    showPieChartPopulation,
    state,
  }) {
    const navigate = useNavigate();

    const goToHomeScreen = () => {
        navigate('/');
    };
    return (
      <div style={{ position: 'absolute', zIndex: 1000, width: '100%' }}>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem key="homeScreen" onClick={goToHomeScreen}>
                Go back to Select State
            </MenuItem>
            <MenuItem key="back" onClick={handleGoBack}>
                Go Back to Map
            </MenuItem>
            <MenuItem key="" onClick={handleStateChange}>
                Go To
                {state === 'Nevada' ? ' Mississippi' : ' Nevada'}
            </MenuItem>
            <MenuItem key="stateInformation" onClick={() => handleStateTable()}>
                State Information
            </MenuItem>
            <MenuItem key="heatMapDistricts" onClick={handleClickHeatMapDistricts}>
                Heat Map for Districts
                <Menu anchorEl={anchorE1HeatmapDistricts} open={Boolean(anchorE1HeatmapDistricts)} onClose={handleCloseHeatMap} PaperProps={{ style: { transform: 'translateX(-385%)',  },}}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}>
                <MenuItem onClick={() => handleEthnicityOptionClickDistricts('white')}>White</MenuItem>
                <MenuItem onClick={() => handleEthnicityOptionClickDistricts('black')}>Black</MenuItem>
                <MenuItem onClick={() => handleEthnicityOptionClickDistricts('asian')}>Asian</MenuItem>
                <MenuItem onClick={() => handleEthnicityOptionClickDistricts('hispanic')}>Hispanic</MenuItem>
                </Menu>
            </MenuItem>

            <MenuItem key="heatMapPrecincts" onClick={handleClickHeatMapPrecincts}>
                Heat Map for Precincts
                <Menu anchorEl={anchorE1HeatmapPrecincts} open={Boolean(anchorE1HeatmapPrecincts)} onClose={handleCloseHeatMap} PaperProps={{ style: { transform: 'translateX(-385%)',  },}}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}>
                <MenuItem onClick={() => handleEthnicityOptionClickPrecincts('white')}>White</MenuItem>
                <MenuItem onClick={() => handleEthnicityOptionClickPrecincts('black')}>Black</MenuItem>
                <MenuItem onClick={() => handleEthnicityOptionClickPrecincts('asian')}>Asian</MenuItem>
                <MenuItem onClick={() => handleEthnicityOptionClickPrecincts('hispanic')}>Hispanic</MenuItem>
                </Menu>
            </MenuItem>
            
            <MenuItem key="racialDistributionAssembly" onClick={() => handleClickPieChartAssembly()}>
                Racial Distribution Of Current State Assembly
            </MenuItem>
            <MenuItem key="racialDistributionPopulation" onClick={() => handleClickPieChartPopulation()}>
                Racial Distribution Of Current State Population
            </MenuItem>
            <MenuItem key="voterTurnout" onClick={() => handleClickLineGraph()}>
                Voter Turnout
            </MenuItem>
            <MenuItem key="racialGap" onClick={() => handleClickBarGraph()}>
                Racial Gap Assessment
            </MenuItem>
        </Menu>
        <PieChartComponent showPieChartAssembly={showPieChartAssembly} state={state} />
        <LineGraphComponent showLineGraph={showLineGraph} state={state} />
        <BarGraphComponent showBarGraph={showBarGraph} state={state} />
        <PopulationPieChartComponent showPieChartPopulation={showPieChartPopulation} state={state} />
    </div>
  );
}

export default MapMenu;