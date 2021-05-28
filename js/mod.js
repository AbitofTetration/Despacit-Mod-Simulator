let modInfo = {
	name: "Despacit Mod Simulator",
	id: "despacits",
	author: "",
	pointsName: "despacit power",
	discordName: "",
	discordLink: "",
	initialStartPoints: new ExpantaNum (10), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "Modding the World",
}

let changelog = `<h1>Changelog:</h1><br>
	I'm never using this lol`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return hasUpgrade("p", 11)
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new ExpantaNum(0)

	let gain = new ExpantaNum(1)
  if (hasUpgrade("p", 12)) gain = gain.mul(upgradeEffect("p", 12))
  if (hasUpgrade("p", 13)) gain = gain.mul(upgradeEffect("p", 13))
  if (hasUpgrade("p", 31)) gain = gain.mul(upgradeEffect("p", 31))
  if (hasUpgrade("p", 14)) gain = gain.pow(1.5)
  if (hasUpgrade("p", 34)) gain = gain.pow(1.3)
  if (hasUpgrade("m", 31)) gain = gain.mul(upgradeEffect("m", 31))
  if (challengeCompletions("d", 12)>=1) gain = gain.pow(challengeEffect("d", 11))
  if (inChallenge("d", 11)) gain = gain.root(layers.d.challenges[11].nerf())
  if (inChallenge("d", 12)) gain = gain.root(layers.d.challenges[12].nerf())
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return false
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}