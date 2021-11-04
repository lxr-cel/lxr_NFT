import React, { Component } from "react"
import ipfsAPI from "ipfs-api"

const ipfs = ipfsAPI('localhost', '5001', { protocol: 'http' });
let web3 = require('./utils/InitWeb3');
let Instance = require('./eth/myNFT');
let a = true, b = false, c = false, d = false;

let saveImageOnIpfs = (reader) => {
    return new Promise(function (resolve, reject) {
        const buffer = Buffer.from(reader.result);
        ipfs.add(buffer).then((response) => {
            console.log(response);
          resolve(response[0].hash);
        }).catch((err) => {
            console.error(err);
            reject(err);
        })  
    })  
}

class App extends Component {

  mint = async () => {
    console.log('mint button click')
    let accounts = await web3.eth.getAccounts()
    console.log(accounts[0])
    try {
      await Instance.methods.myMint(this.state.hash).send({
        from: accounts[0],
        gas: '3000000',
      })
      alert('铸造成功')
    } catch (e) {
      alert('铸造失败')
    }
  }

  take = async () => {
    let accounts = await web3.eth.getAccounts()
    try {
      await Instance.methods.tokenTransfer(this.state.auctionMesId).send({
        from: accounts[0],
        gas: '3000000',
      })
      alert('领取成功')
    } catch (e) {
      alert('领取失败')
    }
    this.getMes(this.state.auctionMesId)
  }

  auction = async (Id) => {
    console.log(Id)
    this.setState({ chosenId: Id })
    let chosenNum = await Instance.methods.getOwnerNum(Id).call()
    let chosenOwner = await Instance.methods.getOwnersAddress(Id).call()
    let chosenPrice = await Instance.methods.getTotalPrice(Id).call()
    let chosenTime = await Instance.methods.getTotalTime(Id).call()
    this.setState({ chosenNum })
    this.setState({ chosenOwner })
    this.setState({ chosenPrice })
    this.setState({ chosenTime })
    this.setState({ auctionReleaseId: Id})
    this.setState({ mintButton: false })
    this.setState({ wareHouse: false })
    this.setState({ shopMall: false })
    this.setState({ auctionMes: false })
    this.setState({ isAuction: true })
    this.setState({ inMintButton: false })
    this.setState({ NFTButton: false })
  }

  getMes = async (Id) => {
    console.log(Id)
    this.setState({ auctionMesId: Id })
    this.setState({ chosenId: Id })
    let chosenNum = await Instance.methods.getOwnerNum(Id).call()
    let chosenOwner = await Instance.methods.getOwnersAddress(Id).call()
    let chosenPrice = await Instance.methods.getTotalPrice(Id).call()
    let chosenTime = await Instance.methods.getTotalTime(Id).call()
    this.setState({ chosenNum })
    this.setState({ chosenOwner })
    this.setState({ chosenPrice })
    this.setState({ chosenTime })
    let auctionMesSeller = await Instance.methods.getSeller(Id).call()
    let StartTime = await Instance.methods.getStartTime(Id).call()
    let auctionMesStartTime = new Date(StartTime * 1000).toString()
    let EndTime = await Instance.methods.getEndTime(Id).call()
    let auctionMesEndTime = new Date(EndTime * 1000).toString()
    let accounts = await web3.eth.getAccounts()
    let owner = await Instance.methods.ownerOf(Id).call()
    let auctionMesCanauction = false
    auctionMesCanauction = (accounts[0] != owner)
    auctionMesCanauction = (auctionMesCanauction && (Date.parse(new Date()) <= (EndTime * 1000)))
    let auctionMesCantake = false
    let winner = await Instance.methods.getHighestBidder(Id).call()
    auctionMesCantake = (accounts[0] == winner)
    auctionMesCantake = (auctionMesCantake && (Date.parse(new Date()) >= (EndTime * 1000)))
    let auctionMesNum = await Instance.methods.getBidNum(Id).call()
    let auctionMesTime = await Instance.methods.getBidTime(Id).call()
    let auctionMesBid = await Instance.methods.getBid(Id).call()
    let auctionMesBidder = await Instance.methods.getBidderAddress(Id).call()
    this.setState({ auctionMesSeller })
    this.setState({ auctionMesStartTime })
    this.setState({ auctionMesEndTime })
    this.setState({ auctionMesCanauction })
    this.setState({ auctionMesCantake })
    this.setState({ auctionMesNum })
    this.setState({ auctionMesTime })
    this.setState({ auctionMesBid })
    this.setState({ auctionMesBidder })
    this.setState({ mintButton: false })
    this.setState({ wareHouse: false })
    this.setState({ shopMall: false })
    this.setState({ auctionMes: true })
    this.setState({ isAuction: false })
    this.setState({ inMintButton: false })
    this.setState({ NFTButton: false })
  }

