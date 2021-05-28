addLayer("p", {
    name: "progress", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "#4BDC13",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "progress points", // Name of prestige currency
    baseResource: "despacit power", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
        softcap: new ExpantaNum(1e500), 
        softcapPower: new ExpantaNum(0.002), 
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if (hasUpgrade("p", 15)) mult = mult.mul(2)
        if (hasUpgrade("p", 21)) mult = mult.mul(upgradeEffect("p", 21))
        if (player.d.unlocked) mult = mult.mul(layers.d.effect())
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        mult = new ExpantaNum(1)
        if (hasUpgrade("p", 23)) mult = mult.mul(1.3)
        if (hasUpgrade("p", 33)) mult = mult.mul(1.1)
        if (hasUpgrade("p", 35)) mult = mult.mul(1.02)
        if (inChallenge("d", 11)) mult = mult.div(layers.d.challenges[11].nerf())
        if (challengeCompletions("d", 11)>=1) mult = mult.mul(challengeEffect("d", 11))
        return mult
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for progress points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    passiveGeneration() {
      if (!hasMilestone("d", 1)) {
        return 0
      } else {
        return 0.5
      }
    },
    doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
        if (!hasMilestone("d", 0)) {
          if(layers[resettingLayer].row > this.row) layerDataReset(this.layer, []) // This is actually the default behavior
        } else if (hasMilestone("d", 0)) {
          if(layers[resettingLayer].row > this.row) layerDataReset(this.layer, ["upgrades"]) // This is actually the default behavior
        }
    },
        upgrades: {
            11: {
                title: "Become Despacit",
                description: "Gain 1 despacit power every second.",
                cost: new ExpantaNum(1),
                unlocked() { return player[this.layer].unlocked }, // The upgrade is only visible when this is true
            },
            12: {
                title: "Making Progress",
                description: "Multiply despacit power gain based on progress points.",
                cost: new ExpantaNum(1),
                effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player[this.layer].points.add(1)
                    if (hasUpgrade("p", 22)) ret = ret.pow(1.2)
                    ret = ret.add(1).tetrate(0.5)
                    return ret
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
                unlocked() { return hasUpgrade("p", 11) }, // The upgrade is only visible when this is true
            },
            13: {
                title: "Doing Better",
                description: "Multiply despacit power gain based on itself.",
                cost: new ExpantaNum(5),
                effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player.points.add(1).log10().add(1)
                    return ret
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
                unlocked() { return hasUpgrade("p", 12) }, // The upgrade is only visible when this is true
            },
            14: {
                title: "Slightly More Despacit",
                description: "Raise despacit power gain to the 1.5th power.",
                cost: new ExpantaNum(10),
                unlocked() { return hasUpgrade("p", 13) }, // The upgrade is only visible when this is true
            },
            15: {
                title: "Learn to Code",
                description: "Double progress power gain.",
                cost: new ExpantaNum(20),
                unlocked() { return hasUpgrade("p", 14) }, // The upgrade is only visible when this is true
            },
            21: {
                title: "Better Schedule",
                description: "Multiply progress point gain based on despacit power.",
                cost: new ExpantaNum(75),
                effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player.points.add(1).log10().add(1).log10().add(1)
                    if (hasUpgrade("p", 24)) ret = ret.pow(2)
                    return ret
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
                unlocked() { return hasUpgrade("p", 15) }, // The upgrade is only visible when this is true
            },
            22: {
                title: "Better Coding Etiquette",
                description: "Raise <b>Making Progress</b>'s effect to the 1.2th power.",
                cost: new ExpantaNum(125),
                unlocked() { return hasUpgrade("p", 21) }, // The upgrade is only visible when this is true
            },
            23: {
                title: "Rebalancing",
                description: "Raise progress point gain to the 1.3th power.",
                cost: new ExpantaNum(200),
                unlocked() { return hasUpgrade("p", 22) }, // The upgrade is only visible when this is true
            },
            24: {
                title: "Learn Better Coding",
                description: "Square <b>Better Schedule</b>.",
                cost: new ExpantaNum(2e3),
                unlocked() { return hasUpgrade("p", 23) }, // The upgrade is only visible when this is true
            },
            25: {
                title: "Demotivization",
                description: "Unlock Unfinished Despacit Mods.",
                cost: new ExpantaNum(1e4),
                unlocked() { return hasUpgrade("p", 24) }, // The upgrade is only visible when this is true
            },
            31: {
                title: "Gain more despacit power",
                description: "Multiply despacit power gain based on unfinished despacit mods.",
                cost: new ExpantaNum(1e8),
                effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player.d.points.add(1).pow(3)
                    return ret
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
                unlocked() { return player.d.unlocked && hasUpgrade("p", 25) }, // The upgrade is only visible when this is true
            },
            32: {
                title: "Become more despacit",
                description: "Divide unfinished despacit mod cost based on progress upgrades.",
                cost: new ExpantaNum(1e18),
                effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = ExpantaNum.pow(3, player[this.layer].upgrades.length)
                    return ret
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
                unlocked() { return hasMilestone("d", 0) && hasUpgrade("p", 31) }, // The upgrade is only visible when this is true
            },
            33: {
                title: "OmegaNum",
                description: "Raise Progress Point gain to the 1.1th power.",
                cost: new ExpantaNum(5e26),
                unlocked() { return hasMilestone("d", 0) && hasUpgrade("p", 32) }, // The upgrade is only visible when this is true
            },
            34: {
                title: "Despacit Effect",
                description: "Raise Despacit Power gain to the 1.3th power.",
                cost: new ExpantaNum(1e38),
                unlocked() { return hasMilestone("d", 0) && hasUpgrade("p", 33) }, // The upgrade is only visible when this is true
            },
            35: {
                title: "Criticism",
                description: "Raise Progress Point gain to the 1.02th power.",
                cost: new ExpantaNum(1e38),
                unlocked() { return hasMilestone("d", 1) && hasUpgrade("p", 34) }, // The upgrade is only visible when this is true
            },
        },
    layerShown(){return true}
})


