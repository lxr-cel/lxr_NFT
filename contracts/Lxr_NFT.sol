//SPDX-License-Identifier: GPL-3.0
pragma solidity 0.5.16;

contract lxr_NFT{

    uint256 tokenId; 
    uint256 auctionId;
    uint256 auctionNum;

    struct Token {
        address minter;
        address owner;
        uint256 lastAuctionId;
        uint256 currentPrice;
        bool isAuction;
        uint256 ownerNum;
        address[100] ownersAddress;
        uint256[100] totalPrice;
        uint256[100] totalTime;
        string URI;
    }

    struct Auction {
        address seller;
	    uint256 price;
        uint128 bidNum;
        uint256 tokenIdInAuction;
        uint256 startTime;
        uint256 endTime;
        uint256 highestBid;
        address highestBidder;
        address[100] bidderAddress;
        uint256[100] bidPrice;
        uint256[100] time;
        bool active;
    }

    mapping (uint256 => Token) public tokenSets;  //所有的代币集合
    mapping (uint256 => Auction) public AuctionSets;  //所有的拍卖集合
    mapping (string => bool) public isTokenOrNot;   //判断这个UPI是否已存在
    mapping (address => uint256) public mintNum;   //自己铸造的NFT数目
    mapping (address => uint256) public inAuctionNum;   //正在拍卖的NFT数目
    mapping (address => uint256) public tokenNum;   //自己持有的NFT数目


    constructor () public {}

    function myMint(string memory _URI) public returns (uint256)
    {
        require(!isTokenOrNot[_URI]);
        
        isTokenOrNot[_URI] = true;
        
        uint256[100] memory zero;
        address[100] memory addZero;

        tokenId++;
        uint256 currentId = tokenId;
        Token memory token = 
            Token({
                minter: msg.sender,
                owner: msg.sender,
                lastAuctionId: 0,
                currentPrice: 0,
                isAuction: false,
                ownerNum: 1,
                ownersAddress: addZero,
                totalPrice: zero,
                totalTime: zero,
                URI: _URI
            });
        
        token.ownersAddress[0] = msg.sender;
        token.totalTime[0] = block.timestamp;
        mintNum[msg.sender]++;
        tokenSets[currentId] = token;
        return currentId;
    }

    function myAuctionRelease (uint256 biddingTime, uint256 Id, uint128 _price) public payable 
    {
        require(exists(Id), "There isn't the NTF.");
        require(msg.sender == ownerOf(Id), "Only the owner of this token can publish the auction");
        require(!tokenSets[Id].isAuction, "There is an auction already");

        if(tokenSets[Id].lastAuctionId == 0) mintNum[msg.sender]--;
        else tokenNum[msg.sender]--;

        auctionId ++;
        auctionNum ++;

        uint256 currentId = auctionId;

        uint256[100] memory zeroSets;
        address[100] memory addZeroSets;

        Auction memory auction = 
            Auction({
                seller: msg.sender, 
                price: _price, 
                bidNum: 0,
                tokenIdInAuction: Id, 
                startTime: block.timestamp,
                endTime: block.timestamp + biddingTime,
                highestBid: _price,
                highestBidder: msg.sender,
                active: true,
                bidderAddress: addZeroSets,
                bidPrice: zeroSets,
                time: zeroSets
            });

        inAuctionNum[auction.seller] ++;
        AuctionSets[currentId] = auction;
        tokenSets[Id].lastAuctionId = currentId;
        tokenSets[Id].isAuction = true;
    }

    function myBid (uint256 Id)public payable 
    {
        require(exists(Id),"There isn't the NTF.");
        require(tokenSets[Id].isAuction);

        uint256 aucId = tokenSets[Id].lastAuctionId;

        require(block.timestamp <= AuctionSets[aucId].endTime, "Auction already ended.");
        require(msg.value > AuctionSets[aucId].highestBid, "There already is a higher bid");
        
        if(AuctionSets[aucId].bidNum != 0)
            address(uint160(AuctionSets[aucId].highestBidder)).transfer(AuctionSets[aucId].highestBid);

        AuctionSets[aucId].highestBidder = msg.sender;
        AuctionSets[aucId].highestBid = msg.value;
        AuctionSets[aucId].bidderAddress[AuctionSets[aucId].bidNum] = msg.sender;
        AuctionSets[aucId].bidPrice[AuctionSets[aucId].bidNum] = msg.value;
        AuctionSets[aucId].time[AuctionSets[aucId].bidNum] = block.timestamp;
        AuctionSets[aucId].bidNum ++;
    }

    function getOwnerNum (uint256 Id) public view returns (uint256)
    {
        return tokenSets[Id].ownerNum;
    }

    function getTotalPrice (uint256 Id) public view returns (uint256[100] memory)
    {
        return tokenSets[Id].totalPrice;
    }

    function getTotalTime (uint256 Id) public view returns (uint256[100] memory)
    {
        return tokenSets[Id].totalTime;
    }

    function getOwnersAddress (uint256 Id) public view returns (address[100] memory)
    {
        return tokenSets[Id].ownersAddress;
    }

    function getBidNum (uint256 Id) public view returns (uint256)
    {
        uint256 aucId = tokenSets[Id].lastAuctionId;
        return AuctionSets[aucId].bidNum;
    }

    function getSeller (uint256 Id) public view returns (address)
    {
        uint256 aucId = tokenSets[Id].lastAuctionId;
        return AuctionSets[aucId].seller;
    }

    function getStartTime (uint256 Id) public view returns (uint256)
    {
        uint256 aucId = tokenSets[Id].lastAuctionId;
        return AuctionSets[aucId].startTime;
    }

    function getEndTime (uint256 Id) public view returns (uint256)
    {
        uint256 aucId = tokenSets[Id].lastAuctionId;
        return AuctionSets[aucId].endTime;
    }

    function getBid (uint256 Id) public view returns (uint256[100] memory)
    {
        uint256 aucId = tokenSets[Id].lastAuctionId;
        return AuctionSets[aucId].bidPrice;
    }

    function getBidTime (uint256 Id) public view returns (uint256[100] memory)
    {
        uint256 aucId = tokenSets[Id].lastAuctionId;
        return AuctionSets[aucId].time;
    }

    function getBidderAddress (uint256 Id) public view returns (address[100] memory)
    {
        uint256 aucId = tokenSets[Id].lastAuctionId;
        return AuctionSets[aucId].bidderAddress;
    }

    function getMint (address add) public view returns (uint256[100] memory)
    {
        uint256[100] memory ret;
        uint j = 0;
        for(uint256 i = 1;i <= tokenId;i++)
        {
            if(tokenSets[i].minter == add && tokenSets[i].lastAuctionId == 0)
                ret[j++] = i;
        }
        return ret;
    }

    function getMintNum (address add) public view returns (uint256)
    {
        return mintNum[add];
    }

    function getInAuction (address add) public view returns (uint256[100] memory)
    {
        uint256[100] memory ret;
        uint j = 0;
        for(uint256 i = 1;i <= tokenId;i++)
        {
            if(tokenSets[i].owner == add && tokenSets[i].isAuction)
                ret[j++] = i;
        }
        return ret;
    }

    function getInAuctionNum (address add) public view returns (uint256)
    {
        return inAuctionNum[add];
    }

    function getToken (address add) public view returns (uint256[100] memory)
    {
        uint256[100] memory ret;
        uint j = 0;
        for(uint256 i = 1;i <= tokenId;i++)
        {
            if(tokenSets[i].owner == add && tokenSets[i].lastAuctionId != 0 && !tokenSets[i].isAuction)
                ret[j++] = i;
        }
        return ret;
    }

    function getTokenNum (address add) public view returns (uint256)
    {
        return tokenNum[add];
    }

    function getAuction () public view returns (uint256[100] memory)
    {
        uint256[100] memory ret;
        uint j = 0;
        for(uint256 i = 1;i <= tokenId;i++)
        {
            if(tokenSets[i].isAuction)
                ret[j++] = i;
        }
        return ret;
    }

    function getAuctionNum () public view returns (uint256)
    {
        return auctionNum;
    }

    function getHighestBidder (uint256 Id) public view returns (address)
    {
        uint256 aucId = tokenSets[Id].lastAuctionId;
        return AuctionSets[aucId].highestBidder;
    }

    function getHighestBid (uint256 Id) public view returns (uint256)
    {
        uint256 aucId = tokenSets[Id].lastAuctionId;
        return AuctionSets[aucId].highestBid;
    }

    function tokenTransfer (uint256 Id) public payable
    {
        uint256 aucId = tokenSets[Id].lastAuctionId;
        require(block.timestamp > AuctionSets[aucId].endTime, "Auction not yet ended.");
        require(AuctionSets[aucId].active,"The auctionEnd has already been called.");
        require(AuctionSets[aucId].highestBidder == msg.sender);

        AuctionSets[aucId].active = false;
        inAuctionNum[AuctionSets[aucId].seller] --;
        tokenSets[Id].isAuction = false;
        auctionNum--;
        if(AuctionSets[aucId].bidNum == 0)
        {
            tokenNum[msg.sender]++;
        }
        else
        {
            tokenNum[msg.sender] ++;
            address(uint160(AuctionSets[aucId].seller)).transfer(AuctionSets[aucId].highestBid);

            tokenSets[Id].owner = AuctionSets[aucId].highestBidder;
            tokenSets[Id].currentPrice = AuctionSets[aucId].highestBid;
            tokenSets[Id].ownersAddress[tokenSets[Id].ownerNum] = AuctionSets[aucId].highestBidder;
            tokenSets[Id].totalPrice[tokenSets[Id].ownerNum] = AuctionSets[aucId].highestBid;
            tokenSets[Id].totalTime[tokenSets[Id].ownerNum] = block.timestamp;
            tokenSets[Id].ownerNum ++;
        }
    }

    function getURI(uint256 Id) public view returns (string memory) //获取该tokenId对应的URI
    {
        require(exists(Id), "There isn't the NTF.");

        string memory x;
        x = tokenSets[Id].URI;
        return x;
    }

    function exists(uint256 Id) public view returns (bool) //判断Id是否有对应的代币
    {
        if(Id <= tokenId)
            return true;
        else
            return false;
    }

    function ownerOf(uint256 Id)public view returns (address)  // 获取该Id对应的代币的拥有者
    {
        address ret = tokenSets[Id].owner;
        return ret;
    }

}