  getURI = async (id) => {
    var x = 1
    console.log("getURI")
    try {
      let response = await Instance.methods.getURI(x).call();
      console.log('response:', response)
      this.setState({ response })
      return response
    }
    catch (e) {
      console.log(e)
    }
  }

  upload = async (info) => {
    console.log("info", info)
    let reader = new FileReader()
    reader.readAsArrayBuffer(info)
    console.log("reader", reader)
    console.log("reader.result", reader.result) //null
    reader.onloadend = () => {
        console.log("reader", reader)
        console.log("reader.result", reader.result)
        saveImageOnIpfs(reader).then((hash) => {
            console.log("hash", hash)
            this.setState({hash})
        })
    }
  };

  
  constructor() {
    super()
    this.state = {
      manager: "",
      hash: "",
      response: "",
      auctionNum: 0,
      auction: [],
      auctionResponse: [],
      auctionPrice:[],
      mintNum: 0,
      mintAll: [],
      mintResponse: [],
      inAuctionNum: 0,
      inAuction: [],
      inAuctionResponse: [],
      inAuctionPrice: [],
      tokenNum: 0,
      tokenAll: [],
      tokenReaponse: [],
      auctionReleaseId: 0,
      auctionReleaseBiddingTime: 0,
      auctionReleasePrice: 0,
      auctionMesId: 0,
      auctionMesNum: 0,
      auctionMesTime: [],
      auctionMesBid: [],
      auctionMesBidder: [],
      chosenId: 0,
      chosenNum: 0,
      chosenTime: [],
      chosenOwner: [],
      chosenPrice: [],
      auctionMesCanauction: false,
      auctionMesCantake: false,
      auctionMesStartTime: "",
      auctionMesEndTime: "",
      auctionMesSeller: "",
      inMintButton: false,
      NFTButton: false,
      isMint: false,
      isAuction: false,
      mintButton: false,
      wareHouse: false,
      shopMall: true,
      auctionMes: false
    }
  }

  componentDidMount() {
    document.body.style.backgroundColor = 'rgb(200, 204, 209, 1)';
  }

  async componentWillMount() {
    let accounts = await web3.eth.getAccounts()
    this.setState({manager: accounts[0]})
    let auctionNum = await Instance.methods.getAuctionNum().call()
    let auction = await Instance.methods.getAuction().call()
    let auctionResponse = []
    for (var i = 0; i < auctionNum; i++)
    {
      auctionResponse[i] = await Instance.methods.getURI(auction[i]).call()
    }
    let auctionPrice = []
    for (var i = 0; i < auctionNum; i++)
    {
      auctionPrice[i] = await Instance.methods.getHighestBid(auction[i]).call()
    }
    let mintNum = await Instance.methods.getMintNum(accounts[0]).call()
    let mintAll = await Instance.methods.getMint(accounts[0]).call()
    let mintResponse = []
    for (i = 0; i < mintNum; i++)
    {
      mintResponse[i] = await Instance.methods.getURI(mintAll[i]).call()
    }
    let inAuctionNum = await Instance.methods.getInAuctionNum(accounts[0]).call()
    let inAuction = await Instance.methods.getInAuction(accounts[0]).call()
    let inAuctionResponse = []
    let inAuctionPrice = []
    for (i = 0; i < inAuctionNum; i++)
    {
      inAuctionResponse[i] = await Instance.methods.getURI(inAuction[i]).call()
    }
    for (i = 0; i < inAuctionNum; i++)
    {
      inAuctionPrice[i] = await Instance.methods.getHighestBid(inAuction[i]).call()
    }
    let tokenNum = await Instance.methods.getTokenNum(accounts[0]).call()
    let tokenAll = await Instance.methods.getToken(accounts[0]).call()
    let tokenResponse = []
    for (i = 0; i < tokenNum; i++)
    {
      tokenResponse[i] = await Instance.methods.getURI(tokenAll[i]).call()
    }
    this.setState({
      auctionNum,
      auction,
      auctionResponse,
      auctionPrice,
      mintNum,
      mintAll,
      mintResponse,
      inAuctionNum,
      inAuction,
      inAuctionResponse,
      inAuctionPrice,
      tokenNum,
      tokenAll,
      tokenResponse
    })
  }

