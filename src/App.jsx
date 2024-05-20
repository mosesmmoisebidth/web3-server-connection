import { useState, useEffect } from "react";
import Web3 from "web3";
import NumberAdderABI from "./sum.json";
import "./App.css"; // Import the CSS file

function Outside() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [number1, setNumber1] = useState("");
  const [number2, setNumber2] = useState("");
  const [sum, setSum] = useState("");
  const [account, setAccount] = useState("");

  useEffect(() => {
    async function initWeb3() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
          setWeb3(web3);
        } catch (error) {
          console.error("User denied account access", error);
        }
      }
    }
    initWeb3();
  }, []);

  useEffect(() => {
    if (web3) {
      const networkId = 5777; // Ganache network id
      const deployedNetwork = NumberAdderABI.networks[networkId];
      const contractInstance = new web3.eth.Contract(
        NumberAdderABI.abi,
        deployedNetwork && deployedNetwork.address
      );
      setContract(contractInstance);
    }
  }, [web3]);

  const addNumbers = async () => {
    if (contract && account) {
      try {
        await contract.methods
          .addTwoNumbers(parseInt(number1), parseInt(number2))
          .send({ from: account });
        const sumBigInt = await contract.methods.displaySum().call();
        const sumNumber = parseInt(sumBigInt.toString()); // Convert BigInt to number
        setSum(sumNumber);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="container">
      <h1>My DApp</h1>
      <div className="input-group">
        <label htmlFor="number1">Number 1</label>
        <input
          id="number1"
          type="number"
          value={number1}
          onChange={(e) => setNumber1(e.target.value)}
          placeholder="Enter number 1"
        />
      </div>
      <div className="input-group">
        <label htmlFor="number2">Number 2</label>
        <input
          id="number2"
          type="number"
          value={number2}
          onChange={(e) => setNumber2(e.target.value)}
          placeholder="Enter number 2"
        />
      </div>
      <button onClick={addNumbers}>Add</button>
      <div className="results">
        <p>Number 1: {number1}</p>
        <p>Number 2: {number2}</p>
        <p>Here is the Sum: {sum}</p>
      </div>
    </div>
  );
}

export default Outside;