addLayer("d", {
    name: "despacit", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
		best: new ExpantaNum(0),
    }},
    color: "#5acc8d",
    effect() {
        return ExpantaNum.pow(5, player[this.layer].points)
    },
    effectDescription() { // Optional text to describe the effects
        eff = this.effect();
        return "which are multiplying progress points by "+format(eff)+"x."
    },
    requires: new ExpantaNum(1e4), // Can be a function that takes requirement increases into account
    resource: "unfinished despacit mods", // Name of prestige currency
    baseResource: "progress points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 2, // Prestige currency exponent
    base: 5,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if (hasUpgrade("p", 32)) mult = mult.div(upgradeEffect("p", 32))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        mult = new ExpantaNum(1)
        if (player.m.unlocked) mult = mult.mul(layers.m.getTreesEffect())
        return mult
    },
    canBuyMax() {
      if (hasMilestone("d", 3)) return true
      else return false
    },
    autoPrestige() {
      if (hasMilestone("d", 4)) return true
      else return false
    },
    resetsNothing() {
      if (hasMilestone("d", 4)) return true
      else return false
    },
    milestones: {
        0: {requirementDescription: "6 unfinished despacit mods",
            done() {return player[this.layer].best.gte(6)}, // Used to determine when to give the milestone
            effectDescription: "You don't lose upgrades when you perform any reset.",
        },
        1: {requirementDescription: "12 unfinished despacit mods",
            done() {return player[this.layer].best.gte(12)}, // Used to determine when to give the milestone
            effectDescription: "Automatically gain 50% of progress points on reset per second.",
        },
        2: {requirementDescription: "17 unfinished despacit mods",
            done() {return player[this.layer].best.gte(17)}, // Used to determine when to give the milestone
            effectDescription: "Unlock Despacit Challenges.",
        },
        3: {requirementDescription: "35 unfinished despacit mods",
            done() {return player[this.layer].best.gte(35)}, // Used to determine when to give the milestone
            effectDescription: "You can max buy unfinished despacit mods.",
        },
        4: {requirementDescription: "1e100 unfinished despacit mods",
            done() {return player[this.layer].best.gte(1e100)}, // Used to determine when to give the milestone
            effectDescription: "Automate unfinished despacit mod gain, and unfinished despacit mods no longer reset anything.",
        },
    },
    challenges: {
		  11: {
            name: "Softcap",
            completionLimit: 50,
			      challengeDescription() {return "Reduces despacit power and progress points to the "+format(this.nerf())+"th root<br>"+challengeCompletions(this.layer, this.id) + "/" + this.completionLimit + " completions"},
            unlocked() { return hasMilestone("d", 2) },
            nerf() {
              let nerf = new ExpantaNum(challengeCompletions(this.layer, this.id)).add(1)
              nerf = ExpantaNum.pow(1.04, nerf)
              return nerf
            },
            goalDescription() {return 'Reach '+format(1e100)+' progress points'},
            canComplete() {
                return player.p.points.gte(1e100)
            },
            rewardEffect() {
                let ret = new ExpantaNum(challengeCompletions(this.layer, this.id)).div(50).add(1)
                return ret;
            },
            rewardDescription() {return "Your "+format(challengeCompletions(this.layer, this.id))+" completions raise progress point gain"},
            rewardDisplay() { return "^"+format(this.rewardEffect()) },

      },
		  12: {
            name: "Tetration",
            completionLimit: 50,
			      challengeDescription() {return "Reduces despacit power to the "+format(this.nerf())+"th root<br>"+challengeCompletions(this.layer, this.id) + "/" + this.completionLimit + " completions"},
            unlocked() { return hasMilestone("d", 2) },
            nerf() {
              let nerf = new ExpantaNum(challengeCompletions(this.layer, this.id)).add(1)
              nerf = ExpantaNum.pow(1.22, nerf)
              return nerf
            },
            goalDescription() {return 'Reach '+format(1e100)+' despacit power'},
            canComplete() {
                return player.points.gte(1e100)
            },
            rewardEffect() {
                let ret = new ExpantaNum(challengeCompletions(this.layer, this.id)).div(4).add(1)
                return ret;
            },
            rewardDescription() {return "Your "+format(challengeCompletions(this.layer, this.id))+" completions raise despacit power gain"},
            rewardDisplay() { return "^"+format(this.rewardEffect()) },

      },
    }, 
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "D: Reset for unfinished despacit mods", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    branches: ["p"],
    layerShown(){return hasUpgrade("p", 25) || player.d.points.gte(1)}
})

