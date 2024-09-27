import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [Temperature, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const IncreaseTemperature = async() => {
    if (atm) {
      const Temp = document.getElementById("amount").value;
      let tx = await atm.Increasetemperature(Temp);
      await tx.wait()
      getBalance();
    }
  }

  const DecreaseTemperature = async() => {
    if (atm) {
      const Temp = document.getElementById("amount").value;
      let tx = await atm.Decreasetemperature(Temp);
      await tx.wait()
      getBalance();
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this Temperature System.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (Temperature == undefined) {
      getBalance();
    }

return (
  <div className="h-full flex flex-col items-center justify-center">
     <h6 className="mt-2 mb-40 border-2 border-neutral-600 border-neutral-500 p-1 rounded text-xl">
      <p>Induction : {account}</p>
      </h6>
      <h6 className="flex justify-center font-black text-5xl">
      <p>Heat Temperature : {Temperature}</p>
      </h6>
     
      <div className="flex items-center justify-evenly">
          <button className="btn m-2" onClick={IncreaseTemperature}>
          Increase
          </button>
          <button className="btn m-2" onClick={DecreaseTemperature}>
          Decrease
          </button>
      </div>
      <form className="flex items-center justify-center">
          <label className="text-xl me-1">Temp:</label>
          <input
              id="amount"
              type="number"
              className="bg-transparent border-2 border-neutral-600 p-1 rounded text-xl w-14"
              defaultValue={1}
              min={1}
          />
      </form>
  </div>
);
};

useEffect(() => {
getWallet();
}, []);

return (
<main className="w-screen h-screen flex items-center justify-evenly">
  <script src="https://cdn.tailwindcss.com"></script>
  <link
      href="https://cdn.jsdelivr.net/npm/daisyui@3.9.4/dist/full.css"
      rel="stylesheet"
      type="text/css"
  />
  <link
      href="https://fonts.cdnfonts.com/css/chicago-2"
      rel="stylesheet"
  ></link>
  <link
      href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
      rel="stylesheet"
  ></link>

  <div className="grid grid-cols-2 gap-63">
      <header className="col-span-1 flex items-center">
          <h1 className="font-normal text-7xl text-red-400">
          Induction Temperature
          </h1>
      </header>

      <section className="col-span-1 h-screen flex justify-center items-center">
          {initUser()}
      </section>
  </div>
  <style jsx>
      {`
          * {
              font-family: "Roboto", sans-serif;
          }

          body {
              background-color: #1a202c;
          }

          h1 {
              font-family: "Chicago", sans-serif;
          }

          .container {
              text-align: center;
          }
      `}
  </style>
</main>
);
}
