import { Button, Container, Typography } from '@mui/material';
import ThunderLogo from '../../thunderlogo.png';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
            <img src={ThunderLogo} alt="NBA Thunder Logo" style={{ maxWidth: '100%', height: 'auto' }} />

            <Typography variant="h4" gutterBottom>
                Choose Your State
            </Typography>
            <Button variant="contained" color="primary" style={{ margin: '10px' }}
                onClick={() => navigate('/map/texas')}>
                Texas
            </Button>
            <Button variant="contained" color="secondary" style={{ margin: '10px' }}
                onClick={() => navigate('/map/california')}>
                California
            </Button>
        </Container>
    );
}

export default HomePage;
