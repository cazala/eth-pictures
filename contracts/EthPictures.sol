pragma solidity ^0.5.0;

import '@openzeppelin/upgrades/contracts/Initializable.sol';
import '@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/ERC721Full.sol';
import "@openzeppelin/contracts-ethereum-package/contracts/drafts/Counters.sol";

contract EthPictures is Initializable, ERC721Full {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  function initialize() public initializer {
    ERC721.initialize();
    ERC721Enumerable.initialize();
    ERC721Metadata.initialize("eth.pictures", "PIC");
  }

  function mint(address to, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}