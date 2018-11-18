import React, { Component } from 'react';
import firebase from '../../firebase';
import styles from './MessageForm.module.scss';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import FileUploadModal from './FileUploadModal';

class MessageForm extends Component {
  state = {
    message: '',
    user: this.props.currentUser,
    messagesRef: firebase.database().ref('messages'),
    errors: [],
    loading: false,
    fileUploadModalIsOpen: false,
  };

  openModal = () => {
    this.setState({ fileUploadModalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ fileUploadModalIsOpen: false });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createMessage = () => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL,
      },
    };
    message.content = this.state.message;
    return message;
  };

  sendMessage = (event) => {
    if (event.key === 'Enter') {
      const { currentRoom } = this.props;
      const { message, messagesRef } = this.state;

      if (message) {
        this.setState({ loading: true });
        messagesRef
          .child(currentRoom.id)
          .push()
          .set(this.createMessage())
          .then(() => {
            this.setState({ loading: false, message: '', errors: [] });
          })
          .catch((err) => {
            console.error(err);
            this.setState(state => ({
              loading: false,
              errors: state.errors.concat(err),
            }));
          });
      } else {
        this.setState(state => ({
          errors: state.errors.concat({ message: 'Add a message' }),
        }));
      }
    }
  };

  render() {
    const { fileUploadModalIsOpen } = this.state;
    return (
      <div className={styles['message-form']}>
        <button type="button" className={styles['upload-button']}>
          <Icon
            className={styles['upload-icon']}
            onClick={this.openModal}
          >
          add_to_photos
          </Icon>
        </button>
        <input
          onKeyPress={this.sendMessage}
          onChange={this.handleChange}
          className={styles['message-input']}
          id="message"
          value={this.state.message}
          name="message"
          type="text"
          autoComplete="off"
        />
        <FileUploadModal
          isOpen={fileUploadModalIsOpen}
          closeModal={this.closeModal}
        />
      </div>
    );
  }
}

MessageForm.propTypes = {
  currentUser: PropTypes.object,
  currentRoom: PropTypes.object,
};
export default MessageForm;