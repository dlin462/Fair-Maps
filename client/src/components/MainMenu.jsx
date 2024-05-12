
import { Menu, MenuItem } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';

function MapMenu({
    anchorEl, anchorE1HeatmapDistricts, anchorE1HeatmapPrecincts, anchorE1Gingles, handleClose, handleCloseHeatMap, handleCloseGingles, handleGoBack, handleStateChange, handleStateTable, handleGinglesClickRace, handleClickGingles, handleClickHeatMapDistricts, handleClickHeatMapPrecincts, handleEthnicityOptionClickDistricts, handleEthnicityOptionClickPrecincts, handleClickBarGraphStateAssembly, handleClickEcologicalInference, state,
  }) {

    const navigate = useNavigate();
    const goToHomeScreen = () => {
        navigate('/');
    };

    return (
      <div style={{ position: 'absolute', zIndex: 1000, width: '100%' }}>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
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
                <MenuItem onClick={() => handleEthnicityOptionClickDistricts('white')}>White</MenuItem> <MenuItem onClick={() => handleEthnicityOptionClickDistricts('black')}>Black</MenuItem> <MenuItem onClick={() => handleEthnicityOptionClickDistricts('asian')}>Asian</MenuItem> <MenuItem onClick={() => handleEthnicityOptionClickDistricts('hispanic')}>Hispanic</MenuItem>
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
                <MenuItem onClick={() => handleEthnicityOptionClickPrecincts('white')}>White</MenuItem> <MenuItem onClick={() => handleEthnicityOptionClickPrecincts('black')}>Black</MenuItem> <MenuItem onClick={() => handleEthnicityOptionClickPrecincts('asian')}>Asian</MenuItem> <MenuItem onClick={() => handleEthnicityOptionClickPrecincts('hispanic')}>Hispanic</MenuItem>
                </Menu>
            </MenuItem>
            <MenuItem key="racialDistributionStateAssembly" onClick={() => handleClickBarGraphStateAssembly()}>
                Racial Distribution Of Current State Assembly
            </MenuItem>
            <MenuItem key="ecologicalInference" onClick={() => handleClickEcologicalInference()}>
                Ecological Inference
            </MenuItem>
            <MenuItem key="gingles" onClick={handleClickGingles}>
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
                <MenuItem onClick={() => handleGinglesClickRace('White')}>White</MenuItem> <MenuItem onClick={() => handleGinglesClickRace('Black')}>Black</MenuItem> <MenuItem onClick={() => handleGinglesClickRace('Asian')}>Asian</MenuItem> <MenuItem onClick={() => handleGinglesClickRace('Hispanic')}>Hispanic</MenuItem>
                </Menu>
            </MenuItem>
            <MenuItem key="homeScreen" onClick={goToHomeScreen}>
                Go back to Select State
            </MenuItem>
        </Menu>
    </div>
  );
}

export default MapMenu;