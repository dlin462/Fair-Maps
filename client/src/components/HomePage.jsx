import { Button, Container, Typography, Box, Divider } from '@mui/material';
import ThunderLogo from '../../thunderlogo.png';
import { useNavigate } from 'react-router-dom';
import ChartSpace from './ChartSpace'

function HomePage() {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
            <img src={ThunderLogo} alt="NBA Thunder Logo" style={{ maxWidth: '100%', height: 'auto' }} />

            <Typography variant="h4" gutterBottom>
                Choose Your State
            </Typography>
            <Button variant="contained" color="primary" style={{ margin: '10px' }}
                onClick={() => navigate('/map/Mississippi')}>
                Mississippi
            </Button>
            <Button variant="contained" color="secondary" style={{ margin: '10px' }}
                onClick={() => navigate('/map/Nevada')}>
                Nevada
            </Button>
            {/* <Button variant="contained" color="secondary" style={{ margin: '10px' }}
                onClick={() => navigate('/gingles')}>
                Charts
            </Button> */}
            {/* <Box display="flex" p={1} style={{ height:'100vh' }}>
                <Box flex={1}>
                <div>
                <img src={cali_races} alt="Description of your image" />
                </div>
                </Box>
                <Divider orientation="vertical" flexItem/>
                <Box flex={1}>
                  <ChartSpace/>
                  <div>
                    <img src={tx_races} alt="Description of your image" />
                  </div>
                </Box>
            </Box> */}
        </Container>
    );
}

export default HomePage;