  chooseMint = async () => {
    this.setState({ mintButton: true })
    this.setState({ wareHouse: false })
    this.setState({ shopMall: false })
    this.setState({ auctionMes: false })
    this.setState({ isAuction: false })
    this.setState({ inMintButton: false })
    this.setState({ NFTButton: false })
    this.componentWillMount()
  }
  
  choosewareHouse = async () => {
    this.setState({ mintButton: false })
    this.setState({ wareHouse: true })
    this.setState({ shopMall: false })
    this.setState({ auctionMes: false })
    this.setState({ isAuction: false })
    this.setState({ inMintButton: false })
    this.setState({ NFTButton: false })
    this.componentWillMount()
  }

  chooseMall = async () => {
    this.setState({ mintButton: false })
    this.setState({ wareHouse: false })
    this.setState({ shopMall: true })
    this.setState({ auctionMes: false })
    this.setState({ isAuction: false })
    this.setState({ inMintButton: false })
    this.setState({ NFTButton: false })
    this.componentWillMount()
  }

  chooseInMint = async () => {
    this.setState({ mintButton: false })
    this.setState({ wareHouse: false })
    this.setState({ shopMall: false })
    this.setState({ auctionMes: false })
    this.setState({ isAuction: false })
    this.setState({ inMintButton: true })
    this.setState({ NFTButton: false })
    this.componentWillMount()
  }

  chooseNFT = async () => {
    this.setState({ mintButton: false })
    this.setState({ wareHouse: false })
    this.setState({ shopMall: false })
    this.setState({ auctionMes: false })
    this.setState({ isAuction: false })
    this.setState({ inMintButton: false })
    this.setState({ NFTButton: true })
    this.componentWillMount()
  }

  auctionRelease = async () => {
    let price = this.priceInput.value;
    let _price = web3.utils.toWei(price,'ether')
    let accounts = await web3.eth.getAccounts()
    try {
      await Instance.methods.myAuctionRelease(this.timeInput.value,this.state.auctionReleaseId,_price).send({
        from: accounts[0],
        gas: '3000000',
      })
      alert('发起成功')
    } catch (e) {
      alert('发起失败')
    }
  }

  bid = async () => {
    console.log(this.bidPriceInput.value)
    let accounts = await web3.eth.getAccounts()
    try {
      await Instance.methods.myBid(this.state.auctionMesId).send({
        from: accounts[0],
        value: web3.utils.toWei(this.bidPriceInput.value, 'ether'),
        gas: '3000000',
      })
      alert('叫价成功')
    } catch (e) {
      alert('叫价失败')
    }
    this.getMes(this.state.auctionMesId)
  }

  mineMintShow = () => {
    return (
    this.state.mintAll.map(
      (item, index) => {
        if(item != 0)
        return <div class="product-layout">
								<div class="product-item-container">
									<div class="left-block">
										<div class="product-image-container  second_img ">
											<img src={"http://localhost:8080/ipfs/" + this.state.mintResponse[index]} alt={true} height={"300px"} weight={"600px"} />
										</div></div>
              <div class="right-block" >
                <div class="button-group" align="center">
											<button  onClick={() => this.auction(item)} class="addToCart btn btn-default " type="button" data-toggle="tooltip" title=""  data-original-title="Add to Cart"> <span class="">拍卖</span></button>
										</div></div></div></div>
      } 
      )
    )
  }

  mineInAuctionShow = () => {
    return (
    this.state.inAuction.map(
      (item, index) => {
        if(item != 0)
        return <div class="product-layout">
								<div class="product-item-container">
									<div class="left-block">
										<div class="product-image-container  second_img ">
											<img src={"http://localhost:8080/ipfs/" + this.state.inAuctionResponse[index]} alt={true} height={"300px"} weight={"600px"} />
              </div></div>
            <h4 align="center"> {this.state.inAuctionPrice[index] / 1000000000000000000} ether</h4>
              <div class="right-block" >
                <div class="button-group" align="center">
											<button  onClick={() => this.getMes(item)} class="addToCart btn btn-default " type="button" data-toggle="tooltip" title=""  data-original-title="Add to Cart"> <span class="">查看详情</span></button>
										</div></div></div></div>
      } 
      )
    )
  }

