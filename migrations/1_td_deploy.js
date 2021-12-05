const Str = require('@supercharge/strings');
const { someLimit } = require('async');
// const BigNumber = require('bignumber.js');

var TDErc20 = artifacts.require("ERC20TD.sol");
var evaluator = artifacts.require("Evaluator.sol");
var ExerciceSolution = artifacts.require("ExerciceSolution.sol");


module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await deployTDToken(deployer, network, accounts); 
        await deployEvaluator(deployer, network, accounts); 
        await deployRecap(deployer, network, accounts); 
		await setPermissionsAndRandomValues(deployer, network, accounts); 

		await deployExs(deployer, network, accounts);
    });
};

async function deployTDToken(deployer, network, accounts) {
	TDToken = await TDErc20.new("TD-ERC721-101","TD-ERC721-101",web3.utils.toBN("0"))
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.new(TDToken.address)
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
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
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("Evaluator " + Evaluator.address)
}

async function deployExs(deployer, network, accounts) {

	// Comment before RingBy
	await Evaluator.sendTransaction({from: accounts[0], value: web3.utils.toWei('1', 'ether')})
	
	solution = await ExerciceSolution.new("WoWW", "WoWW");
	solution.declareAnimalFor(Evaluator.address, 0, 5, true, "truc")

	//solution.transferFrom(accounts[0], Evaluator.address, 1)
	//console.log(solution.balanceOf(Evaluator.address))

	await Evaluator.submitExercice(solution.address);
	await Evaluator.ex1_testERC721();

	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex1 Balance " + getBalance.toString());

	// EX2
	//solution.declareAnimalFrom(Evaluator.address, 0, 5, true, "truc")

	randomName = randomNames[0]
	randomLeg = randomLegs[0]
	randomSex = randomSex[0]
	randomWing = randomWings[0]

	solution.declareAnimalFor(Evaluator.address, randomSex, randomLeg, randomWing, randomName)

	await Evaluator.ex2a_getAnimalToCreateAttributes();
	console.log("Ex2a Passed " + getBalance.toString());


	await Evaluator.ex2b_testDeclaredAnimal(2);
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

	solution.declareAnimalFor(accounts[0], randomSex, randomLeg, randomWing, randomName);
	

	// EX6b
	await Evaluator.ex6b_auctionAnimal_buy(3);
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex6b Balance " + getBalance.toString());

	/* EX7a
	await Evaluator.ex6a_auctionAnimal_offer();
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex5 Balance " + getBalance.toString());

	// EX7b
	await Evaluator.ex6a_auctionAnimal_offer();
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex5 Balance " + getBalance.toString());

	// EX7c
	await Evaluator.ex6a_auctionAnimal_offer();
	getBalance = await TDToken.balanceOf(accounts[0]);
	console.log("Ex5 Balance " + getBalance.toString());*/
}

