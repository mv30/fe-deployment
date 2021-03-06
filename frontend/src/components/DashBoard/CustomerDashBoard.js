/* eslint-disable import/named */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-case-declarations */
/* eslint-disable max-len */
/* eslint-disable import/no-named-as-default */
/* eslint-disable no-shadow */
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {
  createTheme, ThemeProvider,
} from '@mui/material/styles';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TablePagination from '@material-ui/core/TablePagination';
import { makeStyles } from '@material-ui/core/styles';
import { NavbarDashBoard } from '../Navigation/NavbarDashBoard';
import SearchHotels from './SearchHotels';
import { useDispatch, useSelector } from 'react-redux';
import { getHotelDetails, setSelectedHotel } from '../../state/action-creators/hotelActions';



const theme = createTheme();

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

export default function CustomerDashBoard() {
  const classes = useStyles();
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const searchData = useSelector((state) => state.hotels.searchParams);
  const hotelDetails = useSelector((state) => state.hotels.hotelDetails);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    let userId = sessionStorage.getItem("userId");
    if(userId===null){
      navigate("/");
    }
    if(searchData.city){
      
      let payload = {
        city: searchData.city,
        endDate:  searchData.value[1]?new Date(searchData.value[1]).toISOString().split('T')[0]: '',
        startDate: searchData.value[0]?new Date(searchData.value[0]).toISOString().split('T')[0]: ''
      }
      dispatch(getHotelDetails(payload));
    }
  },[searchData]);


  useEffect(() => {
     console.log("yes",hotelDetails);
     setCards(hotelDetails);
  },[hotelDetails]);

  const onViewHotel = (card) => {
    dispatch(setSelectedHotel(card.hotelEntry));
    navigate("/customerHotelRooms");
  }

  return (
    <>
      <div style={{
        // backgroundImage: `url(${landingPage})`, height: "100vh",
        // backgroundPosition: "center",
        // backgroundRepeat: "no-repeat",
        // backgroundSize: "cover"
      }}>
        <NavbarDashBoard />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <main>
            {/* Hero unit */}
            <Box
              sx={{
                bgcolor: 'background.paper',
                pt: 8,
                pb: 6,
              }}
            >
              <Container maxWidth="sm">
                <Typography
                  component="h1"
                  variant="h2"
                  align="center"
                  color="text.primary"
                  gutterBottom
                >
                  Welcome back!
                </Typography>
                <Typography variant="h7" align="center" color="text.secondary" paragraph>
                  Find your perfect place to stay.Your comfort is our responsibility!
                </Typography>
              </Container>
            </Box>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <SearchHotels />
            </div>

            <Container sx={{ py: 8 }} maxWidth="md">
              {cards.length>0 && (
              <Grid container spacing={4}>
                <TablePagination
                  rowsPerPageOptions={[2, 5, 10]}
                  component="div"
                  count={cards.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
                {(rowsPerPage > 0
                  ? cards.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : cards).map((card) => (
                    <Grid item key={card.hotelEntry.id} xs={12}>
                      <Card
                        sx={{ display: 'flex', flexDirection: 'column' }}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Grid container spacing={1}>
                            <Grid item xs={2}>
                              <img className={classes.img} alt="complex" src={card.hotelEntry.imageUrl} />
                            </Grid>
                            <Grid item xs={10} sm container>
                              <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                  <Typography gutterBottom variant="h5" component="h2">
                                    {card.hotelEntry.name}
                                  </Typography>
                                  <Typography>
                                    {card.hotelEntry.description}
                                  </Typography>
                                  <Typography>
                                    Phone :
                                    {' '}
                                    {card.hotelEntry.contactNo}
                                  </Typography>
                                  <Typography>
                                    Email :
                                    {' '}
                                    {card.hotelEntry.emailId}
                                  </Typography>
                                  <Typography>
                                    Location :
                                    {' '}
                                    {card.hotelEntry.city}
                                  </Typography>
                                  <Typography>
                                    Zip :
                                    {' '}
                                    {card.hotelEntry.zipCode}
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Grid item>
                                {/* <Typography variant="subtitle1">$19.00</Typography> */}
                                <CardActions>
                                  <Button variant="contained" color="success" onClick={() => onViewHotel(card)}>
                                    View Hotel
                                  </Button>
                                </CardActions>
                              </Grid>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                  ))}
              </Grid>
              )}
            </Container>
          </main>
        </ThemeProvider>
      </div>
    </>
  );
}
