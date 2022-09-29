import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from '../Searchbar/Searchbar';
import ImageGallery from '../ImageGallery/ImageGallery';
import Loader from '../Loader/Loader';
import Message from '../Message/Message';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import IconButton from '../IconButton/IconButton';
import { ReactComponent as CloseIcon } from '../../assets/icons/close.svg';

import fetchImages from '../../api/api-services';

class Aplication extends Component {
  state = {
    images: [],
    currentPage: 1,
    searchQuery: '',
    isLoading: false,
    showModal: false,
    largeImage: '',
    error: null,
  };

  // Если при обновлении запрос не равен между стейтами, тогда делаем фетч
  componentDidUpdate(_, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.getImages();
    }
  }

  // Принимаем с формы запрос и пишем в стейт + сбрасываем после отправки ключи из стейта
  onChangeQuery = query => {
    if (this.state.searchQuery === query) {
      return this.setState({ currentPage: this.state.currentPage + 1 });
    }
    this.setState({
      images: [],
      currentPage: 1,
      searchQuery: query,
      error: null,
    });
  };

  // Получаем дату из фетча
  getImages = async () => {
    const { currentPage, searchQuery } = this.state;

    this.setState({
      isLoading: true,
    });

    try {
      const { hits } = await fetchImages(searchQuery, currentPage);

      this.setState(prevState => ({
        images: [...prevState.images, ...hits],
        currentPage: prevState.currentPage + 1,
      }));

      if (hits.length) {
        toast.success(`Hooray! We found ${hits.length} images.`, {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.info(
          `Sorry, there are no ${searchQuery} images matching your search query. Please try again.`,
          {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }

      if (currentPage !== 1) {
        this.scrollOnLoadButton();
      }
    } catch (error) {
      console.log('Smth wrong with App fetch', error);
      this.setState({ error });
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  // Получает полное изображение, пишет его в стейт и открывает модалку
  handleGalleryItem = fullImageUrl => {
    this.setState({
      largeImage: fullImageUrl,
      showModal: true,
    });
  };

  // Переключение модалки
  toggleModal = () => {
    this.setState(prevState => ({
      showModal: !prevState.showModal,
      largeImage: '',
    }));
  };

  // Скролл при клике на кнопку
  scrollOnLoadButton = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  render() {
    const { images, isLoading, showModal, largeImage, error } = this.state;
    return (
      <>
        <Searchbar onSearch={this.onChangeQuery} />
        {images.length < 1 && (
          <Message>
            <h2>The gallery is empty 🙁</h2>
            <p>Use search field!</p>
          </Message>
        )}

        {isLoading && <Loader />}
        <ImageGallery images={images} onImageClick={this.handleGalleryItem} />
        {showModal && (
          <Modal onClose={this.toggleModal}>
            <div className="Close-box">
              <IconButton onClick={this.toggleModal} aria-label="Close modal">
                <CloseIcon width="20px" height="20px" fill="#7e7b7b" />
              </IconButton>
            </div>

            <img src={largeImage} alt="" className="Modal-image" />
          </Modal>
        )}
        {images.length > 0 && <Button onClick={this.getImages} />}
        {error && (
          <Message>
            <h2>Oops! 😫</h2>
            <p>
              Sorry, something went wrong. Please try again, or
              <a href="/">refresh the page</a>.
            </p>
          </Message>
        )}
        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </>
    );
  }
}

export default Aplication;
