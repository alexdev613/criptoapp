import { useState, FormEvent, useEffect } from 'react';
import styles from './home.module.css';
import { BsSearch } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';

export interface CoinProps {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
  explorer: string;

  formattedPrice?: string;
  formattedMarket?: string;
  formattedVolume?: string;

}

interface DataProps {
  data: CoinProps[];
}

export function Home() {
  const [input, setInput] = useState("");
  const [coins, setCoins] = useState<CoinProps[]>([]);

  const [offset, setOffset] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, [offset]);

  async function getData(){
    fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${offset}`) // faz a requisição http da API
    .then(response => response.json())
    .then((data: DataProps) => {
      const coinsData = data.data;

      const price = Intl.NumberFormat("en-US", { // Intl é uma biblioteca de internacionalização
        style: "currency",
        currency: "USD",
      });

      const priceCompact = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
      });

      const formattedResult = coinsData.map((item) => {
        const formatted = {
          ...item,
          formattedPrice: price.format(Number(item.priceUsd)),
          formattedMarket: priceCompact.format(Number(item.marketCapUsd)),
          formattedVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
        }

        return formatted;
      });

      // console.log(formattedResult); // o que tenho em coinsData que é o que vem da api, mais a(s) propriedades que acrescentei
      // setCoins(formattedResult); // agora depois de feita a requisição e recebida a resposta com os items recebidos da API passando mais propriedades personalizadas e eu preencho minha useState coins

      const listCoins = [...coins, ...formattedResult];
      setCoins(listCoins);

    })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if(input === "") return;

    navigate(`/details/${input}`);
    
  }

  function handleGetMore() {
    if(offset === 0) {
      setOffset(10);
      return;
    }

    setOffset(offset + 10);
  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite o nome da moeda... Ex.: bitcoin"
          value={input}
          onChange={ (e) => setInput(e.target.value) }
        />

        <button type="submit">
          <BsSearch size={30} color="#FFF" />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope="col" >Moeda</th>
            <th scope="col" >Valor de Mercado</th>
            <th scope="col" >Preço</th>
            <th scope="col" >Volume</th>
            <th scope="col" >Mudança 24h</th>
          </tr>
        </thead>

        <tbody id='tbody'>
          
          {coins.length > 0 && coins.map((item) => (
            <tr className={styles.tr} key={item.id} >
            
              <td className={styles.tdLabel} data-label="Moeda" >
                <div className={styles.name} >
                  <img
                    src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`}
                    alt="Logo Crypto"
                    className={styles.logo}
                  />
                  <Link to={`/details/${item.id}`}>
                    <span>{item.name}</span> | {item.symbol}
                  </Link>
                </div>
              </td>

              <td className={styles.tdLabel} data-label="Valor de Mercado" >
                {item.formattedMarket}
              </td>

              <td className={styles.tdLabel} data-label="Preço" >
                {item.formattedPrice}
              </td>

              <td className={styles.tdLabel} data-label="Volume" >
                {item.formattedVolume}
              </td>

              <td className={ Number(item.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss } data-label="Mudança 24h" >
                <span>{Number(item.changePercent24Hr).toFixed(2)}%</span>
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>

      <button className={styles.buttonMore} onClick={handleGetMore} >
        Carregar mais
      </button>

    </main>
  )
}