  mineNFTShow = () => {
    return (
    this.state.tokenAll.map(
      (item, index) => {
        if(item != 0)
          return <div class="product-layout">
								<div class="product-item-container">
									<div class="left-block">
										<div class="product-image-container  second_img ">
											<img src={"http://localhost:8080/ipfs/" + this.state.tokenResponse[index]} alt={true} height={"300px"} weight={"600px"} />
										</div></div>
              <div class="right-block" >
                <div class="button-group" align="center">
											<button  onClick={() => this.auction(item)} class="addToCart btn btn-default " type="button" data-toggle="tooltip" title=""  data-original-title="Add to Cart"> <span class="">拍卖</span></button>
										</div></div></div></div>
      } 
      )
    )
  }

  auctionShow = () => {
    return (
    this.state.auction.map(
      (item, index) => {
        if(item != 0)
        return <div class="product-layout">
								<div class="product-item-container">
									<div class="left-block">
										<div class="product-image-container  second_img ">
											<img src={"http://localhost:8080/ipfs/" + this.state.auctionResponse[index]} alt={true} height={"300px"} weight={"600px"} />
              </div></div>
            <h4 align="center"> {this.state.auctionPrice[index] / 1000000000000000000} ether</h4>
              <div class="right-block" >
                <div class="button-group" align="center">
											<button  onClick={() => this.getMes(item)} class="addToCart btn btn-default " type="button" data-toggle="tooltip" title=""  data-original-title="Add to Cart"> <span class="">查看详情</span></button>
										</div></div></div></div>
         
      } 
      )
    )
  }
  
  transactionRecordShow = () => {
    var res = []
    for (var i = 0; i < this.state.auctionMesNum; i++)
    {
      res.push(
        <tr>
          <td>{this.state.auctionMesBidder[i]}</td>
          <td><font color = "red">{this.state.auctionMesBid[i] / 1000000000000000000} ether</font></td>
          <td>{new Date(this.state.auctionMesTime[i] * 1000).toString()}</td>
        </tr>
      )
    }
    return res
  }

  RecordShow = () => {
    var res = []
    res.push(
      <tr>
        <td>{this.state.chosenOwner[0]}</td>
        <td><font color = "red">0 ether</font></td>
        <td>{new Date(this.state.chosenTime[0] * 1000).toString()}</td>
      </tr>
    )
    for (var i = 1; i < this.state.chosenNum; i++)
    {
      res.push(
        <tr>
          <td>{this.state.chosenOwner[i]}</td>
          <td><font color = "red">{this.state.chosenPrice[i] / 1000000000000000000} ether</font></td>
          <td>{new Date(this.state.chosenTime[i] * 1000).toString()}</td>
        </tr>
      )
    }
    return res
  }

  auctionMesShow = () => {
    return (
      <div>
        <h4 align="center">销售者： {this.state.auctionMesSeller}</h4>
        <p align="center">开始时间： {this.state.auctionMesStartTime} {"----"} 结束时间： {this.state.auctionMesEndTime}</p>
        {
          this.state.auctionMesCanauction &&
          <div align= "center" class="button-group" >
            投注价格：<input type='number' class="addToCart btn btn-default" ref={(input) => { this.bidPriceInput = input }} />
            <nobr />
              <button  onClick={()=>this.bid()} class="addToCart btn btn-default ">叫价</button>
          </div>
        }
        {
          this.state.auctionMesCantake &&
          <div align="center">
            <h4 align = "center">拍卖已结束，恭喜你可以领取你的NFT!!</h4>
            <div class="button-group" align="center">
              <button  onClick={()=>this.take()} class="addToCart btn btn-default ">领取</button>
            </div>
          </div>
        }
        <h3 align="center">NFT流转纪录</h3>
        <table align="center" border="2" cellpadding="10" cellspacing="10">
          <tr>
          <th>持有者</th>
          <th>价格</th>
          <th>时间</th>
          </tr>
        {
          this.RecordShow()
        }
        </table>
        <h3 align="center">拍卖纪录</h3>
        <table align="center" border="2">
          <th>叫价方</th>
          <th>出价</th>
          <th>时间</th>
        {
          this.transactionRecordShow()
        }
        </table>
      </div>
    )
  }

