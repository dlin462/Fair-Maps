import { useEffect, useRef, useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import LineGraphComponent from './LineGraph';
import BarGraphComponent from './BarGraph';
import { Navigate, useNavigate } from 'react-router-dom';

function StateMenu({
    anchorEl, anchorE1HeatmapDistricts, anchorE1HeatmapPrecincts,
    handleClose, handleCloseHeatMap,
    handleGoBack,
    handleStateChange,
    handleStateTable,
    handleClickHeatMapDistricts, handleClickHeatMapPrecincts, handleEthnicityOptionClickDistricts, handleEthnicityOptionClickPrecincts,
    handleClickBarGraphStateAssembly, handleClickPieChartPopulation, handleClickLineGraph, handleClickBarGraph,
    showLineGraph, showBarGraph,
    state,
  }) {
    const navigate = useNavigate();

    const [anchorE1Gingles, setAnchorE1Gingles] = useState(null);
    const [race, setRace] = useState(null);

    const handleClickGingles = (event) => {
      //event.preventDefault();
      setAnchorE1Gingles(event.currentTarget);
      if (anchorE1Gingles) {
          setAnchorE1Gingles(null);
        }
    };

    const handleCloseGingles = () => {
        setAnchorE1Gingles(null);
    };

    const handleGinglesClickRace = (race) => {
        setAnchorE1Gingles(false);
        setRace(race);
        navigate(`/gingles/scatterplot/${state}/${race}`);
    };

    return (
      <div style={{ position: 'absolute', zIndex: 1000, width: '100%' }}>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
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
            <MenuItem key="racialDistributionStateAssembly" onClick={() => handleClickBarGraphStateAssembly()}>
                Racial Distribution Of Current State Assembly
            </MenuItem>
            <MenuItem key="gingles" onClick={(event) => handleClickGingles(event)}>
                Gingles
                <Menu anchorEl={anchorE1Gingles} open={Boolean(anchorE1Gingles)} onClose={handleCloseGingles} PaperProps={{ style: { transform: 'translateX(-385%)',  },}}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}>
                <MenuItem onClick={() => handleGinglesClickRace('White')}>White</MenuItem>
                <MenuItem onClick={() => handleGinglesClickRace('Black')}>Black</MenuItem>
                <MenuItem onClick={() => handleGinglesClickRace('Asian')}>Asian</MenuItem>
                <MenuItem onClick={() => handleGinglesClickRace('Hispanic')}>Hispanic</MenuItem>
                </Menu>
            </MenuItem>
        </Menu>
    </div>
  );
}

export default StateMenu;