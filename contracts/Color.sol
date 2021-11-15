pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Color is ERC721 {
    uint public cap = 999;
    uint public mintedCount;
    string[] public colors;
    mapping(string => bool) public colorExists;

    event newColorMinted(string _color);

    constructor() ERC721('Color', 'COLOR') {}

    function mint(string memory _color) public payable {
        mintedCount++;
        require(msg.value == 1000000000000000, "One color token is 100 Wei");
        require(!colorExists[_color], "This Color already exists");
        require(mintedCount <= cap, "All Color are minted");
        colorExists[_color] = true;
        colors.push(_color);
        _safeMint(msg.sender, mintedCount);
        emit newColorMinted(_color);
    }
}