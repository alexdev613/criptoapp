import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CoinProps } from '../home';

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
        })

      } catch(err) {
        console.log(err);
        navigate("/");
      }
    }

    getCoin();
  }, [cripto])
  
  return (
    <div>
      <h1>Página Detalhes da Moeda {cripto}</h1>
    </div>
  )
}