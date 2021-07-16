import { pastels } from "../plugins/pastels"
import { wantedList } from "../plugins/wantedList"

export const state = () => ({
  wantedList: wantedList,
  pastels: pastels,
  cats: [],
  catColors: []
})

export const mutations = {
  enableCat(state, payload) {
    state.cats.find(cat => cat === payload).active = true
  },
  disableCat(state, payload) {
    state.cats.find(cat => cat === payload).active = false
  },
  addAllCats(state, payload) {
    state.cats = payload
  },
  addUniqueCats(state, payload) {
    var checkIfArray = function (array) {
      return (Array.isArray(array) === true && !array.length);
    }
    var fillCats = function () {
      // Get unique categories
      var uniqueCats = []
      var cats = []
      if (Array.isArray(payload.projects)) {
        for (let i = 0; i < payload.projects.length; i++) {
          const proj = payload.projects[i]
          for (let j = 0; j < proj.units.length; j++) {
            const cat = proj.units[j].category
            uniqueCats.push(cat)
          }
        }
      } else {
        for (let j = 0; j < payload.projects.units.length; j++) {
          const cat = payload.projects.units[j].category
          uniqueCats.push(cat)
        }
      }

      uniqueCats = _.sortBy(
        uniqueCats.filter((e, i) => uniqueCats.indexOf(e) === i)
      )

      for (let k = 0; k < uniqueCats.length; k++) {
        cats.push({
          category: uniqueCats[k],
          active: false,
          color: state.pastels[k],
          colorPassive: 'whitesmoke',
        })
      }
      state.cats = cats
    }

    // If force is true, refill categories
    if (payload.force === true) {
      fillCats()
    } else {
      // Else refill only when empty
      if (state.cats.length === 0) {
        fillCats()
      }
    }
  }
}

export const actions = {
  guidGenerator() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return (
      S4() +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      S4() +
      S4()
    )
  },
}