addLayer("m", {
    name: "modders", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		    points: new ExpantaNum(0),
        power: new ExpantaNum(0)
    }},
    color: "#74248c",
    requires: new ExpantaNum("e1.85e173"), // Can be a function that takes requirement increases into account
    resource: "modders", // Name of prestige currency
    baseResource: "despacit power", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "m", description: "M: Reset for dilated matter", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    onPrestige() {
      player[this.layer].power = new ExpantaNum(0)
    },
        upgrades: {
            11: {
                title: "Jacorb",
                description: "Gain 1 prestige tree every second.",
                cost: new ExpantaNum(1),
                unlocked() { return player[this.layer].unlocked }, // The upgrade is only visible when this is true
            },
            12: {
                title: "Yhvr",
                description: "Modders multiply prestige tree gain.",
                cost: new ExpantaNum(5),
                effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player[this.layer].points.add(1)
                    ret = ret.add(1).tetrate(0.65)
                    return ret
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
                unlocked() { return hasUpgrade("m", 11) }, // The upgrade is only visible when this is true
            },
            13: {
                title: "Acamaeda",
                description: "Modders raise the prestige tree effect.",
                cost: new ExpantaNum(10),
                effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player[this.layer].points.add(1)
                    ret = ret.add(1).pow(0.25)
                    if (hasUpgrade("m", 32)) ret = ret.pow(3)
                    return ret
                },
                effectDisplay() { return "^"+format(this.effect()) }, // Add formatting to the effect
                unlocked() { return hasUpgrade("m", 12) }, // The upgrade is only visible when this is true
            },
            21: {
                title: "Aarex",
                description: "Unfinished despacit mods multiply prestige tree gain.",
                cost: new ExpantaNum(25),
                effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player.d.points.add(1).log10().add(1)
                    ret = ret.add(1).tetrate(0.25)
                    return ret
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
                unlocked() { return hasUpgrade("m", 13) }, // The upgrade is only visible when this is true
            },
            22: {
                title: "MEME",
                description: "Progress points raise the prestige tree effect.",
                cost: new ExpantaNum(50),
                effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player.p.points.max(0).add(1).slog(10).add(1)
                    ret = ret.add(1).pow(0.25)
                    return ret
                },
                effectDisplay() { return "^"+format(this.effect()) }, // Add formatting to the effect
                unlocked() { return hasUpgrade("m", 21) }, // The upgrade is only visible when this is true
            },
            23: {
                title: "unpingabot",
                description: "Prestige trees multiply their own gain.",
                cost: new ExpantaNum(75),
                effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player[this.layer].power.add(1).log10().add(1)
                    return ret
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
                unlocked() { return hasUpgrade("m", 22) }, // The upgrade is only visible when this is true
            },
            31: {
                title: "pg132",
                description: "Prestige trees multiply despacit power gain.",
                cost: new ExpantaNum(100),
                effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player[this.layer].power.pow(2)
                    if (hasUpgrade("m", 33)) ret = ret.pow(3)
                    ret = ExpantaNum.pow(10, ret)
                    return ret
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
                unlocked() { return hasUpgrade("m", 23) }, // The upgrade is only visible when this is true
            },
            32: {
                title: "loader3229",
                description: "Cube the Acamaeda effect.",
                cost: new ExpantaNum(150),
                unlocked() { return hasUpgrade("m", 31) }, // The upgrade is only visible when this is true
            },
            33: {
                title: "thepaperpilot",
                description: "Cube the prestige trees in the pg132 formula, and you unlock a (unimplemented) new layer.",
                cost: new ExpantaNum(175),
                unlocked() { return hasUpgrade("m", 32) }, // The upgrade is only visible when this is true
            },
        },
    getResetGain() {
		  let gain = ExpantaNum.slog(tmp[layer].baseAmount, 10).sub(2.35)
      return gain.floor().max(0)
    },
    getNextAt() {
		  let gain = ExpantaNum.tetrate(10, tmp[layer].getResetGain.plus(3.35))
      return gain
    },
    canReset() {
      return tmp[layer].getResetGain.gte(1)
    },
    getTreesGain() {
      let eff = new ExpantaNum(0)
      if (hasUpgrade("m", 11)) eff = eff.add(1)
      if (hasUpgrade("m", 12)) eff = eff.mul(upgradeEffect("m", 12))
      if (hasUpgrade("m", 21)) eff = eff.mul(upgradeEffect("m", 21))
      if (hasUpgrade("m", 23)) eff = eff.mul(upgradeEffect("m", 23))
      return eff
    },
    getTreesEffect() {
      let eff = player[this.layer].power.add(1).log10()
      eff = ExpantaNum.pow(2, eff)
      if (hasUpgrade("m", 13)) eff = eff.pow(upgradeEffect("m", 13))
      return eff
    },
    update(diff) {
      if (tmp.m.getTreesGain.gte(0)) player[this.layer].power = player[this.layer].power.add(tmp.m.getTreesGain.mul(diff))
    },
    midsection: [
      ["display-text", function() {return "You have "+format(player.m.power)+" prestige trees, (+"+format(tmp.m.getTreesGain)+"/s) making unfinished despacit mod cost scaling "+format(layers.m.getTreesEffect())+"x slower."}]
    ],
    prestigeButtonText() {
		return "Get <b>+"+formatWhole(tmp[layer].getResetGain)+"</b> modders<br><br>Next at "+formatWhole(tmp[layer].getNextAt)+" despacit power"
    },
    branches: ["p"],
    layerShown(){return hasMilestone("d", 4)}
})