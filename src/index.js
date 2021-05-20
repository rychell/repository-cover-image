const gm = require('gm').subClass({
  imageMagick: true
})

// creating an image
const IMAGE_SIZE_WIDTH = 1920
const IMAGE_SIZE_HEIGHT = 1080
const IMAGE_BASE_FRAME = './src/frame.png'

const TECH_BAR_HEIGHT = 45

const OUTPUT_FILE = "drawing.png"

const LOOKUP_COLORS = {
  "JS": "#f1e05a",
  "TS": "#2b7489",
  "Ruby": "#701516"
}

const profile = {
  imageProfile: "./src/profile.png",
  username: "rychell",
  repositoryName: "knex-populate-plugin",
  techs: [{
      name: "JS",
      percent: 10
    },
    {
      name: "TS",
      percent: 70
    },
    {
      name: "Ruby",
      percent: 20
    },
  ]

}

run()

async function run() {
  await appendInsertProfileImage(profile)
  await appendRepositoryAndUserName(profile)
  await appendTechsUsed(profile.techs)
}

function appendInsertProfileImage(profile) {
  return new Promise((resolve, reject) => {
    gm(IMAGE_BASE_FRAME)
      .composite(profile.imageProfile)
      .geometry('+1470+120')
      .write(OUTPUT_FILE, function (err) {
        if (!err) resolve()
        else reject()
      });
  })
}
// annotate an image
function appendRepositoryAndUserName(profile) {
  return new Promise((resolve, reject) => {
    gm(OUTPUT_FILE)
      .font("./src/fonts/Roboto-Thin.ttf", 89)
      .out('-size', '1020x', 'caption:' + `${profile.username}/`)
      .out('-geometry', '+170+150')
      .out('-composite')
      .font("./src/fonts/Roboto-Bold.ttf", 89)
      .out('-size', '1020x', 'caption:' + profile.repositoryName)
      .out('-geometry', '+170+250')
      .out('-composite')
      .write(OUTPUT_FILE, function (err) {
        if (!err) resolve()
        else reject()
      });
  })
}

function appendTechsUsed(techs) {
  return new Promise(async (resolve, reject) => {
    try {
      let lastXPostion = 0
      for (let i = 0; i < techs.length; i++) {
        const tech = techs[i];
        const xInitialPostion = lastXPostion
        const yInitialPostion = IMAGE_SIZE_HEIGHT - TECH_BAR_HEIGHT
        const xFinalPostion = lastXPostion + tech.percent / 100 * IMAGE_SIZE_WIDTH
        const yFinalPostion = IMAGE_SIZE_HEIGHT
        await appendTech(tech, xInitialPostion, yInitialPostion, xFinalPostion, yFinalPostion)
        lastXPostion = xFinalPostion
      }
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

function appendTech(tech, xInitialPostion, yInitialPostion, xFinalPostion, yFinalPostion) {
  return new Promise((resolve, reject) => {
    gm(OUTPUT_FILE)
      .fill(LOOKUP_COLORS[tech.name])
      .drawRectangle(xInitialPostion, yInitialPostion, xFinalPostion, yFinalPostion)
      .write(OUTPUT_FILE, function (err) {
        if (!err) resolve()
        else reject()
      });
  })
}
