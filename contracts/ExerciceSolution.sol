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
        bool isForSale;
        uint price;
        uint parent1;
        uint parent2;
    }
    mapping(uint256 => animals) public animalCharacteristic;
    mapping(address => uint256) public registeredBreeder;

    modifier onlyAnimalBreeder(uint256 animalNumber) { 
        require (ownerOf(animalNumber) == msg.sender);
        _;
    }

    modifier onlyAnimalForSale(uint256 animalNumber) { 
        require (animalCharacteristic[animalNumber].isForSale == true);
        _;
    }

    function getCurrentId() external view returns (uint256) 
    {
        return _tokenIds.current();
    }

	function isBreeder(address account) external returns (bool)
    {
        if (registeredBreeder[account] == 1){
            return true;
        }
        return false;
    }

	function registrationPrice() external returns (uint256)
    {
        return 50000;
    }

	function registerMeAsBreeder() external payable
    {   
        registeredBreeder[msg.sender] = 1;
    }

	function declareAnimalFor(address to,uint sex, uint legs, bool wings, string calldata name) external returns (uint256)
    {
        
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);

        animals memory newAnimal = animals(sex, legs, wings, name, false, 0);
        animalCharacteristic[newItemId] = newAnimal;

        return newItemId;
    }

	function declareAnimal(uint sex, uint legs, bool wings, string calldata name) external returns (uint256)
    {
        
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);

        animals memory newAnimal = animals(sex, legs, wings, name, false, 0);
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

    function declareDeadAnimal(uint animalNumber) external onlyAnimalBreeder(animalNumber)
    {
        _burn(animalNumber);
        delete animalCharacteristic[animalNumber];
    }

	//function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)
    //{return 1;}

	function isAnimalForSale(uint animalNumber) external view returns (bool)
    {
        return animalCharacteristic[animalNumber].isForSale;
    }

	function animalPrice(uint animalNumber) external view returns (uint)
    {
        return animalCharacteristic[animalNumber].price;
    }

	function buyAnimal(uint animalNumber) external payable onlyAnimalForSale(animalNumber)
    {
        require(msg.value >= animalCharacteristic[animalNumber].price);
        _transfer(ownerOf(animalNumber), msg.sender, animalNumber);

        animalCharacteristic[animalNumber].isForSale = false;
        animalCharacteristic[animalNumber].price = 0;
    }

	function offerForSale(uint animalNumber, uint price) external onlyAnimalBreeder(animalNumber)
    {
        animalCharacteristic[animalNumber].isForSale = true;
        animalCharacteristic[animalNumber].price = price;
    }

	function approve2(uint animalNumber, address buyer) external onlyAnimalBreeder(animalNumber)
    {
        approve(buyer, animalNumber);
    }



    
    // Reproduction functions

    //function declareAnimalWithParents(uint sex, uint legs, bool wings, string calldata name, uint parent1, uint parent2) external returns (uint256);

	//function getParents(uint animalNumber) external returns (uint256, uint256);

	//function canReproduce(uint animalNumber) external returns (bool);

	//function reproductionPrice(uint animalNumber) external view returns (uint256);

	//function offerForReproduction(uint animalNumber, uint priceOfReproduction) external returns (uint256);

	//function authorizedBreederToReproduce(uint animalNumber) external returns (address);

	//function payForReproduction(uint animalNumber) external payable;
}