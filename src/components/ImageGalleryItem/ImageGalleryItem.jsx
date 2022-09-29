import PropTypes from 'prop-types';
import styles from './ImageGalleryItem.module.scss';

const ImageGalleryItem = ({ image, onImageClick }) => {
  return (
    <li className={styles.ImageGalleryItem}>
      <img
        src={image.webformatURL}
        alt={image.tags}
        className={styles['ImageGalleryItem-image']}
        onClick={() => onImageClick(image.largeImageURL)}
      />
    </li>
  );
};

ImageGalleryItem.defaultProps = {
  tags: '',
};

ImageGalleryItem.propTypes = {
  image: PropTypes.shape({
    webformatURL: PropTypes.string.isRequired,
    largeImageURL: PropTypes.string.isRequired,
    tags: PropTypes.string,
  }),
  onImageClick: PropTypes.func.isRequired,
};

export default ImageGalleryItem;
