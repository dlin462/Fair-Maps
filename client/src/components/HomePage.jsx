import { Button, Container, Typography, Box } from '@mui/material';
import ThunderLogo from '../../thunderlogo.png';
import { useNavigate } from 'react-router-dom';
import ChartSpace from './ChartSpace';

function HomePage() {
    const navigate = useNavigate();

    return (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(to right, #E53935 45%, #1976D2 55%)',
            }}
        >
            <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
                <img src={ThunderLogo} alt="NBA Thunder Logo" style={{ maxWidth: '100%', height: 'auto', marginLeft:'30px'}} />

                <Typography variant="h4" gutterBottom style={{ color: '#FFFFFF', marginTop: '20px' }}>
                    Choose Your State
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginRight: '50px', marginLeft: '50px', margin: '10px', backgroundColor: '#FFFFFF', color: '#1976D2' }}
                    onClick={() => navigate('/map/Mississippi')}
                >
                    Mississippi
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginRight: '50px', marginLeft: '50px', margin: '10px', backgroundColor: '#FFFFFF', color: '#E53935' }}
                    onClick={() => navigate('/map/Nevada')}
                >
                    Nevada
                </Button>
            </Container>
        </Box>
    );
}

export default HomePage;