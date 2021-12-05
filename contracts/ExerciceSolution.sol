pragma solidity >=0.6.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ExerciceSolution is ERC721 {
    constructor(string memory name_, string memory symbol_) public ERC721(name_, symbol_){}

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct animals{
        uint sex;
        uint legs;
        bool wings;
        string name;
    }
    mapping(uint256 => animals) public animalCharacteristic;


    function createFirstToken(address to) external returns (bool)
    {   
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);

        return true;
    } 

	//function isBreeder(address account) external returns (bool);

	//function registrationPrice() external returns (uint256);

	//function registerMeAsBreeder() external payable;

	function declareAnimal(uint sex, uint legs, bool wings, string calldata name) external returns (uint256)
    {
        
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);

        animals memory newAnimal = animals(sex, legs, wings, name);
        animalCharacteristic[newItemId] = newAnimal;

        return newItemId;
    }


	function getAnimalCharacteristics(uint animalNumber) external returns (string memory _name, bool _wings, uint _legs, uint _sex)
    {
        uint sex = animalCharacteristic[animalNumber].sex;
        uint legs = animalCharacteristic[animalNumber].legs;
        bool wings = animalCharacteristic[animalNumber].wings;
        string memory name = animalCharacteristic[animalNumber].name;
        return (name, wings, legs, sex);
    }

	//function declareDeadAnimal(uint animalNumber) external;

	//function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256);

	//function isAnimalForSale(uint animalNumber) external view returns (bool);

	//function animalPrice(uint animalNumber) external view returns (uint256);

	//function buyAnimal(uint animalNumber) external payable;

	//function offerForSale(uint animalNumber, uint price) external;
}