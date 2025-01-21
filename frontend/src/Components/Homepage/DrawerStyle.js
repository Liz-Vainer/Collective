import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    drawerPaper: {
        backgroundColor: '#f9f9f9', // Light background
        height:'500px',
        color: '#067029', // Green text
        width: '300px', // Wider drawer
        marginTop: '100px', // Spacing from top
        
        borderTopLeftRadius: '10px', // Add rounded corners
        borderBottomLeftRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Soft shadow
      },
      drawerContent: {
        marginTop: '20px', // Spacing from top
        padding: '20px', // Comfortable padding
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px', // Spacing between sections
      },
      profileSection: {
        textAlign: 'center', // Center align text
        marginBottom: '20px',
        backgroundColor: '#e9f5e9', // Light green background for profile section
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      },
      profilePic: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        marginBottom: '10px',
        border: '3px solid #067029', // Green border around profile pic
      },
      changePfpIcon: {
        cursor: 'pointer',
      },
      changeProfileBtn: {
        backgroundColor: '#067029',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
        '&:hover': {
          backgroundColor: '#004d20', // Darker green on hover
        },
      },
      drawerText: {
        color: '#067029',
        fontSize: '16px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '10px',
      },
      quoteSection: {
        backgroundColor: '#e9f5e9',
        padding: '10px',
        borderRadius: '8px',
        textAlign: 'center',
        fontStyle: 'italic',
        fontSize: '14px',
        color: '#067029',
      },
      weatherWidget: {
        marginTop: '10px',
        padding: '10px',
        borderRadius: '8px',
        backgroundColor: '#e0f2e0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        fontSize: '14px',
        textAlign: 'center',
  },
});

export default useStyles;