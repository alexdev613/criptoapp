import notfound from '../../assets/404.png';
import { Link } from 'react-router-dom';
import styles from './notfound.module.css';

export function NotFound() {
  return (
    <div className={styles.container}>
      <h1>404, Acho que você se perdeu!</h1>
      <Link to={"/"}>Volte para a página Home</Link>
      <img
        className={styles.img}
        src={notfound}
        alt="Imagem Not Found"
      />
    </div>
  )
}