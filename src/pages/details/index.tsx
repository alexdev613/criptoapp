import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CoinProps } from '../home';
import styles from './details.module.css';

interface ResponseData {
  data: CoinProps;
}

interface ErrorData {
  error: string;
}

type DataProps = ResponseData | ErrorData;

export function Details() {
  const { cripto } = useParams();
  const navigate = useNavigate();

  const [coin, setCoin] = useState<CoinProps>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCoin() {
      try {
        fetch(`https://api.coincap.io/v2/assets/${cripto}`)
        .then(response => response.json())
        .then((data: DataProps) => {
          
          if("error" in data) {
            navigate("/");
            return;
          }

          const price = Intl.NumberFormat("en-US", { // Intl é uma biblioteca de internacionalização
            style: "currency",
            currency: "USD",
          });
    
          const priceCompact = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact",
          });

          // Agora não preciso fazer um map, pois agora data.data já devolve o objeto diretamente

          const resultData = {
            ...data.data,
            formattedPrice: price.format(Number(data.data.priceUsd)),
            formattedMarket: priceCompact.format(Number(data.data.marketCapUsd)),
            formattedVolume: priceCompact.format(Number(data.data.volumeUsd24Hr)),
          }

          setCoin(resultData);
          setLoading(false);
        })

      } catch(err) {
        console.log(err);
        navigate("/");
      }
    }

    getCoin();
  }, [cripto]);

  if(loading || !coin ) { // se loading === true ou não tiver nada em coin
    return(
      <div className={styles.container} >
        <h4 className={styles.center} >Carregando detalhes...</h4>
      </div>
    )
  }
  
  return (
    <div className={styles.container} >
      <h1 className={styles.center} >{coin?.name}</h1>
      <h1 className={styles.center} >{coin?.symbol}</h1>

      <section className={styles.content} >
        <img
          src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`}
          alt="Logo da moeda"
          className={styles.logo}
        />
        <h1>{coin?.name} | {coin?.symbol}</h1>

        <p><strong>Preço: </strong>{coin?.formattedPrice}</p>

        <a>
          <strong>Mercado: </strong>{coin?.formattedMarket}
        </a>

        <a>
          <strong>Volume: </strong>{coin?.formattedVolume}
        </a>

        <a>
          <strong>Mudança 24h: </strong>
          <span className={Number(coin?.changePercent24Hr) > 0 ? styles.profit : styles.loss} >
            {Number(coin?.changePercent24Hr).toFixed(2)}%
          </span>
        </a>
      </section>
    </div>
  )
}