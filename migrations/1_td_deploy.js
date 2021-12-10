const Str = require('@supercharge/strings');
const { someLimit } = require('async');
// const BigNumber = require('bignumber.js');

var TDErc20 = artifacts.require("ERC20TD.sol");
var evaluator = artifacts.require("Evaluator.sol");
var evaluator2 = artifacts.require("Evaluator2.sol");
var ExerciceSolution = artifacts.require("ExerciceSolution.sol");

const network = "ganache"

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
		if (network == "ganache")
		{
			await deployTDToken(deployer, network, accounts); 
			await deployEvaluator(deployer, network, accounts); 
			await deployRecap(deployer, network, accounts); 
			await setPermissionsAndRandomValues(deployer, network, accounts); 
		}
		else if (network == "rinkeby")
		{
			await hardcodeContractAddress(deployer, network, accounts)
		}

		await deployExs(deployer, network, accounts);
    });
};

async function hardcodeContractAddress(deployer, network, accounts) {
	TDToken = await TDErc20.at("0x8B7441Cb0449c71B09B96199cCE660635dE49A1D")
	Evaluator = await evaluator.at("0xa0b9f62A0dC5cCc21cfB71BA70070C3E1C66510E")
	Evaluator2 = await evaluator2.at("0x4f82f7A130821F61931C7675A40fab723b70d1B8")

}

async function deployTDToken(deployer, network, accounts) {
	TDToken = await TDErc20.new("TD-ERC721-101","TD-ERC721-101",web3.utils.toBN("0"))
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.new(TDToken.address)
	Evaluator2 = await evaluator2.new(TDToken.address)
	await Evaluator.sendTransaction({from: accounts[0], value: web3.utils.toWei('1', 'ether')})
	await Evaluator2.sendTransaction({from: accounts[0], value: web3.utils.toWei('1', 'ether')})
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
	await TDToken.setTeacher(Evaluator2.address, true)
	randomNames = []
	randomLegs = []
	randomSex = []
	randomWings = []
	for (i = 0; i < 20; i++)
		{
		randomNames.push(Str.random(15))
		randomLegs.push(Math.floor(Math.random()*1000000000))
		randomSex.push(Math.floor(Math.random()*2))
		randomWings.push(Math.floor(Math.random()*2))
		// randomTickers.push(web3.utils.utf8ToBytes(Str.random(5)))
		// randomTickers.push(Str.random(5))
		}

	console.log(randomNames)
	console.log(randomLegs)
	console.log(randomSex)
	console.log(randomWings)
	// console.log(web3.utils)
	// console.log(type(Str.random(5)0)
	await Evaluator.setRandomValuesStore(randomNames, randomLegs, randomSex, randomWings);
	await Evaluator2.setRandomValuesStore(randomNames, randomLegs, randomSex, randomWings);
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("Evaluator " + Evaluator.address)
}

async function deployExs(deployer, network, accounts) {


	Solution = await ExerciceSolution.new("WoWW", "WoWW");

	await Evaluator.submitExercice(Solution.address);

	console.log(accounts[0])
	console.log(Evaluator.address)
	console.log(Solution.address)

	// EX1
	await Solution.declareAnimalFor(Evaluator.address, 0, 5, true, "ouooo");
	anim1 = await Solution.getCurrentId();

	await Evaluator.ex1_testERC721();
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex1 Balance " + getBalance.toString());

	// EX2a
	await Evaluator.ex2a_getAnimalToCreateAttributes();

	const Name = await Evaluator.readName(accounts[0]);
	const Legs = await Evaluator.readLegs(accounts[0]);
	const Sex = await Evaluator.readSex(accounts[0]);
	const Wing = await Evaluator.readWings(accounts[0]);

	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex2a Passed " + getBalance.toString());

	// EX2b
	console.log(Sex, Legs, Wing, Name)
	await Solution.declareAnimalFor(Evaluator.address, Sex, Legs, Wing, Name);
	anim2 = await Solution.getCurrentId();

	await Evaluator.ex2b_testDeclaredAnimal(anim2);
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex2b Balance " + getBalance.toString());

	// EX3
	await Evaluator.ex3_testRegisterBreeder();
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex3 Balance " + getBalance.toString());

	// EX4
	await Evaluator.ex4_testDeclareAnimal();
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex4 Balance " + getBalance.toString());

	// EX5
	await Evaluator.ex5_declareDeadAnimal();
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex5 Balance " + getBalance.toString());
	
	// EX6a
	await Evaluator.ex6a_auctionAnimal_offer();
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex6a Balance " + getBalance.toString());
	
	// EX6b

	await Solution.declareAnimal(Sex, Legs, Wing, Name)
	price6b = await Solution.getCurrentId();

	price = await Solution.animalPrice(price6b)
	await Solution.offerForSale(price6b, web3.utils.toWei('0.000001', 'ether'));

	await Evaluator.ex6b_auctionAnimal_buy(price6b);
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex6b Balance " + getBalance.toString());
	

	// EX7

	await web3.eth.sendTransaction({from:accounts[0],to:Evaluator2.address, value:web3.utils.toBN(web3.utils.toWei('0.005', "ether"))});
	await Evaluator2.submitExercice(Solution.address)

	await Evaluator2.ex2a_getAnimalToCreateAttributes()
	await Solution.registerAsBreeder(Evaluator2.address)


	await Solution.declareAnimalFor(accounts[0], Sex, Legs, Wing, Name);

	// EX7a
	await Solution.declareAnimalFor(Evaluator2.address, Sex, Legs, Wing, Name)
	parent1 = await Solution.getCurrentId();

	await Solution.declareAnimalFor(Evaluator2.address, Sex, Legs, Wing, Name)
	parent2 = await Solution.getCurrentId();

	await Evaluator2.ex7a_breedAnimalWithParents(parent1, parent2, {from: accounts[0]});
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex7a Balance " + getBalance.toString());

	// EX7b
	await Evaluator2.ex7b_offerAnimalForReproduction();
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex7b Balance " + getBalance.toString());

	// EX7c
	await Solution.declareAnimal(Sex, Legs, Wing, Name)
	await Solution.declareAnimalFor(accounts[0], Sex, Legs, Wing, Name);
	goReprod = await Solution.getCurrentId();

	await Solution.offerForReproduction(goReprod, web3.utils.toBN(1000000));

	await Evaluator2.ex7c_payForReproduction(goReprod);
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex7c Balance " + getBalance.toString());
}