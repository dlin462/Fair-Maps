import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import PieChartComponent from './PieChart';
import LineGraphComponent from './LineGraph';
import BarGraphComponent from './BarGraph';
import PopulationPieChartComponent from './PopulationPieChart';

function MapMenu({
    anchorEl,
    anchorE1Heatmap,
    handleClose,
    handleCloseHeatMap,
    handleGoBack,
    handleStateChange,
    handleStateTable,
    handleClickHeatMap,
    handleEthnicityOptionClick,
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
    return (
      <div style={{ position: 'absolute', zIndex: 1000, width: '100%' }}>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem key="california" onClick={handleGoBack}>
                Go Back to Map
            </MenuItem>
            <MenuItem key="" onClick={handleStateChange}>
                Go To
                {state === 'nevada' ? ' Mississippi' : ' Nevada'}
            </MenuItem>
            <MenuItem key="stateInformation" onClick={() => handleStateTable()}>
                State Information
            </MenuItem>
            <MenuItem key="heatMap" onClick={handleClickHeatMap}>
                Heat Map
                <Menu anchorEl={anchorE1Heatmap} open={Boolean(anchorE1Heatmap)} onClose={handleCloseHeatMap} PaperProps={{ style: { transform: 'translateX(-385%)',  },}}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}>
                <MenuItem onClick={() => handleEthnicityOptionClick('whitePop')}>White</MenuItem>
                <MenuItem onClick={() => handleEthnicityOptionClick('blackPop')}>Black</MenuItem>
                <MenuItem onClick={() => handleEthnicityOptionClick('asianPop')}>Asian</MenuItem>
                <MenuItem onClick={() => handleEthnicityOptionClick('hispanicPop')}>Hispanic</MenuItem>
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