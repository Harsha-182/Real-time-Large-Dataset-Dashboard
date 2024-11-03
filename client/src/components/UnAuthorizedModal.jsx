import { makeStyles } from '@mui/styles';
import BlockIcon from '@mui/icons-material/Block';
import Button from '@mui/material/Button';

const useStyles = makeStyles((theme) => ({
  modalStyle: {
    position: 'fixed',
    zIndex: 1,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(8px)',
  },
  modalContentStyle: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '4px',
    maxWidth: '400px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  closeModalStyle: {
    color: '#999',
    position: 'absolute',
    top: '20px',
    right: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  iconStyle: {
    color: 'red',
    fontSize: '36px',
    marginBottom: '10px',
  },
  titleStyle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  messageStyle: {
    fontSize: '16px',
    color: '#333',
  },
  buttonStyle: {
    marginTop: '20px',
    backgroundColor: 'lightGrey',
    borderRadius: '10px',
  },
}));

const UnauthorizedModal = ({ showModal, onClose, message }) => {
  const classes = useStyles();

  if (!showModal) {
    return null;
  }

  return (
    <div className={classes.modalStyle}>
      <div className={classes.modalContentStyle}>
        <span className={classes.closeModalStyle} onClick={onClose}>&times;</span>
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div className={classes.iconStyle}><BlockIcon /></div>
            <div style={{ marginLeft: '10px', textAlign: 'left' }}>
              <div className={classes.titleStyle}>Permission Denied</div>
              <div className={classes.messageStyle}>{message}</div>
            </div>
          </div>
          <div className={classes.buttonStyle}>
            <Button onClick={onClose}>OK</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedModal;
