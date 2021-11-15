import React, { Component } from "react";
import Color from "./contracts/Color.json";
import getWeb3 from "./getWeb3";



import "./App.css";

class App extends Component {
  state = { loaded: false, account: '', colors: [], mintedCount: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();
      this.setState({account: this.accounts[0]});

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      this.colorInstance = new this.web3.eth.Contract(
        Color.abi,
        Color.networks[this.networkId] && Color.networks[this.networkId].address,
      );

      let colorsCount = await this.colorInstance.methods.mintedCount().call()
      for (let i = 0; i < colorsCount; i++) {
        let color = await this.colorInstance.methods.colors(i).call()
        this.setState({colors: [...this.state.colors, color]});
      }

      let mintedCount = await this.colorInstance.methods.mintedCount().call();
      this.setState({mintedCount: Number(mintedCount)});
      
      this.setState({ loaded: true }, this.listenToEvents);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  listenToEvents = () => {
    this.colorInstance.events.newColorMinted().on('data', event => {
      let color = event.returnValues._color;
      this.setState({colors: [...this.state.colors, color]});
      this.setState(prevState => {return {mintedCount: prevState.mintedCount+1}});
    })
  }

  mintColor = async() => {
    const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    let colorGenerated = genRanHex(6);

    this.colorInstance.methods.mint(colorGenerated).send({from: this.state.account, value: this.web3.utils.toWei('0.001', "ether")});
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Color NFT</h1>
        <p>Colors are randomly generated. Minting a color costs 0.001 Eth.<br />{999 - this.state.mintedCount} of 999 colors available.</p>
        <div className="container" id="container">
          {this.state.colors.map((m, i) => {
            return (<div className="item" key={`item-${i}`}>
              <div className="swatch" style={{background: `#${m}`}}></div>
              <div className="info">#{m}</div>
            </div>)
          })}
        </div>
        <div className="mint-btn" onClick={this.mintColor}>Mint new Color</div>
      </div>
    );
  }
}

export default App;