  render() {
    return (
      <div>
        <div class="header-top"><div class="container"><div class="row">
						<div class="header-top-left form-inline col-sm-6 col-xs-6 compact-hidden">
							<div class="form-group currencies-block">
								<div class="navbar-logo col-md-2 col-sm-11 col-xs-10">
                <img src={"logo.jpg"} title="Your Store" alt="Your Store" /></div>
            <span><font size = "3">欢迎来到Lxr-NFT拍卖中心</font></span></div></div>
						<div class="header-top-right collapsed-block text-right  col-sm-6 col-xs-6 compact-hidden">
							<div class="tabBlock1" id="TabBlock-1">
								<ul class="top-link list-inline">
									<li class="wishlist hidden-xs"><h5><span>Welcome Customer!</span></h5></li>
                    <li class="signin"><h5><span>{ this.state.manager }</span></h5></li>
              </ul></div></div></div></div></div>
        
        <div class="header-bottom">
				<div class="container">
					<div class="row">


						<div class="megamenu-hori header-bottom-right  col-md-12 col-sm-11 col-xs-12 ">
							<div class="responsive so-megamenu "><div class="navbar-default"><div class=" container-megamenu  horizontal"><div class="megamenu-wrapper"><div class="megamenu-pattern"><div class="container">
                  <ul class="megamenu " data-transition="slide" data-animationtime="250">
                
                    <li class="">
                      <p class="close-menu"></p>
                        <button class="addToCart btn btn-default " onClick = {()=>this.chooseMall()}>拍卖商城</button>
                        <span class="label"></span>
                    </li>

                    <li class="">
                      <p class="close-menu"></p>
                        <button class="addToCart btn btn-default " onClick = {()=>this.choosewareHouse()}>我的生产</button>
                        <span class="label"></span>
                    </li>

                    <li class="">
                      <p class="close-menu"></p>
                        <button class="addToCart btn btn-default " onClick = {()=>this.chooseInMint()}>我的商店</button>
                        <span class="label"></span>
                    </li>

                    <li class="">
                      <p class="close-menu"></p>
                        <button class="addToCart btn btn-default " onClick = {()=>this.chooseNFT()}>我的仓库</button>
                        <span class="label"></span>
                    </li>

                    <li class="">
                      <p class="close-menu"></p>
                        <button class="addToCart btn btn-default " onClick = {()=>this.chooseMint()}>铸造NFT</button>
                        <span class="label"></span>
                    </li>
                    
                  </ul></div></div></div></div></div></div></div></div></div></div>

        {
          this.state.mintButton &&
          <div>
            <div class="button-group" align="center">
              <input align="center" class="addToCart btn btn-default " align = "center" type='file' ref="fileid" onChange={() => this.upload(this.refs.fileid.files[0])}/><nobr />
              <button  onClick={()=>this.mint("xxx")} class="addToCart btn btn-default " weight="200px">开始铸造</button>
            </div>
            {
              this.state.hash &&
              <div align="center">
                <img src={"http://localhost:8080/ipfs/" + this.state.hash} alt={true} height={200} weight={200}/>
              </div>
            }
          </div>
        }

        {
          this.state.wareHouse &&
          <div>
            <h1 align = "center">我的生产</h1>
            <div id="content" class="col-md-12 col-sm-10 type-1">
              <div class="products-list grid">
                {this.mineMintShow()}
              </div></div>
          </div>
        }

        {
          this.state.inMintButton &&
          <div>
            <h1 align = "center">我的商店</h1>
            <div id="content" class="col-md-12 col-sm-10 type-1">
              <div class="products-list grid">
                {this.mineInAuctionShow()}
              </div></div>
          </div>
        }

        {
          this.state.NFTButton &&
          <div>
            <h2 align = "center">我的仓库</h2>
            <div id="content" class="col-md-12 col-sm-10 type-1">
              <div class="products-list grid">
                {this.mineNFTShow()}
              </div></div>
          </div>
        }

        {
          this.state.shopMall && <div>
            <h1 align = "center">拍卖商城</h1>
            <div id="content" class="col-md-12 col-sm-10 type-1">
              <div class="products-list grid">
                {this.auctionShow()}
          </div></div></div>
        }

        {
          this.state.auctionMes && this.auctionMesShow()
        }

        {
          this.state.isAuction &&
          <div>
            <h3 align="center">NFT流转纪录</h3>
            <table align="center" border="2" cellpadding="10" cellspacing="10">
              <tr>
              <th>持有者</th>
              <th>价格</th>
              <th>时间</th>
              </tr>
            {
              this.RecordShow()
            }
            </table>
            <div align= "center" class="button-group" >
              起始价：<input type='number' class="addToCart btn btn-default " ref={(input)=>{this.priceInput = input}} />
              拍卖时间(秒)：<input type='number' class="addToCart btn btn-default " ref={(input)=>{this.timeInput = input}} />
              <nobr />
                <button  onClick={()=>this.auctionRelease()} class="addToCart btn btn-default ">发起拍卖</button>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;
