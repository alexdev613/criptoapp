import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CoinProps } from '../home';
import styles from './details.module.css';
import cryptos from '../../assets/cryptos.gif';

interface ResponseData {
  data: CoinProps;
}

interface ErrorData {
  error: string;
}

type DataProps = ResponseData | ErrorData;

interface ExchangeRateResponse {
  USDBRL: {
    bid: string
  }
}

export function Details() {
  const { cripto } = useParams();
  const navigate = useNavigate();

  const [coin, setCoin] = useState<CoinProps>();

  const [usdToBrl, setUsdToBrl] = useState<string>();

  const [loading, setLoading] = useState(true);

  const [minimumLoadingTime, setMinimumLoadingTime] = useState(false);

  useEffect(() => {

    // Inicia temporizador
    const timer = setTimeout(() => {
      setMinimumLoadingTime(true);
    }, 3000);

    async function getCoinAndExchangeRate() {
      try {
        const coinResponse = fetch(`https://api.coincap.io/v2/assets/${cripto}`);

        const exchangeRateResponse = fetch('https://economia.awesomeapi.com.br/last/USD-BRL');

        const [coinResult, exchangeRateResult] = await Promise.all([coinResponse, exchangeRateResponse]);
        const coinData: DataProps = await coinResult.json();

        const exchangeRateData: ExchangeRateResponse = await exchangeRateResult.json();
          
          if("error" in coinData) {
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
            ...coinData.data,
            formattedPrice: price.format(Number(coinData.data.priceUsd)),
            formattedMarket: priceCompact.format(Number(coinData.data.marketCapUsd)),
            formattedVolume: priceCompact.format(Number(coinData.data.volumeUsd24Hr)),
          }

          setCoin(resultData);
          setUsdToBrl(exchangeRateData.USDBRL.bid);
          setLoading(false);
        
      } catch(err) {
        console.log(err);
        navigate("/");
      }
    }

    getCoinAndExchangeRate();

    // Limpa o temporizador quando o componente é desmontado!
    return () => clearTimeout(timer);

  }, [cripto, navigate]);

  if(loading || !coin || !minimumLoadingTime ) { // se loading === true ou não tiver nada em coin ou minimumLoadindTime === false
    return(
      <div className={styles.container} >
        <h4 className={styles.center} >Carregando detalhes...</h4>
        <section className={styles.imgLoading} >
          <img src={cryptos} alt="Crypto Animation" />
        </section>
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
        
        <p><strong>Preço fracionado: $</strong>{coin.priceUsd}</p>

        <p><strong>Preço em Reais: </strong>
          { (Number(coin.priceUsd) * Number(usdToBrl)).toLocaleString("pt-BR", {style: "currency", currency: "BRL"}) }
        </p>

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
        <Link to='/' className={styles.buttonBack}>
          Voltar
        </Link>
      </section>

    </div>
  )
}

/*

async function getCoinAndExchangeRate() {
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

    getCoinAndExchangeRate();

    // Limpa o temporizador quando o componente é desmontado!
    return () => clearTimeout(timer);

  }, [cripto, navigate]);
*/